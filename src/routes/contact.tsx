import { Link } from 'react-router'
import JsonLd from '../components/JsonLd'
import { WHATSAPP_URL } from '../whatsapp'
import {
  BUSINESS_EMAIL,
  BUSINESS_PHONE,
  BUSINESS_PHONE_DISPLAY,
  INSTAGRAM_URL,
  pageMeta,
  breadcrumbSchema,
} from '../seo'

const PATH = '/contact'

export function meta() {
  return pageMeta({
    title: 'Contact — Harmonie Yacht à Carnon',
    description: `Contactez Harmonie Yacht : WhatsApp (réponse en moins de 5 min), téléphone au ${BUSINESS_PHONE_DISPLAY}, ou email. Port de Carnon, Hérault.`,
    path: PATH,
  })
}

export default function ContactRoute() {
  return (
    <main className="page">
      <section className="legal-hero on-ocean-deep on-ocean">
        <div className="container">
          <Link to="/" className="page-hero__back">
            ← Retour à l’accueil
          </Link>
          <p className="kicker" style={{ marginTop: 18 }}>Contact</p>
          <h1 className="mixed legal-hero__title">Parlons de votre sortie</h1>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--ground)' }}>
        <div className="container legal-body" style={{ maxWidth: 720 }}>
          <h2>WhatsApp — la voie la plus rapide</h2>
          <p>
            Écrivez-nous sur <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">WhatsApp</a>{' '}
            pour une réponse en moins de 5 minutes, tous les jours.
          </p>

          <h2>Téléphone</h2>
          <p>
            <a href={`tel:${BUSINESS_PHONE}`}>{BUSINESS_PHONE_DISPLAY}</a>
          </p>

          <h2>Email</h2>
          <p>
            <a href={`mailto:${BUSINESS_EMAIL}`}>{BUSINESS_EMAIL}</a>
          </p>

          <h2>Instagram</h2>
          <p>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
              instagram.com/harmonieyacht
            </a>
          </p>

          <h2>Où nous trouver</h2>
          <p>
            Port de Carnon, 239 rue de l’Étang de l’Or, Carnon-Plage, 34130 Mauguio — à côté de
            l’Hôtel Neptune, à 15 minutes de Montpellier. Il n’y a pas de parking dédié :
            prévoyez une place dans Carnon.
          </p>
        </div>
      </section>

      <JsonLd data={breadcrumbSchema([{ name: 'Accueil', path: '/' }, { name: 'Contact', path: PATH }])} />
    </main>
  )
}
