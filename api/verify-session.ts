import type { VercelRequest, VercelResponse } from '@vercel/node'
import Stripe from 'stripe'

/* Lue par la page /merci après retour de Stripe Checkout — confirme
   côté serveur que le paiement a bien été effectué avant d'afficher
   quoi que ce soit (on ne fait jamais confiance à l'URL seule). */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    return res.status(500).json({ error: 'Configuration manquante.' })
  }

  const sessionId = typeof req.query.session_id === 'string' ? req.query.session_id : null
  if (!sessionId) {
    return res.status(400).json({ error: 'session_id manquant.' })
  }

  const stripe = new Stripe(secretKey)

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    return res.status(200).json({
      paid: session.payment_status === 'paid',
      deposit: session.amount_total !== null ? session.amount_total / 100 : null,
      email: session.customer_details?.email ?? session.customer_email ?? null,
      formule: session.metadata?.formule ?? null,
      montantTotal: session.metadata?.montantTotal ?? null,
      nom: session.metadata?.nom ?? null,
      date: session.metadata?.date ?? null,
    })
  } catch (err) {
    console.error('Stripe verify error', err)
    return res.status(404).json({ error: 'Session introuvable.' })
  }
}
