import { motion } from 'motion/react'
import { useReveal } from '../motion'
import { REVIEWS } from '../experiences'

function Stars() {
  return (
    <span className="review__stars" aria-label="5 étoiles sur 5">
      ★★★★★
    </span>
  )
}

export default function Reviews() {
  const head = useReveal()
  const grid = useReveal(0.1)

  return (
    <section className="section" id="avis" style={{ background: 'var(--white)' }}>
      <div className="container">
        <motion.div className="section-head" {...head}>
          <p className="kicker">Ils ont embarqué</p>
          <h2 className="mixed">
            Des moments <span className="it">qui restent</span>
          </h2>
        </motion.div>

        <motion.div className="reviews" {...grid}>
          {REVIEWS.map((r) => (
            <article className="review" key={r.name}>
              <Stars />
              <p className="review__text">« {r.text} »</p>
              <footer className="review__footer">
                <span className="review__avatar" aria-hidden="true">
                  {r.initials}
                </span>
                <span>
                  <span className="review__name">{r.name}</span>
                  <span className="review__context">{r.context}</span>
                </span>
              </footer>
            </article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
