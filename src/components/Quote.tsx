import { motion } from 'motion/react'
import { useTideReveal } from '../motion'

export default function Quote() {
  const reveal = useTideReveal()

  return (
    <section className="section section--ivory">
      <div className="container">
        <motion.blockquote className="quote" {...reveal}>
          <span className="quote__mark" aria-hidden="true">
            «
          </span>
          <p className="quote__text">
            Nous étions venus pour une nuit. Nous sommes repartis avec le sentiment d’avoir
            voyagé très loin, sans avoir quitté le port.
          </p>
          <footer className="quote__source">A. & C. — nuit à quai</footer>
        </motion.blockquote>
      </div>
    </section>
  )
}
