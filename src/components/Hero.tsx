import { motion, useReducedMotion } from 'motion/react'
import { staggerContainer, staggerItem, tide } from '../motion'

export default function Hero() {
  const reduced = useReducedMotion()

  return (
    <section className="hero">
      <div className="hero__media">
        <motion.img
          src="/images/hero.jpg"
          alt="Yacht glissant sur une mer calme au soleil couchant, le long de la côte"
          initial={reduced ? undefined : { scale: 1.06, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2.2, ease: tide }}
        />
      </div>

      <motion.div
        className="container hero__content"
        variants={staggerContainer}
        initial={reduced ? false : 'hidden'}
        animate="show"
      >
        <motion.p className="kicker hero__kicker" variants={staggerItem}>
          Location privée avec skipper
        </motion.p>
        <motion.h1 className="display hero__title" variants={staggerItem}>
          La mer le jour, une <em>suite sur l’eau</em> la nuit.
        </motion.h1>
        <motion.div className="hero__actions" variants={staggerItem}>
          <a href="#reservation" className="btn btn--brass">
            Demander une date
          </a>
          <a href="#experiences" className="btn btn--ghost">
            Découvrir les expériences
          </a>
        </motion.div>
      </motion.div>

      <div className="container hero__horizon-row">
        <motion.div
          className="horizon"
          initial={reduced ? undefined : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.8, ease: tide, delay: 0.8 }}
        />
        <motion.ul
          className="hero__data"
          style={{ listStyle: 'none' }}
          initial={reduced ? undefined : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: tide, delay: 1.4 }}
        >
          <li>Yacht privatisé</li>
          <li>Skipper inclus</li>
          <li>Journée en mer ou nuit à quai</li>
        </motion.ul>
      </div>

      <div className="hero__scroll" aria-hidden="true">
        <span>Descendre</span>
        <span className="hero__scroll-line" />
      </div>
    </section>
  )
}
