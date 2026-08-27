import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ease, wordContainer, wordUp } from '../motion'

function PinIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M12 21s-7-5.1-7-11a7 7 0 1 1 14 0c0 5.9-7 11-7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
    </svg>
  )
}

/* Titre découpé en mots pour la révélation masquée */
const WORDS: { text: string; it?: boolean }[] = [
  { text: 'Créateur' },
  { text: 'de' },
  { text: 'moments', it: true },
  { text: 'authentiques', it: true },
  { text: 'sur' },
  { text: 'l’eau' },
]

export default function Hero() {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLElement>(null)

  /* Parallaxe : la photo défile plus lentement que la page */
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const mediaY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '14%'])

  return (
    <section className="hero" ref={ref}>
      {/* data-breathe est posé sur le conteneur, pas sur l'image : celle-ci
          porte déjà une transformation en ligne (la parallaxe), qui gagnerait
          contre la mise à l'échelle CSS du souffle. */}
      <div className="hero__media" data-breathe>
        <motion.img
          src="/images/hero-bateau.jpg"
          alt="Le yacht Harmonie vu de loin au soleil couchant, reflets dorés sur une mer calme"
          style={{ y: mediaY }}
          initial={reduced ? undefined : { scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2.4, ease }}
        />
      </div>

      {/* Arc de parcours — s'ouvre depuis le centre */}
      <motion.svg
        className="hero__arc"
        viewBox="0 0 1000 140"
        fill="none"
        aria-hidden="true"
        initial={reduced ? undefined : { clipPath: 'inset(0 50% 0 50%)', opacity: 0 }}
        animate={{ clipPath: 'inset(0 0% 0 0%)', opacity: 0.55 }}
        transition={{ duration: 2, ease, delay: 1.3 }}
      >
        <path
          d="M 5 5 Q 500 230 995 5"
          stroke="#F5F8FA"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeDasharray="1 14"
        />
      </motion.svg>

      <div className="hero__inner">
        <div className="hero__head">
          <motion.p
            className="hero__kicker"
            initial={reduced ? undefined : { opacity: 0, letterSpacing: '0.12em' }}
            animate={{ opacity: 1, letterSpacing: '0.3em' }}
            transition={{ duration: 1.8, ease, delay: 0.15 }}
          >
            Harmonie Yacht
          </motion.p>

          <motion.h1
            className="mixed hero__title"
            variants={wordContainer}
            initial={reduced ? false : 'hidden'}
            animate="show"
          >
            {WORDS.map((w, i) => (
              <span key={i}>
                <span className="mask">
                  <motion.span className={`word${w.it ? ' it' : ''}`} variants={wordUp}>
                    {w.text}
                  </motion.span>
                </span>
                {i < WORDS.length - 1 ? ' ' : null}
              </span>
            ))}
          </motion.h1>
        </div>

        <div className="hero__metas">
          <motion.p
            className="hero__meta hero__meta--left"
            initial={reduced ? undefined : { opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.1, ease, delay: 1.15 }}
          >
            <PinIcon />
            Carnon
          </motion.p>
          <motion.p
            className="hero__meta hero__meta--right"
            initial={reduced ? undefined : { opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.1, ease, delay: 1.15 }}
          >
            <CalendarIcon />
            Toute l’année, sur réservation
          </motion.p>
        </div>

        <motion.div
          className="hero__cta"
          initial={reduced ? undefined : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 1.05 }}
        >
          <a href="#prestations" className="btn btn--light">
            Voir nos prestations
          </a>
        </motion.div>
      </div>
    </section>
  )
}
