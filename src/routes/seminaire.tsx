import ContentPage from '../components/ContentPage'
import JsonLd from '../components/JsonLd'
import { pageMeta, breadcrumbSchema, faqSchema } from '../seo'

const PATH = '/seminaire-entreprise-bateau-herault'

export function meta() {
  return pageMeta({
    title: 'Séminaire d’entreprise en bateau dans l’Hérault | Harmonie Yacht',
    description:
      'Privatisez un yacht à Carnon pour un séminaire ou une sortie d’entreprise : jusqu’à 10 collaborateurs, de 2 h à 8 h, à 15 min de Montpellier.',
    path: PATH,
  })
}

const FAQ = [
  {
    question: 'Le yacht peut-il accueillir une équipe pour un séminaire ?',
    answer: 'Oui, jusqu’à 10 personnes, dans la limite de la capacité légale du yacht (Atlantis 42, 12 mètres).',
  },
  {
    question: 'Peut-on obtenir une facture pour une sortie d’entreprise ?',
    answer: 'Oui, contactez l’équipe par email ou WhatsApp pour toute demande de facturation professionnelle.',
  },
  {
    question: 'Quelle formule pour une journée complète entre collègues ?',
    answer: 'La formule Ultra Premium de 8 heures (1 250 €, tout compris) : capitaine, efoil et BBQ à bord, cap sur Les Aresquiers, pour une journée qui sort du cadre habituel.',
  },
]

export default function SeminaireRoute() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Accueil', path: '/' }, { name: 'Séminaire d’entreprise', path: PATH }])} />
      <JsonLd data={faqSchema(FAQ)} />
      <ContentPage
        kicker="Séminaire & sortie d’entreprise"
        h1={
          <>
            Un séminaire <span className="it">qui change du bureau</span>
          </>
        }
        tagline="Le yacht Harmonie privatisé pour votre équipe, à Carnon"
        heroImg="/images/hero-coucher-soleil-proue.jpg"
        heroAlt="Vue depuis la proue du yacht Harmonie, face à Carnon"
        ctaHref="/sortie-en-mer-carnon#reservation"
        ctaLabel="Réserver pour l’équipe"
      >
        <h2>Sortir l’équipe du bureau, sans sortir du budget</h2>
        <p>
          Le yacht Harmonie se privatise pour une sortie d’entreprise ou un séminaire, jusqu’à
          10 collaborateurs, au départ du port de Carnon — à 15 minutes de Montpellier. Une
          formule courte pour un moment de cohésion, ou la journée complète pour un vrai temps
          fort d’équipe.
        </p>

        <h2>Les formules adaptées à un groupe</h2>
        <ul>
          <li>4 heures — 750 € avec capitaine, BBQ à bord inclus</li>
          <li>
            Sortie Ultra Premium 8 h — 1 250 €, tout compris (capitaine, efoil, BBQ), direction
            Les Aresquiers
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
