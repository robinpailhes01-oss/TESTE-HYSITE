import { pic } from '../pic'
import type { ReactNode } from 'react'
import { Link } from 'react-router'

type Props = {
  kicker: string
  h1: ReactNode
  tagline: string
  heroImg: string
  heroAlt: string
  ctaHref: string
  ctaLabel: string
  children: ReactNode
}

/* Gabarit partagé des pages d'intention (EVJF, demande en mariage,
   séminaire…) : héro avec CTA visible sans scroller, puis le contenu de
   la page (texte réel, jamais un simple lien vers une autre page). */
export default function ContentPage({ kicker, h1, tagline, heroImg, heroAlt, ctaHref, ctaLabel, children }: Props) {
  return (
    <main className="page">
      <section className="page-hero">
        <div className="page-hero__media">
          <img {...pic(heroImg)} alt={heroAlt} fetchPriority="high" />
        </div>
        <div className="container page-hero__content">
          <Link to="/" className="page-hero__back">
            ← Retour à l’accueil
          </Link>
          <p className="kicker" style={{ color: 'var(--white-muted)', marginTop: 18 }}>
            {kicker}
          </p>
          <h1 className="mixed page-hero__title">{h1}</h1>
          <p className="page-hero__tagline">{tagline}</p>
          <a href={ctaHref} className="btn btn--light" style={{ marginTop: 24 }}>
            {ctaLabel}
          </a>
        </div>
      </section>

      <section className="section">
        <div className="container legal-body" style={{ maxWidth: 720 }}>
          {children}
        </div>
      </section>
    </main>
  )
}
