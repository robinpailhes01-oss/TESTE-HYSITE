import ContentPage from '../components/ContentPage'
import JsonLd from '../components/JsonLd'
import { pageMeta, breadcrumbSchema, faqSchema } from '../seo'

const PATH = '/evjf-evg-bateau-montpellier'

export function meta() {
  return pageMeta({
    title: 'EVJF & EVG en bateau près de Montpellier — dès 320 € | Harmonie Yacht',
    description:
      'Organisez un EVJF ou un EVG sur un yacht privatisé à Carnon, à 15 min de Montpellier. Jusqu’à 10 invités, baignade et coucher de soleil, dès 320 €.',
    path: PATH,
  })
}

const FAQ = [
  {
    question: 'Combien de personnes peuvent monter à bord pour un EVJF ou un EVG ?',
    answer: 'Jusqu’à 10 invités, dans la limite de la capacité légale du yacht (Atlantis 42, 12 mètres).',
  },
  {
    question: 'Peut-on apporter sa propre musique et sa décoration ?',
    answer: 'Oui, une enceinte Bluetooth est fournie à bord pour connecter votre propre playlist. La nourriture et les boissons ne sont pas incluses : vous apportez ce que vous voulez.',
  },
  {
    question: 'Quelle durée choisir pour un EVJF ou un EVG en bateau ?',
    answer: 'La formule de 3 heures (550 € avec capitaine, BBQ à bord inclus) est la plus choisie pour ce type de sortie : le temps d’une vraie baignade, d’un mouillage dans une crique et d’un apéritif face au coucher de soleil.',
  },
]

export default function EvjfRoute() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Accueil', path: '/' }, { name: 'EVJF & EVG en bateau', path: PATH }])} />
      <JsonLd data={faqSchema(FAQ)} />
      <ContentPage
        kicker="EVJF & EVG"
        h1={
          <>
            EVJF & EVG <span className="it">en bateau</span>
          </>
        }
        tagline="Un yacht privatisé rien que pour vous, à 15 minutes de Montpellier"
        heroImg="/images/sortie-carre.jpg"
        heroAlt="Groupe d'amis sur le pont du yacht Harmonie, au large de Carnon"
        ctaHref="/sortie-en-mer-carnon#reservation"
        ctaLabel="Réserver la sortie"
      >
        <h2>Un enterrement de vie de jeune fille ou de garçon sur l’eau, à Carnon</h2>
        <p>
          Le yacht Harmonie se privatise pour la journée ou l’après-midi, jusqu’à 10 invités,
          au départ du port de Carnon — à 15 minutes de Montpellier. Pas de partage avec
          d’autres groupes, pas de programme imposé&nbsp;: cap sur une crique, baignade,
          paddle, et l’apéritif face au coucher de soleil.
        </p>

        <h2>Ce qui est inclus</h2>
        <ul>
          <li>Le yacht privatisé, avec skipper professionnel</li>
          <li>Carburant, eau à bord, paddle, plateforme de bain</li>
          <li>Enceinte Bluetooth pour votre musique</li>
          <li>BBQ à bord sur les formules 3 h et 4 h</li>
        </ul>
        <p>Non inclus : nourriture et boissons — vous apportez ce que vous voulez pour l’occasion.</p>

        <h2>Tarifs</h2>
        <ul>
          <li>2 heures — 380 € avec capitaine, 320 € sans capitaine (permis requis)</li>
          <li>3 heures — 550 € avec capitaine, 470 € sans capitaine — BBQ inclus</li>
          <li>4 heures — 750 € avec capitaine, 640 € sans capitaine — BBQ inclus</li>
        </ul>

        <h2>Questions fréquentes</h2>
        {FAQ.map((f) => (
          <div key={f.question}>
            <h3>{f.question}</h3>
            <p>{f.answer}</p>
          </div>
        ))}
      </ContentPage>
    </>
  )
}
