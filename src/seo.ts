/* ---------------------------------------------------------------------------
   Faits de l'entreprise — source de vérité pour le JSON-LD (Schema.org) et
   pour tout texte qui doit rester identique partout (site, avis, IA). Les
   tarifs restent dans src/pricing.ts et src/experiences.ts : ce fichier ne
   les duplique jamais, il les importe.
--------------------------------------------------------------------------- */

export const SITE_URL = 'https://harmonie-yacht.fr'
export const BUSINESS_NAME = 'Harmonie Yacht'
export const BUSINESS_PHONE = '+33753481263'
export const BUSINESS_PHONE_DISPLAY = '07 53 48 12 63'
export const BUSINESS_EMAIL = 'harmonieyacht@gmail.com'
export const INSTAGRAM_URL = 'https://instagram.com/harmonieyacht'

/* React Router ne fusionne pas automatiquement le meta() d'une route avec
   celui de son parent (root.tsx) : le renvoyer depuis une route l'efface.
   Chaque page appelle donc pageMeta() pour repartir d'un jeu complet de
   balises (title/description/canonical/OG/theme-color) plutôt que de
   perdre og:image, theme-color, etc. à chaque page. */
export function pageMeta(opts: { title: string; description: string; path: string }) {
  const url = `${SITE_URL}${opts.path}`
  return [
    { title: opts.title },
    { name: 'description', content: opts.description },
    { property: 'og:site_name', content: BUSINESS_NAME },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: opts.title },
    { property: 'og:description', content: opts.description },
    { property: 'og:url', content: url },
    { property: 'og:image', content: `${SITE_URL}/images/og-yacht.jpg` },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { name: 'theme-color', content: '#1A4C74' },
    { tagName: 'link', rel: 'canonical', href: url },
  ] as const
}

export const ADDRESS = {
  streetAddress: "239 rue de l'Étang de l'Or",
  addressLocality: 'Carnon-Plage',
  postalCode: '34130',
  addressRegion: 'Occitanie',
  addressCountry: 'FR',
}

export const GEO = { latitude: 43.5511, longitude: 3.9806 }

export const YACHT = {
  name: 'Harmonie',
  model: 'Atlantis 42',
  lengthMeters: 12,
  legalCapacity: 10,
  comfortCapacity: 7,
  equipment: [
    'Enceinte Bluetooth',
    'Paddle',
    'Plateforme de bain',
    'Réfrigérateur',
    'Lit double à l’avant',
    'Bains de soleil avant et arrière',
    'Table extérieure',
  ],
}

/* JSON-LD LocalBusiness — sur toutes les pages, sert d'identité stable pour
   Google et les moteurs de réponse IA. */
export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: BUSINESS_NAME,
    description:
      "Location privée d'un yacht avec skipper à Carnon (Hérault) : sorties en mer à la demi-journée et nuits à bord.",
    url: SITE_URL,
    telephone: BUSINESS_PHONE,
    email: BUSINESS_EMAIL,
    image: `${SITE_URL}/images/og-yacht.jpg`,
    sameAs: [INSTAGRAM_URL],
    address: { '@type': 'PostalAddress', ...ADDRESS },
    geo: { '@type': 'GeoCoordinates', ...GEO },
    areaServed: ['Carnon', 'La Grande-Motte', 'Montpellier', 'Palavas-les-Flots', 'Hérault'],
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
      ],
      opens: '08:00',
      closes: '22:00',
    },
  }
}

export type OfferFact = {
  name: string
  description: string
  price: number
  priceCurrency?: 'EUR'
  availability?: 'https://schema.org/InStock'
  url: string
}

export function offerSchema(o: OfferFact) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: o.name,
    description: o.description,
    brand: { '@type': 'Brand', name: BUSINESS_NAME },
    offers: {
      '@type': 'Offer',
      price: o.price,
      priceCurrency: o.priceCurrency ?? 'EUR',
      availability: o.availability ?? 'https://schema.org/InStock',
      url: o.url,
    },
  }
}

export type FaqFact = { question: string; answer: string }

export function faqSchema(items: FaqFact[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.question,
      acceptedAnswer: { '@type': 'Answer', text: it.answer },
    })),
  }
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  }
}

export type ReviewFact = { author: string; text: string; date: string }

/* Les 3 avis confirmés pour le JSON-LD (cf. cahier des charges §4) — texte
   inchangé, jamais inventé. D'autres avis existent en texte sur le site
   (src/reviews.ts) mais celles-ci sont les seules dont la date exacte est
   confirmée, condition pour les déclarer en Schema.org Review. */
export const CONFIRMED_REVIEWS: ReviewFact[] = [
  { author: 'Adrien', text: 'Merci à Robin pour cette aprèm au top en mer. Et les cocktails incroyable', date: '2026-05' },
  { author: 'Alicia', text: 'Une très belle expérience passée sur le bateau ! La nuit était magnifique, l’ambiance calme et relaxante', date: '2026-05' },
  { author: 'Anthony', text: 'Une équipe soignée et à la hauteur de ses prestations. Moments inoubliables', date: '2026-05' },
]

export function aggregateRatingSchema() {
  return {
    '@type': 'AggregateRating',
    ratingValue: '5',
    reviewCount: String(CONFIRMED_REVIEWS.length),
  }
}

export function reviewSchemas() {
  return CONFIRMED_REVIEWS.map((r) => ({
    '@type': 'Review',
    author: { '@type': 'Person', name: r.author },
    reviewBody: r.text,
    datePublished: r.date,
    reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
  }))
}
