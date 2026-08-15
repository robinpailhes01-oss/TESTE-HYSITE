import ExperiencePage from '../pages/ExperiencePage'
import JsonLd from '../components/JsonLd'
import { PRICES } from '../pricing'
import { SITE_URL, pageMeta, offerSchema, breadcrumbSchema } from '../seo'

const PATH = '/nuit-a-bord-yacht-carnon'

export function meta() {
  return pageMeta({
    title: 'Nuit à bord d’un yacht à Carnon — dès 250 € | Harmonie Yacht',
    description:
      'Une nuit privée à bord, amarré au port de Carnon, de 18 h à 12 h le lendemain. Dès 250 € pour 2 personnes, ou 380 € avec sortie en mer au coucher de soleil.',
    path: PATH,
  })
}

export default function NuitRoute() {
  const nuits = PRICES.filter((p) => p.group === 'nuit')
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Accueil', path: '/' }, { name: 'Nuit à bord', path: PATH }])} />
      {nuits.map((p) => (
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
      <ExperiencePage slug="nuit-a-bord-yacht-carnon" />
    </>
  )
}
