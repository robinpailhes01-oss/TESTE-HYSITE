import { motion } from 'motion/react'
import { useReveal } from '../motion'

const SHOTS = [
  { cls: 'gallery__a', src: '/images/eau.jpg', alt: 'Texture d’eau bleue vue du ciel', caption: 'Le grand bleu' },
  { cls: 'gallery__b', src: '/images/champagne.jpg', alt: 'Champagne servi à bord pendant la navigation', caption: 'À bord' },
  { cls: 'gallery__c', src: '/images/hero-aerial.jpg', alt: 'Voilier vu du ciel sur une mer bleu profond', caption: 'Vue du ciel' },
  { cls: 'gallery__d', src: '/images/plage.jpg', alt: 'Vague sur une plage vue du ciel', caption: 'Escales' },
]

export default function Gallery() {
  const head = useReveal()
  const grid = useReveal(0.1)

  return (
    <section className="section" id="galerie" style={{ background: 'var(--white)' }}>
      <div className="container">
        <motion.div className="section-head" {...head}>
          <p className="kicker">Galerie</p>
          <h2 className="mixed">
            Des images plutôt que <span className="it">des promesses</span>
          </h2>
        </motion.div>

        <motion.div className="gallery" {...grid}>
          {SHOTS.map((s) => (
            <figure className={s.cls} key={s.cls}>
              <img src={s.src} alt={s.alt} loading="lazy" />
              <figcaption>{s.caption}</figcaption>
            </figure>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
