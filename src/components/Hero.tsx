import { motion, useReducedMotion } from 'motion/react'
import { ease, staggerContainer, staggerItem } from '../motion'

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

export default function Hero() {
  const reduced = useReducedMotion()

  return (
    <section className="hero">
      <div className="hero__media">
        <motion.img
          src="/images/hero-bateau.jpg"
          alt="Le yacht Harmonie à l’ancre au soleil couchant, reflets dorés sur une mer calme"
          initial={reduced ? undefined : { scale: 1.07, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, ease }}
        />
      </div>

      {/* Arc de parcours — signature */}
      <motion.svg
        className="hero__arc"
        viewBox="0 0 1000 140"
        fill="none"
        aria-hidden="true"
        initial={reduced ? undefined : { opacity: 0 }}
        animate={{ opacity: 0.75 }}
        transition={{ duration: 1.4, ease, delay: 1.1 }}
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
        <motion.h1
          className="mixed hero__title"
          variants={staggerContainer}
          initial={reduced ? false : 'hidden'}
          animate="show"
        >
          <motion.span className="line" variants={staggerItem}>
            Votre yacht <span className="it">privé.</span>
          </motion.span>
          <motion.span className="line" variants={staggerItem}>
            La mer <span className="it">le jour,</span>
          </motion.span>
          <motion.span className="line" variants={staggerItem}>
            une <span className="it">suite sur l’eau</span>
          </motion.span>
          <motion.span className="line" variants={staggerItem}>
            la nuit.
          </motion.span>
        </motion.h1>

        <motion.div
          className="hero__metas"
          initial={reduced ? undefined : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease, delay: 0.9 }}
        >
          <p className="hero__meta hero__meta--left">
            <PinIcon />
            Port d’attache — Méditerranée
          </p>
          <p className="hero__meta hero__meta--right">
            <CalendarIcon />
            Toute l’année, sur réservation
          </p>
        </motion.div>

        <motion.div
          className="hero__cta"
          initial={reduced ? undefined : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.75 }}
        >
          <a href="#reservation" className="btn btn--light">
            Demander une date
          </a>
          <span className="hero__cta-note">Réponse sous 24 h</span>
        </motion.div>
      </div>
    </section>
  )
}
