/* Données partagées des deux prestations — utilisées par la home, le parcours
   et les pages détail. Contenus à ajuster avec les vraies infos. */

export type Step = { time: string; label: string; it?: string; note: string }

/* Nuit Prestige (avec sortie en mer) — la Nuit à quai (sans sortie) saute
   directement de l'embarquement à la nuit à bord. */
export const NIGHT_STEPS: Step[] = [
  { time: '18 h 00', label: 'Embarquement', note: 'Accueil au ponton, le yacht et la cabine sont prêts.' },
  { time: 'Coucher de soleil', label: 'Sortie en mer', it: '& tapas', note: 'Une heure au large, plateau tapas de notre partenaire Una Mas.' },
  { time: '23 h 00', label: 'Nuit à bord', note: 'Bercés par le clapot, amarrés au calme du port.' },
  { time: '12 h 00', label: 'Petit-déjeuner', it: 'et départ', note: 'Petit-déjeuner inclus (Hôtel Neptune), checkout à midi.' },
]

export type Formule = {
  key: string
  num: string
  name: string
  it: string
  duration: string
  amount: string
  amountSolo?: string
  amountFrom?: boolean
  amountFlat?: boolean
  season?: string
  weekendNote?: string
  desc: string
  highlight?: string
}

export type Experience = {
  slug: string
  group: 'sortie' | 'nuit'
  value: string
  tag: string
  titlePlain: string
  titleIt: string
  tagline: string
  hero: string
  heroAlt: string
  intro: string
  includes: { label: string; detail: string }[]
  steps: Step[]
  price: { amount: string; unit: string; note: string }
  formulesKicker: string
  formulesTitlePlain: string
  formulesTitleIt: string
  formules?: Formule[]
  gallery: { src: string; alt: string }[]
}

export const EXPERIENCES: Experience[] = [
  {
    slug: 'sortie-en-mer-carnon',
    group: 'sortie',
    value: 'Sortie en mer',
    tag: '01 — Le jour',
    titlePlain: 'Sorties',
    titleIt: 'en mer',
    tagline: 'Le large, à votre rythme',
    hero: '/images/sortie-bateau.jpg',
    heroAlt: 'Le yacht Harmonie au mouillage sur une eau turquoise',
    intro:
      'Le yacht est à vous, le programme aussi. Vous embarquez avec votre capitaine — ou sans, si vous avez le permis — et la sortie se dessine selon vos envies : cap sur les criques, mouillage dans une eau claire, baignade, et l’apéritif face au soleil qui descend. Vous n’avez rien à organiser, tout est préparé avant votre arrivée.',
    includes: [
      { label: 'Yacht privatisé', detail: 'Le bateau est à vous, personne d’autre à bord' },
      { label: 'Avec capitaine, ou sans', detail: 'Sans : permis ≥ 5 ans + 50 h de navigation justifiables, −15 %' },
      { label: 'Sorties de 2 h à 8 h', detail: 'Au choix — entre 9 h et 21 h' },
      { label: 'Carburant & mouillage compris', detail: 'Aucun supplément surprise' },
      { label: 'Paddle, plateforme flottante, masque & tuba', detail: 'À bord, en libre usage' },
      { label: 'Jusqu’à 10 invités', detail: 'Anniversaires, EVJF, familles' },
    ],
    steps: [],
    price: {
      amount: '380 €',
      unit: 'la sortie',
      note: 'À partir de — sans capitaine dès 320 €. Sorties entre 9 h et 21 h.',
    },
    formulesKicker: 'Nos formules',
    formulesTitlePlain: 'Quatre façons de',
    formulesTitleIt: 'prendre le large',
    formules: [
      {
        key: '2h',
        num: '01',
        name: 'Deux',
        it: 'heures',
        duration: '2 h — idéale au couchant',
        amount: '380 €',
        amountSolo: '320 €',
        desc: 'La parenthèse : cap au large, baignade express et coupe à la main — parfaite sur le créneau de la golden hour.',
      },
      {
        key: '3h',
        num: '02',
        name: 'Trois',
        it: 'heures',
        duration: '3 h — crique & baignade',
        amount: '550 €',
        amountSolo: '470 €',
        desc: 'Le bon équilibre : une crique, un vrai mouillage, baignade et apéritif — sans regarder la montre.',
        highlight: 'La plus choisie',
      },
      {
        key: '4h',
        num: '03',
        name: 'Quatre',
        it: 'heures',
        duration: '4 h — la demi-journée',
        amount: '750 €',
        amountSolo: '640 €',
        desc: 'La demi-journée complète : deux mouillages possibles, apéritif dînatoire à bord, baignade à volonté.',
      },
      {
        key: '8h',
        num: '04',
        name: 'Ultra',
        it: 'Premium',
        duration: '8 h — la journée complète',
        amount: '1 250 €',
        amountFlat: true,
        desc: 'Cap sur Les Aresquiers, près de la plage : efoil à disposition, BBQ à bord, capitaine inclus — tout compris, pour une journée hors norme.',
        highlight: 'Ultra Premium',
      },
    ],
    gallery: [
      { src: '/images/sortie-bateau.jpg', alt: 'Le yacht au mouillage, eau turquoise' },
      { src: '/images/sortie-carre.jpg', alt: 'Le yacht vu depuis l’eau' },
      { src: '/images/hero-bateau.jpg', alt: 'Le yacht au soleil couchant' },
    ],
  },
  {
    slug: 'nuit-a-bord-yacht-carnon',
    group: 'nuit',
    value: 'Nuit à quai',
    tag: '02 — La nuit',
    titlePlain: 'Nuits insolites',
    titleIt: 'à quai',
    tagline: 'Votre suite sur l’eau, à Carnon',
    hero: '/images/nuit-bateau.jpg',
    heroAlt: 'Le yacht Harmonie au soir tombant, reflets dorés sur l’eau',
    intro:
      'À la tombée du jour, le yacht devient votre suite. Amarré au calme dans le port de Carnon, il vous offre ce qu’aucune chambre d’hôtel ne peut offrir : le clapot de l’eau contre la coque, le port qui s’endort autour de vous, et un réveil face à la mer. Deux façons d’en profiter, à partir de 18 h : la Nuit à quai, cocooning avec le petit-déjeuner au réveil, ou la Nuit Prestige, avec une sortie en mer au coucher de soleil et son plateau de tapas. Formule intimiste, réservée à deux personnes.',
    includes: [
      { label: 'Le yacht pour vous seuls', detail: '18 h → 12 h le lendemain' },
      { label: 'Jusqu’à 2 personnes', detail: 'Formule intimiste' },
      { label: 'Nuit Prestige : sortie en mer au coucher de soleil', detail: 'Avec tapas de notre partenaire Una Mas' },
      { label: 'Nuit à quai : amarré au calme', detail: 'Sans sortie en mer — disponible à partir du 1er septembre' },
      { label: 'Petit-déjeuner inclus', detail: 'Hôtel Neptune, juste à côté du ponton' },
      { label: 'Nuit Prestige le week-end', detail: 'Réservation directe avec notre équipe' },
    ],
    steps: NIGHT_STEPS,
    price: {
      amount: '250 €',
      unit: 'la nuit',
      note: 'À partir de — avec sortie en mer au coucher de soleil et tapas Una Mas dès 380 €.',
    },
    formulesKicker: 'Nos formules',
    formulesTitlePlain: 'Deux façons de',
    formulesTitleIt: 'passer la nuit',
    formules: [
      {
        key: 'sans-sortie',
        num: '01',
        name: 'Nuit',
        it: 'à quai',
        duration: '18 h — jusqu’à 12 h le lendemain',
        amount: '250 €',
        season: 'Disponible à partir du 1er septembre',
        desc: 'Le cocooning à deux : le yacht amarré au calme dans le port, sans sortie en mer, petit-déjeuner inclus le lendemain (Hôtel Neptune).',
      },
      {
        key: 'prestige',
        num: '02',
        name: 'Nuit',
        it: 'Prestige',
        duration: '18 h — jusqu’à 12 h le lendemain',
        amount: '380 €',
        weekendNote: 'Le week-end (ven-dim), cette formule se réserve directement avec notre équipe.',
        desc: 'La formule signature : sortie en mer au coucher de soleil, plateau tapas (Una Mas), nuit à bord, petit-déjeuner inclus le lendemain (Hôtel Neptune).',
        highlight: 'La plus demandée',
      },
    ],
    gallery: [
      { src: '/images/nuit-bateau.jpg', alt: 'Le yacht au soir tombant' },
      { src: '/images/reflets.jpg', alt: 'Reflets dorés sur l’eau' },
      { src: '/images/calme-bateau.jpg', alt: 'Le yacht sur une mer calme' },
    ],
  },
]

/* Avis clients : voir src/reviews.ts (vrais avis Google). */
