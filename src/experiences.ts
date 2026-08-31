/* Données partagées des deux prestations — utilisées par la home, le parcours
   et les pages détail. Contenus à ajuster avec les vraies infos. */

export type Step = { time: string; label: string; it?: string; note: string }

/* Nuit Prestige (avec sortie en mer) — la Nuit à quai (sans sortie) saute
   directement de l'embarquement à la nuit à bord. */
export const NIGHT_STEPS: Step[] = [
  { time: '18 h 00', label: 'Embarquement', note: 'Accueil au ponton, le yacht et la cabine sont prêts.' },
  { time: 'Coucher de soleil', label: 'Sortie en mer', it: '& tapas', note: 'Une heure au large, plateau tapas de notre partenaire Una Mas.' },
  { time: '23 h 00', label: 'Nuit à bord', note: 'Bercés par le clapot, amarrés au calme du port.' },
  { time: '10 h 00', label: 'Petit-déjeuner', it: 'sur plateau', note: 'Petit-déjeuner sur plateau (Hôtel Neptune), servi jusqu’à 10 h. Checkout à midi.' },
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
  desc?: string
  highlight?: string
  boldNote?: string
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
      'Le yacht est à vous, le programme aussi. Votre yacht privatif, avec sa plateforme géante sur l’eau et le paddle à disposition : profitez-en pour manger, vous amuser, nager, et vivre la sortie à votre rythme, jusqu’à l’apéritif face au soleil qui descend. Vous n’avez rien à organiser, tout est préparé avant votre arrivée.',
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
      },
      {
        key: '3h',
        num: '02',
        name: 'Trois',
        it: 'heures',
        duration: '3 h — crique & baignade',
        amount: '550 €',
        amountSolo: '470 €',
        highlight: 'La plus choisie',
        boldNote: 'Barbecue à disposition',
      },
      {
        key: '4h',
        num: '03',
        name: 'Quatre',
        it: 'heures',
        duration: '4 h — la demi-journée',
        amount: '750 €',
        amountSolo: '640 €',
        boldNote: 'Barbecue à disposition',
      },
      {
        key: '8h',
        num: '04',
        name: 'Ultra',
        it: 'Premium',
        duration: '8 h — la journée complète',
        amount: '1 250 €',
        amountFlat: true,
        highlight: 'Ultra Premium',
        boldNote: 'Efoil & barbecue à bord',
      },
    ],
    gallery: [
      { src: '/images/sortie-coucher-soleil-poupe.jpg', alt: 'Vue depuis le pont au coucher de soleil, face à Carnon' },
      { src: '/images/sortie-efoil-jour.jpg', alt: 'Efoil en pleine journée, à la demande' },
      { src: '/images/sortie-paddle.jpg', alt: 'Paddle depuis la plateforme de bain' },
      { src: '/images/sortie-plateau-fruits-de-mer.jpg', alt: 'Plateau de fruits de mer et bouquet de roses à bord, en famille' },
      { src: '/images/sortie-efoil-coucher-soleil.jpg', alt: 'Efoil au coucher de soleil, face à Carnon' },
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
    hero: '/images/nuit-yacht-de-nuit.jpg',
    heroAlt: 'Le yacht Harmonie amarré au ponton, de nuit',
    intro:
      'À la tombée du jour, le yacht devient votre suite. Amarré au calme dans le port de Carnon, il vous offre ce qu’aucune chambre d’hôtel ne peut offrir : le clapot de l’eau contre la coque, le port qui s’endort autour de vous, et un réveil face à la mer. Deux façons d’en profiter, à partir de 18 h : la Nuit à quai, cocooning avec le petit-déjeuner au réveil, ou la Nuit Prestige, avec une sortie en mer au coucher de soleil et son plateau de tapas. Formule intimiste, réservée à deux personnes.',
    includes: [
      { label: 'Le yacht pour vous seuls', detail: '18 h → 12 h le lendemain' },
      { label: 'Jusqu’à 2 personnes', detail: 'Formule intimiste' },
      { label: 'Nuit Prestige : sortie en mer au coucher de soleil', detail: 'Avec tapas de notre partenaire Una Mas' },
      { label: 'Nuit à quai : amarré au calme', detail: 'Sans sortie en mer — disponible à partir du 1er septembre' },
      { label: 'Petit-déjeuner inclus', detail: 'Sur plateau, servi jusqu’à 10 h (Hôtel Neptune)' },
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
        desc: 'Le cocooning à deux : le yacht amarré au calme dans le port, sans sortie en mer, petit-déjeuner sur plateau inclus le lendemain matin, jusqu’à 10 h (Hôtel Neptune).',
      },
      {
        key: 'prestige',
        num: '02',
        name: 'Nuit',
        it: 'Prestige',
        duration: '18 h — jusqu’à 12 h le lendemain',
        amount: '380 €',
        desc: 'La formule signature : sortie en mer au coucher de soleil, plateau tapas (Una Mas), nuit à bord, petit-déjeuner sur plateau inclus le lendemain matin, jusqu’à 10 h (Hôtel Neptune).',
        highlight: 'La plus demandée',
      },
    ],
    gallery: [
      { src: '/images/nuit-salon-amour.jpg', alt: 'Le salon du yacht Harmonie, table dressée et décor « Amour »' },
      { src: '/images/nuit-table-ambiance.jpg', alt: 'Ambiance cocooning à bord, bougies et diffuseur sur la table du salon' },
      { src: '/images/nuit-petit-dejeuner-plateau.jpg', alt: 'Petit-déjeuner sur plateau : viennoiseries, jus de fruits et confitures' },
      { src: '/images/nuit-petit-dejeuner-pont.jpg', alt: 'Petit-déjeuner servi sur le pont au réveil, face au port de Carnon' },
    ],
  },
]

/* Avis clients : voir src/reviews.ts (vrais avis Google). */
