import { motion } from 'motion/react'
import { useReveal } from '../motion'
import { GOOGLE_REVIEWS_URL } from '../experiences'

export default function Reviews() {
  const head = useReveal()
  const card = useReveal(0.1)

  return (
    <section className="section" id="avis" style={{ background: 'var(--white)' }}>
      <div className="container">
        <motion.div className="section-head" {...head}>
          <p className="kicker">Ils ont embarqué</p>
          <h2 className="mixed">
            Des moments <span className="it">qui restent</span>
          </h2>
        </motion.div>

        <motion.a
          className="reviews-google"
          href={GOOGLE_REVIEWS_URL}
          target="_blank"
          rel="noopener noreferrer"
          {...card}
        >
          <span className="reviews-google__stars" aria-hidden="true">
            ★★★★★
          </span>
          <span className="reviews-google__text">
            Retrouvez les avis de nos clients sur notre fiche Google
          </span>
          <span className="link-arrow">Voir les avis Google</span>
        </motion.a>
      </div>
    </section>
  )
}
