import type { VercelRequest, VercelResponse } from '@vercel/node'
import Stripe from 'stripe'
import { findPrice, depositFor } from '../src/pricing'

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
  const { priceId, name, email, guests, message, date } = body

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

  const stripe = new Stripe(secretKey)
  const origin = (req.headers.origin as string) || `https://${req.headers.host}`
  /* date arrive en YYYY-MM-DD (sans heure) — new Date() la lit en UTC minuit ;
     on formate explicitement en UTC pour ne jamais la décaler d'un jour selon
     le fuseau du serveur. */
  const dateStr = typeof date === 'string' ? date : ''
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
      cancel_url: `${origin}/${price.group === 'sortie' ? 'sorties-en-mer' : 'nuits-a-quai'}#reservation`,
    })

    return res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error', err)
    return res.status(500).json({ error: 'Impossible de créer la session de paiement.' })
  }
}
