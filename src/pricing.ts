/* ---------------------------------------------------------------------------
   Catalogue des tarifs — source unique de vérité.
   Utilisé par le site (affichage, formulaire) ET par les fonctions serveur
   (api/create-checkout-session.js) pour calculer le montant Stripe : ne
   jamais faire confiance à un montant envoyé par le navigateur, on ne
   recalcule qu'à partir de ce fichier, côté serveur, via l'id.
--------------------------------------------------------------------------- */

export const DEPOSIT_RATE = 0.3 // acompte de 30 %, réglé en ligne à la réservation

export type PriceItem = {
  id: string
  group: 'sortie' | 'nuit'
  label: string
  detail: string
  amount: number // prix total en euros
}

function deposit(amount: number) {
  return Math.round(amount * DEPOSIT_RATE)
}

export const PRICES: PriceItem[] = [
  { id: 'sortie-2h-capitaine', group: 'sortie', label: 'Sortie 2 h — avec capitaine', detail: '2 heures, capitaine inclus', amount: 380 },
  { id: 'sortie-2h-solo', group: 'sortie', label: 'Sortie 2 h — sans capitaine', detail: '2 heures, permis côtier requis', amount: 320 },
  { id: 'sortie-3h-capitaine', group: 'sortie', label: 'Sortie 3 h — avec capitaine', detail: '3 heures, capitaine inclus', amount: 550 },
  { id: 'sortie-3h-solo', group: 'sortie', label: 'Sortie 3 h — sans capitaine', detail: '3 heures, permis côtier requis', amount: 470 },
  { id: 'sortie-4h-capitaine', group: 'sortie', label: 'Sortie 4 h — avec capitaine', detail: '4 heures, capitaine inclus', amount: 750 },
  { id: 'sortie-4h-solo', group: 'sortie', label: 'Sortie 4 h — sans capitaine', detail: '4 heures, permis côtier requis', amount: 640 },
  { id: 'nuit-a-quai', group: 'nuit', label: 'Nuit insolite à quai', detail: 'De 18 h à 10 h, petit-déjeuner inclus', amount: 490 },
]

export function findPrice(id: string) {
  return PRICES.find((p) => p.id === id) ?? null
}

export function depositFor(id: string) {
  const price = findPrice(id)
  return price ? deposit(price.amount) : null
}
