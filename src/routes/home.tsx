import Home from '../pages/Home'
import JsonLd from '../components/JsonLd'
import { pageMeta, localBusinessSchema } from '../seo'

export function meta() {
  return pageMeta({
    title: "Harmonie Yacht — Location de yacht avec skipper à Carnon",
    description:
      "Sorties en mer dès 320 € et nuits à bord dès 250 € sur un yacht privatisé à Carnon (Hérault), à 15 min de Montpellier. Réservation sur demande, règlement à bord.",
    path: '/',
  })
}

export default function HomeRoute() {
  return (
    <>
      <JsonLd data={localBusinessSchema()} />
      <Home />
    </>
  )
}
