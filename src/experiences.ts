/* Données partagées des deux prestations — utilisées par la home, le parcours
   et les pages détail. Contenus à ajuster avec les vraies infos. */

export type Step = { time: string; label: string; it?: string; note: string }

export const DAY_STEPS: Step[] = [
  { time: '10 h 00', label: 'Embarquement', note: 'Accueil au ponton, café servi à bord.' },
  { time: '11 h 30', label: 'Cap sur', it: 'les criques', note: 'Le skipper choisit avec vous le mouillage du jour.' },
  { time: '13 h 00', label: 'Déjeuner', it: 'au mouillage', note: 'Table dressée sur le pont, baignade à volonté.' },
  { time: '17 h 30', label: 'La', it: 'golden hour', note: 'Apéritif face au soleil qui descend.' },
  { time: '19 h 00', label: 'Retour au port', note: 'Dans la lumière du soir, sans se presser.' },
]

export const NIGHT_STEPS: Step[] = [
  { time: '18 h 00', label: 'Embarquement', note: 'Le yacht est prêt, la cabine aussi.' },
  { time: '19 h 00', label: 'Champagne', it: 'au carré', note: 'Coupe de bienvenue face au port.' },
  { time: '21 h 00', label: 'Soirée', it: 'sur le pont', note: 'Dîner livré à bord sur demande.' },
  { time: '23 h 00', label: 'Nuit à bord', note: 'Bercés par le clapot, loin de tout.' },
  { time: '9 h 00', label: 'Réveil', it: 'face à la mer', note: 'Petit-déjeuner servi sur le pont.' },
]

export type Formule = {
  num: string
  name: string
  it: string
  duration: string
  amount: string
  desc: string
  highlight?: string
}

export type Experience = {
  slug: string
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
  formules?: Formule[]
  gallery: { src: string; alt: string }[]
}

export const EXPERIENCES: Experience[] = [
  {
    slug: 'sorties-en-mer',
    value: 'Sortie en mer',
    tag: '01 — Le jour',
    titlePlain: 'Sorties',
    titleIt: 'en mer',
    tagline: 'Le large, à votre rythme',
    hero: '/images/sortie-bateau.jpg',
    heroAlt: 'Le yacht Harmonie au mouillage sur une eau turquoise',
    intro:
      'Le yacht est à vous, le programme aussi. Vous embarquez avec votre skipper, et la journée se dessine selon vos envies : cap sur les criques, mouillage dans une eau claire, déjeuner sur le pont, baignade, paddle — et le retour au port dans la lumière du soir. Vous n’avez rien à organiser, tout est préparé avant votre arrivée.',
    includes: [
      { label: 'Yacht privatisé avec skipper', detail: 'Le bateau est à vous, personne d’autre à bord' },
      { label: 'Demi-journée ou journée entière', detail: '4 h — 8 h' },
      { label: 'Carburant & mouillage compris', detail: 'Aucun supplément surprise' },
      { label: 'Plateforme de baignade & équipements', detail: 'Paddle, masques, serviettes' },
      { label: 'Apéritif au soleil couchant', detail: 'Inclus' },
      { label: 'Jusqu’à 8 invités', detail: 'Anniversaires, EVJF, familles' },
    ],
    steps: DAY_STEPS,
    price: {
      amount: '890 €',
      unit: 'la journée',
      note: 'À partir de — demi-journée disponible sur demande.',
    },
    /* Tarifs indicatifs — à ajuster avant mise en ligne. */
    formules: [
      {
        num: '01',
        name: 'Golden',
        it: 'hour',
        duration: '2 h 30 — au couchant',
        amount: '350 €',
        desc: 'La sortie du soir : cap au large à la golden hour, apéritif servi face au soleil qui descend, retour de nuit tombante.',
      },
      {
        num: '02',
        name: 'Demi-',
        it: 'journée',
        duration: '4 h — matin ou après-midi',
        amount: '590 €',
        desc: 'L’essentiel d’une journée en mer : une crique, un mouillage, baignade et paddle — condensés en une demi-journée.',
      },
      {
        num: '03',
        name: 'Journée',
        it: 'entière',
        duration: '8 h — de 10 h à 19 h',
        amount: '890 €',
        desc: 'La journée complète : criques au programme libre, déjeuner au mouillage, baignade à volonté et retour dans la lumière du soir.',
        highlight: 'La plus choisie',
      },
    ],
    gallery: [
      { src: '/images/sortie-bateau.jpg', alt: 'Le yacht au mouillage, eau turquoise' },
      { src: '/images/sortie-carre.jpg', alt: 'Le yacht vu depuis l’eau' },
      { src: '/images/hero-bateau.jpg', alt: 'Le yacht au soleil couchant' },
    ],
  },
  {
    slug: 'nuits-a-quai',
    value: 'Nuit insolite à quai',
    tag: '02 — La nuit',
    titlePlain: 'Nuits insolites',
    titleIt: 'à quai',
    tagline: 'Votre suite sur l’eau',
    hero: '/images/nuit-bateau.jpg',
    heroAlt: 'Le yacht Harmonie au soir tombant, reflets dorés sur l’eau',
    intro:
      'À la tombée du jour, le yacht devient votre suite. Amarré au calme dans son port, il vous offre ce qu’aucune chambre d’hôtel ne peut offrir : le clapot de l’eau contre la coque, le port qui s’endort autour de vous, et un réveil face à la mer. Vous arrivez, tout est prêt — champagne au frais, cabine préparée, lumière douce.',
    includes: [
      { label: 'Le yacht pour vous seuls', detail: 'De 18 h à 10 h' },
      { label: 'Champagne de bienvenue', detail: 'Servi à l’embarquement' },
      { label: 'Cabine préparée', detail: 'Linge de maison hôtelier' },
      { label: 'Petit-déjeuner servi à bord', detail: 'Au réveil, sur le pont' },
      { label: 'Dîner livré à bord', detail: 'Sur demande' },
      { label: 'Idéal à deux', detail: 'Anniversaires, demandes, escapades' },
    ],
    steps: NIGHT_STEPS,
    price: {
      amount: '490 €',
      unit: 'la nuit',
      note: 'À partir de — petit-déjeuner inclus.',
    },
    gallery: [
      { src: '/images/nuit-bateau.jpg', alt: 'Le yacht au soir tombant' },
      { src: '/images/reflets.jpg', alt: 'Reflets dorés sur l’eau' },
      { src: '/images/calme-bateau.jpg', alt: 'Le yacht sur une mer calme' },
    ],
  },
]

/* Avis clients — exemples à remplacer par de vrais avis. */
export type Review = { initials: string; name: string; context: string; text: string }

export const REVIEWS: Review[] = [
  {
    initials: 'L&T',
    name: 'Léa & Thomas',
    context: 'Nuit insolite à quai',
    text: 'On a dormi bercés par l’eau, réveillés par le soleil sur le port. Le champagne à l’arrivée, le petit-déjeuner sur le pont… on s’est crus très loin, à dix minutes de chez nous.',
  },
  {
    initials: 'C',
    name: 'Camille',
    context: 'EVJF — sortie en mer',
    text: 'Journée parfaite pour l’enterrement de vie de jeune fille de ma sœur. Le skipper a trouvé une crique incroyable, tout était fluide du début à la fin.',
  },
  {
    initials: 'M&S',
    name: 'Marc & Sophie',
    context: 'Anniversaire de mariage',
    text: 'Vingt ans de mariage fêtés au mouillage, coupe à la main face au coucher de soleil. Un service discret et attentionné, digne d’un grand hôtel.',
  },
  {
    initials: 'J',
    name: 'Julien',
    context: 'Demande en fiançailles',
    text: 'J’ai fait ma demande à la golden hour, exactement comme on l’avait préparée ensemble. Elle a dit oui. Merci pour la complicité et la discrétion.',
  },
]
