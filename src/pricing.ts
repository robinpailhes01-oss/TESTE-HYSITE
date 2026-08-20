/* ---------------------------------------------------------------------------
   Catalogue des tarifs — source unique de vérité.
   Utilisé par le site (affichage, formulaire) ET par la fonction serveur
   Stripe (Supabase Edge Function stripe-webhook) pour calculer le montant et
   le type de réservation : on ne fait jamais confiance à un montant envoyé
   par le navigateur, on ne recalcule qu'à partir de ce fichier, via l'id.

   Aligné avec agent_config.offers (Supabase, config de Léa) au 2026-08.
--------------------------------------------------------------------------- */

export const DEPOSIT_RATE = 0.3 // acompte de 30 %, réglé en ligne à la réservation

/* Créneau des sorties : entre 9 h et 21 h, 1 h de battement laissée entre
   deux sorties (cf. src/availability.ts). */
export const SORTIE_WINDOW = { openHour: 9, closeHour: 21, bufferHours: 1 }

/* Doit correspondre exactement aux valeurs acceptées par
   bookings.booking_type côté Supabase (contrainte CHECK). La formule
   « Nuit à quai — petit-déjeuner seul » réutilise 'nuit_insolite' côté base
   (seules 3 valeurs sont acceptées), le libellé affiché reste indépendant. */
export type BookingType = 'sortie_privative' | 'nuit_prestige' | 'nuit_insolite'

export type PriceItem = {
  id: string
  group: 'sortie' | 'nuit'
  bookingType: BookingType
  label: string
  detail: string
  amount: number // prix total en euros
  durationHours?: number // pour calculer l'heure de fin d'une sortie
  /* Première date réservable (YYYY-MM-DD) — ex. Nuit à quai à 250 €,
     ouverte à partir du 1er septembre. */
  availableFrom?: string
}

function deposit(amount: number) {
  return Math.round(amount * DEPOSIT_RATE)
}

export const PRICES: PriceItem[] = [
  { id: 'sortie-2h-capitaine', group: 'sortie', bookingType: 'sortie_privative', label: 'Sortie 2 h — avec capitaine', detail: '2 heures, capitaine inclus', amount: 380, durationHours: 2 },
  { id: 'sortie-2h-solo', group: 'sortie', bookingType: 'sortie_privative', label: 'Sortie 2 h — sans capitaine', detail: '2 heures, permis côtier requis', amount: 320, durationHours: 2 },
  { id: 'sortie-3h-capitaine', group: 'sortie', bookingType: 'sortie_privative', label: 'Sortie 3 h — avec capitaine', detail: '3 heures, capitaine inclus', amount: 550, durationHours: 3 },
  { id: 'sortie-3h-solo', group: 'sortie', bookingType: 'sortie_privative', label: 'Sortie 3 h — sans capitaine', detail: '3 heures, permis côtier requis', amount: 470, durationHours: 3 },
  { id: 'sortie-4h-capitaine', group: 'sortie', bookingType: 'sortie_privative', label: 'Sortie 4 h — avec capitaine', detail: '4 heures, capitaine inclus', amount: 750, durationHours: 4 },
  { id: 'sortie-4h-solo', group: 'sortie', bookingType: 'sortie_privative', label: 'Sortie 4 h — sans capitaine', detail: '4 heures, permis côtier requis', amount: 640, durationHours: 4 },
  {
    id: 'sortie-8h-ultra-premium',
    group: 'sortie',
    bookingType: 'sortie_privative',
    label: 'Sortie Ultra Premium 8 h',
    detail: 'Journée complète, direction Les Aresquiers — efoil et BBQ à bord, capitaine et tout compris',
    amount: 1250,
    durationHours: 8,
  },
  {
    id: 'nuit-prestige',
    group: 'nuit',
    bookingType: 'nuit_prestige',
    label: 'Nuit Prestige — avec sortie en mer',
    detail: 'Sortie en mer au coucher de soleil, tapas (Una Mas) et petit-déjeuner sur plateau (Hôtel Neptune) inclus, servi jusqu’à 10 h — 18 h à 12 h le lendemain',
    amount: 380,
  },
  {
    id: 'nuit-sans-sortie',
    group: 'nuit',
    bookingType: 'nuit_insolite',
    label: 'Nuit à quai — petit-déjeuner',
    detail: 'Amarré au calme, petit-déjeuner sur plateau (Hôtel Neptune) inclus le lendemain matin, servi jusqu’à 10 h — 18 h à 12 h le lendemain. Disponible à partir du 1er septembre.',
    amount: 250,
    availableFrom: '2026-09-01',
  },
]

export function findPrice(id: string) {
  return PRICES.find((p) => p.id === id) ?? null
}

export function depositFor(id: string) {
  const price = findPrice(id)
  return price ? deposit(price.amount) : null
}

/* Codes promo — remise sur le montant total (donc sur l'acompte ET le
   solde), pas seulement sur ce qui est payé en ligne aujourd'hui.
   BIENVENUE5 est distribué en échange d'un email (popup site). */
export const PROMO_CODES: Record<string, number> = {
  BIENVENUE5: 0.05,
}

export function promoDiscountRate(code?: string | null): number {
  if (!code) return 0
  return PROMO_CODES[code.trim().toUpperCase()] ?? 0
}

export function applyPromo(amount: number, code?: string | null): number {
  const rate = promoDiscountRate(code)
  return rate ? Math.round(amount * (1 - rate)) : amount
}
