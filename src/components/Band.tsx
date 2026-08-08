import { motion } from 'motion/react'
import { useFocusReveal } from '../motion'

export default function Band() {
  const reveal = useFocusReveal(0.1)

  return (
    <section className="band" aria-label="Citation">
      <img src="/images/reflets.jpg" alt="" loading="lazy" />
      <motion.blockquote className="band__quote" {...reveal}>
        <p>
          « Nous étions venus pour une nuit. Nous sommes repartis avec le sentiment
          d’avoir voyagé très loin, sans avoir quitté le port. »
        </p>
        <footer>A. & C. — nuit à quai</footer>
      </motion.blockquote>
    </section>
  )
}
