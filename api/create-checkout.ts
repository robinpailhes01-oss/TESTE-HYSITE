import type { VercelRequest, VercelResponse } from '@vercel/node'
import { randomUUID } from 'node:crypto'
import { findPrice, applyPromo, promoDiscountRate, amountDueOnline, paymentModeFor } from '../src/pricing.js'

/* Paiement en ligne SumUp (Harmonie Group) — réglé par carte sur la page
   hébergée par SumUp, puis retour sur /merci. Ce qui est encaissé dépend de la
   formule : l'acompte de 30 % dans le cas général, la totalité pour les nuits
   insolites (cf. paymentMode dans src/pricing.ts).

   Contrairement à Stripe, un checkout SumUp ne transporte aucune métadonnée
   libre : ce que le client a choisi est écrit AVANT le paiement dans la table
   pending_checkouts (clé = notre référence), et le webhook relit cette ligne
   quand SumUp confirme l'encaissement.

   Variables d'environnement (Vercel) :
     SUMUP_API_KEY              clé secrète SumUp (sup_sk_...)
     SUMUP_MERCHANT_CODE        code marchand Harmonie Group (MCxxxxxx)
     SUPABASE_SERVICE_ROLE_KEY  pour écrire l'intention de réservation */

const SUPABASE_URL = 'https://szdfpjyytwedhochvzfd.supabase.co'
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6ZGZwanl5dHdlZGhvY2h2emZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NzExMDEsImV4cCI6MjA5NTM0NzEwMX0.LKISYgm1CBPYP4VfvH_S6C7meSQb1H57LxkldF9UhC0'
const SUMUP_CHECKOUTS_URL = 'https://api.sumup.com/v0.1/checkouts'
const WEBHOOK_URL = `${SUPABASE_URL}/functions/v1/sumup-webhook`

type BookedSlot = { date: string; start_time: string | null; end_time: string | null; booking_type: string }

function toMinutes(t: string) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

/* Re-vérifie côté serveur que le créneau demandé est toujours libre (deux
   navigateurs peuvent avoir chargé la même disponibilité avant que l'un des
   deux ne paie) — dernière barrière avant de créer le checkout. */
async function isSlotTaken(dateOnly: string, group: string, startTime: string, durationHours: number) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_booked_slots`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ p_from: dateOnly, p_to: dateOnly }),
    })
    if (!res.ok) return false
    const slots = (await res.json()) as BookedSlot[]
    const daySlots = slots.filter((s) => s.date === dateOnly)
    if (daySlots.some((s) => s.booking_type === 'blocked')) return true

    if (group === 'nuit') {
      return daySlots.some(
        (s) =>
          s.booking_type === 'nuit_prestige' ||
          s.booking_type === 'nuit_insolite' ||
          (s.booking_type === 'sortie_privative' && s.end_time && toMinutes(s.end_time) > 17 * 60),
      )
    }

    const nightThatDay = daySlots.some((s) => s.booking_type === 'nuit_prestige' || s.booking_type === 'nuit_insolite')
    const [h] = startTime.split(':').map(Number)
    const start = h
    const end = h + durationHours
    if (nightThatDay && end > 17) return true
    return daySlots.some((s) => {
      if (s.booking_type !== 'sortie_privative' || !s.start_time || !s.end_time) return false
      const busyStart = toMinutes(s.start_time) / 60 - 1
      const busyEnd = toMinutes(s.end_time) / 60 + 1
      return start < busyEnd && end > busyStart
    })
  } catch {
    return false
  }
}

/* Crée le checkout SumUp pour le montant dû en ligne sur une formule.
   Le montant n'est JAMAIS accepté depuis le navigateur : on ne recalcule
   qu'à partir du catalogue serveur (src/pricing.ts), via l'id envoyé. */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Méthode non autorisée.' })
  }

  const apiKey = process.env.SUMUP_API_KEY
  const merchantCode = process.env.SUMUP_MERCHANT_CODE
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!apiKey || !merchantCode || !serviceKey) {
    console.error('create-checkout: configuration incomplète', {
      apiKey: Boolean(apiKey),
      merchantCode: Boolean(merchantCode),
      serviceKey: Boolean(serviceKey),
    })
    return res.status(500).json({ error: 'Le paiement en ligne n’est pas encore configuré.' })
  }

  const body = (req.body ?? {}) as Record<string, unknown>
  const { priceId, name, email, guests, message, date, startTime, promoCode } = body

  if (
    typeof priceId !== 'string' ||
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    !name.trim() ||
    !email.trim()
  ) {
    return res.status(400).json({ error: 'Requête invalide.' })
  }

  const price = findPrice(priceId)
  if (!price) {
    return res.status(400).json({ error: 'Formule introuvable.' })
  }

  /* Le code promo réduit le montant TOTAL (donc l'acompte ET le solde) —
     jamais accepté tel quel du navigateur, recalculé ici à partir de
     src/pricing.ts comme le reste du prix. */
  const promoCodeStr = typeof promoCode === 'string' ? promoCode.trim() : ''
  const discountRate = promoDiscountRate(promoCodeStr)
  const montantTotal = applyPromo(price.amount, promoCodeStr)
  const payFull = paymentModeFor(price) === 'full'
  const amountOnline = amountDueOnline(price, montantTotal)

  const dateStr = typeof date === 'string' ? date : ''

  if (price.availableFrom && dateStr && dateStr < price.availableFrom) {
    return res
      .status(400)
      .json({ error: `Cette formule est disponible à partir du ${price.availableFrom.split('-').reverse().join('/')}.` })
  }
  const startTimeStr = typeof startTime === 'string' && /^\d{2}:\d{2}$/.test(startTime) ? startTime : ''
  const endTimeStr = (() => {
    if (!startTimeStr) return ''
    if (price.group === 'nuit') return '12:00' // check-out le lendemain
    if (!price.durationHours) return ''
    const [h, m] = startTimeStr.split(':').map(Number)
    const endH = h + price.durationHours
    return `${String(endH).padStart(2, '0')}:${String(m).padStart(2, '0')}`
  })()

  if (dateStr && (price.group === 'nuit' || (startTimeStr && price.durationHours))) {
    const taken = await isSlotTaken(dateStr, price.group, startTimeStr, price.durationHours ?? 0)
    if (taken) {
      return res
        .status(409)
        .json({ error: 'Ce créneau vient d’être réservé. Choisissez une autre date ou une autre heure.' })
    }
  }

  const origin = (req.headers.origin as string) || `https://${req.headers.host}`
  /* date arrive en YYYY-MM-DD (sans heure) — new Date() la lit en UTC minuit ;
     on formate explicitement en UTC pour ne jamais la décaler d'un jour selon
     le fuseau du serveur. */
  const dateLabel = dateStr
    ? new Date(dateStr).toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      })
    : ''

  const reference = randomUUID()

  /* L'intention de réservation est écrite AVANT l'appel à SumUp : si le client
     paie, le webhook doit pouvoir la retrouver, même si notre réponse HTTP
     s'est perdue en route. */
  const insert = await fetch(`${SUPABASE_URL}/rest/v1/pending_checkouts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      reference,
      price_id: priceId,
      booking_type: price.bookingType,
      price_group: price.group,
      formule: price.label,
      customer_name: name.trim(),
      customer_email: email.trim(),
      booking_date: dateStr || null,
      start_time: startTimeStr || null,
      end_time: endTimeStr || null,
      party_size: typeof guests === 'string' && guests.trim() ? Number.parseInt(guests, 10) : null,
      message: typeof message === 'string' && message.trim() ? message.slice(0, 400) : null,
      promo_code: discountRate ? promoCodeStr.toUpperCase() : null,
      total_amount: montantTotal,
      deposit_amount: amountOnline,
    }),
  })

  if (!insert.ok) {
    console.error('create-checkout: écriture pending_checkouts échouée', insert.status, await insert.text())
    return res.status(500).json({ error: 'Impossible de préparer le paiement.' })
  }

  const description = `${payFull ? 'Réservation' : 'Acompte 30 %'} — ${price.label}${
    dateLabel ? ` — ${dateLabel}` : ''
  }`.slice(0, 100)

  try {
    const sumup = await fetch(SUMUP_CHECKOUTS_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        checkout_reference: reference,
        amount: amountOnline,
        currency: 'EUR',
        merchant_code: merchantCode,
        description,
        /* Callback serveur : SumUp appelle cette URL quand le paiement atteint
           son état final. La référence est dans l'URL, le webhook n'a donc pas
           besoin de comprendre le format exact du corps envoyé par SumUp. */
        return_url: `${WEBHOOK_URL}?ref=${reference}`,
        /* Retour du client dans le navigateur après le paiement. */
        redirect_url: `${origin}/merci?ref=${reference}`,
        hosted_checkout: { enabled: true },
      }),
    })

    const checkout = (await sumup.json()) as {
      id?: string
      hosted_checkout_url?: string
      message?: string
      error_message?: string
    }

    if (!sumup.ok || !checkout.hosted_checkout_url) {
      console.error('create-checkout: SumUp a refusé la création', sumup.status, checkout)
      return res.status(502).json({ error: 'Impossible de créer le paiement. Réessayez dans un instant.' })
    }

    /* On retient l'id SumUp en face de notre référence : le webhook s'en sert
       pour relire le checkout et vérifier le montant réellement encaissé. */
    await fetch(`${SUPABASE_URL}/rest/v1/pending_checkouts?reference=eq.${reference}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ sumup_checkout_id: checkout.id ?? null }),
    })

    return res.status(200).json({ url: checkout.hosted_checkout_url })
  } catch (err) {
    console.error('create-checkout: appel SumUp échoué', err)
    return res.status(500).json({ error: 'Impossible de créer le paiement.' })
  }
}
