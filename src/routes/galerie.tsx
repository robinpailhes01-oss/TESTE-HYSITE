import { Link } from 'react-router'
import JsonLd from '../components/JsonLd'
import { pageMeta, breadcrumbSchema } from '../seo'

const PATH = '/galerie'

const SHOTS = [
  { src: '/images/sortie-plateau-fruits-de-mer.jpg', alt: 'Plateau de fruits de mer et bouquet de roses à bord, en famille', cls: 'gal__a' },
  { src: '/images/sortie-efoil-jour.jpg', alt: 'Efoil en pleine journée, à la demande', cls: 'gal__b' },
  { src: '/images/nuit-petit-dejeuner-pont.jpg', alt: 'Petit-déjeuner sur le pont au réveil, face au port de Carnon', cls: 'gal__c' },
  { src: '/images/nuit-yacht-de-nuit.jpg', alt: 'Le yacht Harmonie amarré au ponton, de nuit', cls: 'gal__d' },
  { src: '/images/sortie-paddle.jpg', alt: 'Paddle depuis la plateforme de bain', cls: 'gal__e' },
  { src: '/images/sortie-coucher-soleil-poupe.jpg', alt: 'Coucher de soleil depuis le pont, face à Carnon', cls: 'gal__f' },
]

export function meta() {
  return pageMeta({
    title: 'Galerie photos du yacht Harmonie à Carnon | Harmonie Yacht',
    description:
      'Photos du yacht Harmonie (Atlantis 42, 12 mètres) et de ses sorties en mer au large de Carnon, dans l’Hérault.',
    path: PATH,
  })
}

export default function GalerieRoute() {
  return (
    <main className="page">
      <section className="legal-hero on-ocean-deep on-ocean">
        <div className="container">
          <Link to="/" className="page-hero__back">
            ← Retour à l’accueil
          </Link>
          <p className="kicker" style={{ marginTop: 18 }}>Galerie</p>
          <h1 className="mixed legal-hero__title">Le yacht Harmonie, en images</h1>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--white)' }}>
        <div className="container">
          <p className="legal-intro" style={{ maxWidth: 720, marginBottom: 32 }}>
            L’Atlantis 42 « Harmonie », 12 mètres, amarré au port de Carnon — au mouillage dans
            une crique, au coucher de soleil, ou à quai pour la nuit.
          </p>
          <div className="gal">
            {SHOTS.map((s) => (
              <span className={`gal__item ${s.cls}`} key={s.src}>
                <img src={s.src} alt={s.alt} loading="lazy" />
              </span>
            ))}
          </div>
        </div>
      </section>

      <JsonLd data={breadcrumbSchema([{ name: 'Accueil', path: '/' }, { name: 'Galerie', path: PATH }])} />
    </main>
  )
}
