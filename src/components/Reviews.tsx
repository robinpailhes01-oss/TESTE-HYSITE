import { motion } from 'motion/react'
import { useReveal } from '../motion'
import { GOOGLE_REVIEWS_URL, REVIEWS } from '../reviews'

function Stars({ n }: { n: number }) {
  return (
    <span className="review__stars" aria-label={`${n} étoiles sur 5`}>
      {'★'.repeat(n)}
    </span>
  )
}

/* Un échantillon suffit pour la page — le reste des avis reste disponible
   dans src/reviews.ts (voir aussi ReviewToast) et sur la fiche Google. */
const FEATURED = REVIEWS.slice(0, 6)

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
          {FEATURED.map((r) => (
            <article className="review" key={r.name}>
              <Stars n={r.stars} />
              <p className="review__text">« {r.text} »</p>
              <footer className="review__footer">
                <span className="review__avatar" aria-hidden="true">
                  {r.initials}
                </span>
                <span>
                  <span className="review__name">{r.name}</span>
                  <span className="review__context">{r.when} · avis Google</span>
                </span>
              </footer>
            </article>
          ))}
        </motion.div>

        <a
          className="link-arrow reviews__more"
          href={GOOGLE_REVIEWS_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Voir tous nos avis sur Google
        </a>
      </div>
    </section>
  )
}
