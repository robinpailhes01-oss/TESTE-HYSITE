import type { VercelRequest, VercelResponse } from '@vercel/node'

/* Lue par la page /merci au retour de la page de paiement SumUp — confirme
   côté serveur que l'acompte a bien été encaissé avant d'afficher quoi que ce
   soit (on ne fait jamais confiance à l'URL seule).

   Le récapitulatif affiché vient de notre propre ligne pending_checkouts ;
   le statut « payé », lui, vient toujours de SumUp. */

const SUPABASE_URL = 'https://szdfpjyytwedhochvzfd.supabase.co'
const SUMUP_CHECKOUTS_URL = 'https://api.sumup.com/v0.1/checkouts'

type PendingCheckout = {
  sumup_checkout_id: string | null
  formule: string
  customer_name: string
  customer_email: string
  booking_date: string | null
  total_amount: string | number
  deposit_amount: string | number
  status: string
}

type SumUpCheckout = { id?: string; status?: string; amount?: number }

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const apiKey = process.env.SUMUP_API_KEY
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!apiKey || !serviceKey) {
    return res.status(500).json({ error: 'Configuration manquante.' })
  }

  const reference = typeof req.query.ref === 'string' ? req.query.ref : null
  if (!reference || !/^[0-9a-f-]{36}$/i.test(reference)) {
    return res.status(400).json({ error: 'Référence manquante.' })
  }

  try {
    const pendingRes = await fetch(
      `${SUPABASE_URL}/rest/v1/pending_checkouts?reference=eq.${reference}&select=sumup_checkout_id,formule,customer_name,customer_email,booking_date,total_amount,deposit_amount,status`,
      { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` } },
    )
    const rows = (await pendingRes.json()) as PendingCheckout[]
    const pending = Array.isArray(rows) ? rows[0] : undefined
    if (!pending) {
      return res.status(404).json({ error: 'Paiement introuvable.' })
    }

    /* Source de vérité du statut : SumUp. On interroge par notre référence,
       ce qui fonctionne même si l'id du checkout n'a pas pu être enregistré. */
    const lookup = pending.sumup_checkout_id
      ? `${SUMUP_CHECKOUTS_URL}/${encodeURIComponent(pending.sumup_checkout_id)}`
      : `${SUMUP_CHECKOUTS_URL}?checkout_reference=${encodeURIComponent(reference)}`

    const sumupRes = await fetch(lookup, { headers: { Authorization: `Bearer ${apiKey}` } })
    if (!sumupRes.ok) {
      console.error('verify-checkout: SumUp a répondu', sumupRes.status, await sumupRes.text())
      return res.status(502).json({ error: 'Vérification impossible.' })
    }
    const payload = (await sumupRes.json()) as SumUpCheckout | SumUpCheckout[]
    const checkout = Array.isArray(payload) ? payload[0] : payload

    return res.status(200).json({
      paid: checkout?.status === 'PAID',
      deposit: Number(pending.deposit_amount),
      email: pending.customer_email,
      formule: pending.formule,
      montantTotal: String(pending.total_amount),
      nom: pending.customer_name,
      date: pending.booking_date,
    })
  } catch (err) {
    console.error('verify-checkout: erreur', err)
    return res.status(500).json({ error: 'Vérification impossible.' })
  }
}
