import { Link } from 'react-router'
import JsonLd from '../components/JsonLd'
import { PRICES } from '../pricing'
import { SITE_URL, pageMeta, breadcrumbSchema, offerSchema } from '../seo'

const PATH = '/tarifs'

export function meta() {
  return pageMeta({
    title: 'Tarifs — location de yacht à Carnon | Harmonie Yacht',
    description:
      'Tous les tarifs Harmonie Yacht en un coup d’œil : sorties en mer de 320 € à 1 250 €, nuits à bord de 250 € à 380 €. Acompte de 30 %, solde à bord.',
    path: PATH,
  })
}

export default function TarifsRoute() {
  const sorties = PRICES.filter((p) => p.group === 'sortie')
  const nuits = PRICES.filter((p) => p.group === 'nuit')

  return (
    <main className="page">
      <section className="legal-hero on-ocean-deep on-ocean">
        <div className="container">
          <Link to="/" className="page-hero__back">
            ← Retour à l’accueil
          </Link>
          <p className="kicker" style={{ marginTop: 18 }}>Tarifs</p>
          <h1 className="mixed legal-hero__title">Tous nos tarifs, sans surprise</h1>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--ground)' }}>
        <div className="container legal-body" style={{ maxWidth: 720 }}>
          <p className="legal-intro">
            Un acompte de 30&nbsp;% est réglé en ligne à la réservation, le solde à bord (carte
            ou espèces). Sans capitaine, il faut un permis bateau depuis au moins 5 ans et 50
            heures de navigation justifiables sur un bateau de ce type.
          </p>

          <h2>Sorties en mer</h2>
          <ul>
            {sorties.map((p) => (
              <li key={p.id}>
                <strong>{p.label}</strong> — {p.amount}&nbsp;€. {p.detail.replace(/\.$/, '')}.
              </li>
            ))}
          </ul>
          <p>
            Inclus : skipper professionnel, carburant, eau à bord, paddle, plateforme de bain.
            Non inclus : nourriture et boissons.
          </p>

          <h2>Nuits à bord</h2>
          <ul>
            {nuits.map((p) => (
              <li key={p.id}>
                <strong>{p.label}</strong> — {p.amount}&nbsp;€. {p.detail.replace(/\.$/, '')}.
              </li>
            ))}
          </ul>

          <h2>Réserver</h2>
          <p>
            Choisissez votre date directement sur la page{' '}
            <Link to="/sortie-en-mer-carnon">Sortie en mer</Link> ou{' '}
            <Link to="/nuit-a-bord-yacht-carnon">Nuit à bord</Link>, ou écrivez-nous sur
            WhatsApp pour une réponse en moins de 5 minutes.
          </p>
        </div>
      </section>

      <JsonLd data={breadcrumbSchema([{ name: 'Accueil', path: '/' }, { name: 'Tarifs', path: PATH }])} />
      {[...sorties, ...nuits].map((p) => (
        <JsonLd
          key={p.id}
          data={offerSchema({
            name: p.label,
            description: p.detail,
            price: p.amount,
            url: `${SITE_URL}${p.group === 'sortie' ? '/sortie-en-mer-carnon' : '/nuit-a-bord-yacht-carnon'}`,
          })}
        />
      ))}
    </main>
  )
}
