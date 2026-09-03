import { useEffect } from 'react'
import { Link, Navigate } from 'react-router'
import { motion, useReducedMotion } from 'motion/react'
import { ease, useReveal } from '../motion'
import { EXPERIENCES } from '../experiences'
import type { Formule } from '../experiences'
import RevealImage from '../components/RevealImage'
import PhotoRail from '../components/PhotoRail'
import Visite from '../components/Visite'
import EnDirect from '../components/EnDirect'
import BookingForm from '../components/BookingForm'
import { WHATSAPP_URL } from '../whatsapp'

type Props = { slug: string }

function FormuleCard({ f, showDesc }: { f: Formule; showDesc: boolean }) {
  return (
    <article className="formule">
      <div className="formule__top">
        <span className="formule__num">{f.num}</span>
        {f.highlight ? <span className="formule__badge">{f.highlight}</span> : null}
      </div>
      <h3 className="mixed formule__name">
        {f.name}
        {f.name.endsWith('-') ? null : ' '}
        <span className="it">{f.it}</span>
      </h3>
      <p className="formule__duration">{f.duration}</p>
      {f.season ? <p className="formule__season">{f.season}</p> : null}
      <p className="formule__price">
        <span className="offer__unit">
          {f.amountFlat ? 'tout compris' : f.amountSolo ? 'avec capitaine' : f.amountFrom ? 'dès' : 'à partir de'}
        </span>
        <span className="formule__amount">{f.amount}</span>
      </p>
      {showDesc && f.desc ? <p className="formule__desc">{f.desc}</p> : null}
      {f.boldNote ? (
        <p className="formule__desc">
          <strong>{f.boldNote}</strong>
        </p>
      ) : null}
      <a
        href="#reservation"
        className="link-arrow"
        onClick={() => window.dispatchEvent(new CustomEvent('preselect-formule', { detail: f.key }))}
      >
        Réserver cette formule
      </a>
    </article>
  )
}

export default function ExperiencePage({ slug }: Props) {
  const reduced = useReducedMotion()
  const exp = EXPERIENCES.find((e) => e.slug === slug)

  const intro = useReveal()
  const includes = useReveal(0.1)
  const formulesHead = useReveal()
  const formulesGrid = useReveal(0.1)
  const stepsReveal = useReveal()
  const priceReveal = useReveal(0.1)
  const galleryReveal = useReveal()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!exp) return <Navigate to="/" replace />

  const other = EXPERIENCES.find((e) => e.slug !== slug)!

  return (
    <main className="page">
      {/* En-tête visuel */}
      <section className={`page-hero${exp.group === 'nuit' ? ' page-hero--full' : ''}`}>
        <div className="page-hero__media">
          <motion.img
            src={exp.hero}
            alt={exp.heroAlt}
            initial={reduced ? undefined : { scale: 1.06, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.8, ease }}
          />
        </div>
        <div className="container page-hero__content">
          <motion.div
            initial={reduced ? undefined : { opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.2 }}
          >
            <Link to="/" className="page-hero__back">
              ← Retour à l’accueil
            </Link>
            <p className="kicker" style={{ color: 'var(--white-muted)', marginTop: 18 }}>
              {exp.tag}
            </p>
            <h1 className="mixed page-hero__title">
              {exp.titlePlain} <span className="it">{exp.titleIt}</span>
            </h1>
            <p className="page-hero__tagline">{exp.tagline}</p>
          </motion.div>
        </div>
      </section>

      {/* La visite — on vient de voir le bateau du dehors en plein écran, on
          entre. Réservée à la nuit : c'est la page où la question du visiteur
          est « où est-ce que je dors, et à quoi ressemble la soirée ? », et
          une grille de vignettes n'y répond pas aussi bien qu'un lieu qu'on
          traverse. Elle remplace ici le rail de photos. */}
      {exp.group === 'nuit' ? <Visite /> : null}

      {/* Présentation + inclusions */}
      <section className="section">
        <div className="container page-grid">
          <motion.div className="page-grid__main" {...intro}>
            <p className="kicker">L’expérience</p>
            <p className="page-intro">{exp.intro}</p>
          </motion.div>
          <motion.div className="page-grid__side" {...includes}>
            <p className="kicker">Tout est compris</p>
            <ul className="includes">
              {exp.includes.map((inc) => (
                <li key={inc.label}>
                  <span>{inc.label}</span>
                  <span className="includes__detail">{inc.detail}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Tout ce qui est à bord, en images. La nuit n'en a plus besoin : sa
          visite plein écran montre déjà tout, et bien plus grand. */}
      {exp.group === 'nuit' ? null : (
      <PhotoRail
        kicker="Tout est à bord"
        titlePlain="Ce que vous"
        titleIt="avez avec vous"
        items={exp.inclusions}
        closing="Rien à prévoir, rien à porter."
        tone="ocean"
      />
      )}

      {/* Le monde réel : le couchant de ce soir, et les vraies dates libres.
          Placé juste après l'immersion, au moment exact où le visiteur
          convaincu se demande « oui, mais c'est libre quand ? ». */}
      <EnDirect group={exp.group} />

      {/* Formules */}
      {exp.formules ? (
        <section className="section" style={{ background: 'var(--ground)' }}>
          <div className="container">
            <motion.div className="section-head" {...formulesHead}>
              <p className="kicker">{exp.formulesKicker}</p>
              <h2 className="mixed">
                {exp.formulesTitlePlain} <span className="it">{exp.formulesTitleIt}</span>
              </h2>
            </motion.div>
            <motion.div className="formules" {...formulesGrid}>
              {exp.formules.map((f) => (
                <FormuleCard key={f.num} f={f} showDesc={exp.group === 'nuit'} />
              ))}
            </motion.div>
          </div>
        </section>
      ) : null}

      {/* Déroulé — uniquement quand un horaire fixe a du sens (nuits ; les
          sorties dépendent de la durée choisie, pas de créneau fixe). */}
      {exp.steps.length > 0 ? (
        <section className="section on-ocean">
          <div className="container">
            <motion.div className="section-head" {...stepsReveal}>
              <p className="kicker">Le déroulé</p>
              <h2 className="mixed">
                Heure <span className="it">par heure</span>
              </h2>
            </motion.div>
            <div className="route__track">
              <div className="route__line" aria-hidden="true" />
              <ol className="route__steps">
                {exp.steps.map((s) => (
                  <li className="route__step" key={s.time + s.label}>
                    <span className="route__time">{s.time}</span>
                    <p className="route__label">
                      {s.label}
                      {s.it ? (
                        <>
                          {' '}
                          <span className="it">{s.it}</span>
                        </>
                      ) : null}
                    </p>
                    <p className="route__note">{s.note}</p>
                  </li>
                ))}
              </ol>
            </div>
            {!exp.formules ? (
              <motion.div className="page-price" {...priceReveal}>
                <p className="page-price__amount">
                  <span className="offer__unit">à partir de</span>
                  <span className="page-price__value">{exp.price.amount}</span>
                  <span className="offer__unit">{exp.price.unit}</span>
                </p>
                <p className="page-price__note">{exp.price.note}</p>
              </motion.div>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* Galerie de la prestation */}
      <section className="section" style={{ background: 'var(--ground)' }}>
        <div className="container">
          <motion.div className="page-gallery" {...galleryReveal}>
            {exp.gallery.map((g) => (
              <RevealImage className="page-gallery__item" key={g.src} src={g.src} alt={g.alt} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Réservation dédiée */}
      <section className="section on-ocean-deep on-ocean" id="reservation">
        <div className="container booking">
          <div className="booking__intro">
            <p className="kicker">Réservation</p>
            <h2 className="mixed booking__title">
              Réserver votre <span className="it">{exp.value.toLowerCase()}</span>
            </h2>
            <p className="booking__text">
              Choisissez votre date, réglez l’acompte de 30&nbsp;% en ligne — c’est réservé.
              Nous revenons vers vous sous 24&nbsp;heures pour finaliser les détails.
            </p>
            <div className="booking__direct">
              <span className="kicker">Directement</span>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                WhatsApp — réponse en moins de 5 min
              </a>
              <a href="mailto:harmonieyacht@gmail.com">harmonieyacht@gmail.com</a>
            </div>
            <p className="booking__other">
              Vous hésitez encore&nbsp;?{' '}
              <Link to={`/${other.slug}`}>
                Découvrir {other.titlePlain.toLowerCase()} {other.titleIt} →
              </Link>
            </p>
          </div>
          <div className="booking__form">
            <BookingForm group={exp.group} />
          </div>
        </div>
      </section>
    </main>
  )
}
