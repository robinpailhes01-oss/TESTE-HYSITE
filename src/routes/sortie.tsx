import ExperiencePage from '../pages/ExperiencePage'
import JsonLd from '../components/JsonLd'
import { PRICES } from '../pricing'
import { SITE_URL, pageMeta, offerSchema, breadcrumbSchema } from '../seo'

const PATH = '/sortie-en-mer-carnon'

export function meta() {
  return pageMeta({
    title: 'Sortie en mer à Carnon — dès 320 € | Harmonie Yacht',
    description:
      'Sortie privée en yacht à Carnon, de 2 h à 8 h, avec ou sans skipper. Jusqu’à 10 invités, paddle et plateforme de bain inclus. Réservez votre créneau en ligne.',
    path: PATH,
  })
}

export default function SortieRoute() {
  const sorties = PRICES.filter((p) => p.group === 'sortie')
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Accueil', path: '/' }, { name: 'Sortie en mer', path: PATH }])} />
      {sorties.map((p) => (
        <JsonLd
          key={p.id}
          data={offerSchema({
            name: p.label,
            description: p.detail,
            price: p.amount,
            url: `${SITE_URL}${PATH}`,
          })}
        />
      ))}
      <ExperiencePage slug="sortie-en-mer-carnon" />
    </>
  )
}
