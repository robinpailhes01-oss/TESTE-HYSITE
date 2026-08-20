import ContentPage from '../components/ContentPage'
import JsonLd from '../components/JsonLd'
import { pageMeta, breadcrumbSchema, faqSchema } from '../seo'

const PATH = '/demande-en-mariage-anniversaire-bateau'

export function meta() {
  return pageMeta({
    title: 'Demande en mariage & anniversaire en bateau à Carnon | Harmonie Yacht',
    description:
      'Privatisez le yacht Harmonie pour une demande en mariage ou un anniversaire au coucher de soleil à Carnon. Sortie dès 320 €, nuit à bord dès 250 €.',
    path: PATH,
  })
}

const FAQ = [
  {
    question: 'Peut-on organiser une demande en mariage en toute discrétion sur le yacht ?',
    answer: 'Oui — le yacht est privatisé, il n’y a personne d’autre à bord que vous, vos invités éventuels et le skipper, qui reste discret le temps venu.',
  },
  {
    question: 'Quelle formule choisir pour un moment à deux ?',
    answer: 'La sortie de 2 heures au coucher de soleil (380 € avec capitaine) pour un moment court et intense, ou la Nuit Prestige (380 €, 2 personnes) pour prolonger la soirée à bord, amarré au port de Carnon, avec petit-déjeuner le lendemain.',
  },
  {
    question: 'Peut-on apporter du champagne ou un traiteur ?',
    answer: 'Oui, vous êtes libres d’apporter ce que vous voulez à bord — champagne, fleurs, traiteur. Prévenez l’équipe à l’avance pour que tout soit prêt à votre arrivée.',
  },
]

export default function DemandeMariageRoute() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Accueil', path: '/' }, { name: 'Demande en mariage & anniversaire', path: PATH }])} />
      <JsonLd data={faqSchema(FAQ)} />
      <ContentPage
        kicker="Demande en mariage & anniversaire"
        h1={
          <>
            Une demande en mariage <span className="it">au coucher de soleil</span>
          </>
        }
        tagline="Le yacht Harmonie, rien que pour vous deux, à Carnon"
        heroImg="/images/nuit-yacht-de-nuit.jpg"
        heroAlt="Le yacht Harmonie amarré au ponton, de nuit, ambiance intime"
        ctaHref="/nuit-a-bord-yacht-carnon#reservation"
        ctaLabel="Réserver la nuit à bord"
      >
        <h2>Un cadre privé pour un moment qui compte</h2>
        <p>
          Demande en mariage, anniversaire de rencontre ou de mariage&nbsp;: le yacht Harmonie
          se privatise pour deux, au départ du port de Carnon. Vous choisissez entre une
          sortie en mer au coucher de soleil ou une nuit complète à bord, amarré au calme,
          petit-déjeuner inclus le lendemain.
        </p>

        <h2>Deux façons de le vivre</h2>
        <ul>
          <li>
            Sortie en mer de 2 heures au coucher de soleil — 380 € avec capitaine, 320 € sans
            capitaine (permis requis)
          </li>
          <li>
            Nuit Prestige à bord — 380 € pour 2 personnes, sortie en mer d’1 h au coucher de
            soleil incluse, plateau tapas (Una Mas) et petit-déjeuner sur plateau (Hôtel Neptune)
            le lendemain matin jusqu’à 10 h, de 18 h à 12 h
          </li>
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
