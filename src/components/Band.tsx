import { motion } from 'motion/react'
import { useFocusReveal } from '../motion'

export default function Band() {
  const reveal = useFocusReveal(0.1)

  return (
    <section className="band" aria-label="Citation">
      <img src="/images/reflets.jpg" alt="" loading="lazy" />
      <motion.div className="band__quote" {...reveal}>
        <p>
          Venir pour une nuit, repartir avec le sentiment d’avoir voyagé très loin —
          sans avoir quitté le port.
        </p>
      </motion.div>
    </section>
  )
}
