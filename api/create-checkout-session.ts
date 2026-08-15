import type { VercelRequest, VercelResponse } from '@vercel/node'
import Stripe from 'stripe'
import { findPrice, depositFor } from '../src/pricing.js'

const SUPABASE_URL = 'https://szdfpjyytwedhochvzfd.supabase.co'
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6ZGZwanl5dHdlZGhvY2h2emZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NzExMDEsImV4cCI6MjA5NTM0NzEwMX0.LKISYgm1CBPYP4VfvH_S6C7meSQb1H57LxkldF9UhC0'

type BookedSlot = { date: string; start_time: string | null; end_time: string | null; booking_type: string }

function toMinutes(t: string) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

/* Re-vérifie côté serveur que le créneau demandé est toujours libre (deux
   navigateurs peuvent avoir chargé la même disponibilité avant que l'un des
   deux ne paie) — dernière barrière avant de créer la session Stripe. */
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

/* Crée une session Stripe Checkout pour l'acompte de 30 % d'une formule.
   Le montant n'est JAMAIS accepté depuis le navigateur : on ne recalcule
   qu'à partir du catalogue serveur (src/pricing.ts), via l'id envoyé. */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Méthode non autorisée.' })
  }

  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    return res
      .status(500)
      .json({ error: 'Le paiement en ligne n’est pas encore configuré (clé Stripe manquante).' })
  }

  const body = (req.body ?? {}) as Record<string, unknown>
  const { priceId, name, email, guests, message, date, startTime } = body

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
  const deposit = depositFor(priceId)
  if (!price || deposit === null) {
    return res.status(400).json({ error: 'Formule introuvable.' })
  }

  const dateStr = typeof date === 'string' ? date : ''

  if (price.availableFrom && dateStr && dateStr < price.availableFrom) {
    return res.status(400).json({ error: `Cette formule est disponible à partir du ${price.availableFrom.split('-').reverse().join('/')}.` })
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

  const stripe = new Stripe(secretKey)
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

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            unit_amount: deposit * 100,
            product_data: {
              name: `Acompte — ${price.label}`,
              description: `Acompte de 30 % (${deposit} € sur ${price.amount} €)${
                dateLabel ? ` — ${dateLabel}` : ''
              }`,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        priceId,
        bookingType: price.bookingType,
        group: price.group,
        formule: price.label,
        montantTotal: String(price.amount),
        acompte: String(deposit),
        nom: name,
        email,
        date: dateStr,
        startTime: startTimeStr,
        endTime: endTimeStr,
        invites: typeof guests === 'string' ? guests : '',
        message: typeof message === 'string' ? message.slice(0, 400) : '',
      },
      payment_intent_data: {
        metadata: {
          formule: price.label,
          nom: name,
          date: dateStr,
        },
      },
      success_url: `${origin}/merci?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${price.group === 'sortie' ? 'sortie-en-mer-carnon' : 'nuit-a-bord-yacht-carnon'}#reservation`,
    })

    return res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error', err)
    return res.status(500).json({ error: 'Impossible de créer la session de paiement.' })
  }
}
