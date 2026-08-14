/* ---------------------------------------------------------------------------
   Catalogue des tarifs — source unique de vérité.
   Utilisé par le site (affichage, formulaire) ET par la fonction serveur
   Stripe (Supabase Edge Function stripe-webhook) pour calculer le montant et
   le type de réservation : on ne fait jamais confiance à un montant envoyé
   par le navigateur, on ne recalcule qu'à partir de ce fichier, via l'id.

   Aligné avec agent_config.offers (Supabase, config de Léa) au 2026-06.
--------------------------------------------------------------------------- */

export const DEPOSIT_RATE = 0.3 // acompte de 30 %, réglé en ligne à la réservation

/* Doit correspondre exactement aux valeurs acceptées par
   bookings.booking_type côté Supabase (contrainte CHECK). */
export type BookingType = 'sortie_privative' | 'nuit_prestige' | 'nuit_insolite'

export type PriceItem = {
  id: string
  group: 'sortie' | 'nuit'
  bookingType: BookingType
  label: string
  detail: string
  amount: number // prix total en euros ("à partir de" pour nuit-insolite-sans-sortie)
  /* Nuit Prestige le week-end (ven-dim) : pas de paiement en ligne, contact
     direct avec l'équipe (règle métier de Léa — escalade humaine obligatoire). */
  weekendRequiresContact?: boolean
}

function deposit(amount: number) {
  return Math.round(amount * DEPOSIT_RATE)
}

export const PRICES: PriceItem[] = [
  { id: 'sortie-2h-capitaine', group: 'sortie', bookingType: 'sortie_privative', label: 'Sortie 2 h — avec capitaine', detail: '2 heures, capitaine inclus', amount: 380 },
  { id: 'sortie-2h-solo', group: 'sortie', bookingType: 'sortie_privative', label: 'Sortie 2 h — sans capitaine', detail: '2 heures, permis côtier requis', amount: 320 },
  { id: 'sortie-3h-capitaine', group: 'sortie', bookingType: 'sortie_privative', label: 'Sortie 3 h — avec capitaine', detail: '3 heures, capitaine inclus', amount: 550 },
  { id: 'sortie-3h-solo', group: 'sortie', bookingType: 'sortie_privative', label: 'Sortie 3 h — sans capitaine', detail: '3 heures, permis côtier requis', amount: 470 },
  { id: 'sortie-4h-capitaine', group: 'sortie', bookingType: 'sortie_privative', label: 'Sortie 4 h — avec capitaine', detail: '4 heures, capitaine inclus', amount: 750 },
  { id: 'sortie-4h-solo', group: 'sortie', bookingType: 'sortie_privative', label: 'Sortie 4 h — sans capitaine', detail: '4 heures, permis côtier requis', amount: 640 },
  {
    id: 'nuit-prestige',
    group: 'nuit',
    bookingType: 'nuit_prestige',
    label: 'Nuit Prestige',
    detail: 'Été (mai-septembre) — avec sortie en mer, 18 h à 12 h le lendemain',
    amount: 380,
    weekendRequiresContact: true,
  },
  {
    id: 'nuit-insolite-avec-sortie',
    group: 'nuit',
    bookingType: 'nuit_insolite',
    label: 'Nuit Insolite — avec sortie en mer',
    detail: 'Hiver (octobre-avril) — yacht chauffé, 18 h à 12 h le lendemain',
    amount: 380,
  },
  {
    id: 'nuit-insolite-sans-sortie',
    group: 'nuit',
    bookingType: 'nuit_insolite',
    label: 'Nuit Insolite — sans sortie en mer',
    detail: 'Hiver (octobre-avril) — yacht chauffé, amarré au calme',
    amount: 180,
  },
]

export function findPrice(id: string) {
  return PRICES.find((p) => p.id === id) ?? null
}

export function depositFor(id: string) {
  const price = findPrice(id)
  return price ? deposit(price.amount) : null
}
