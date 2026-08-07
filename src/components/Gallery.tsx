import { motion } from 'motion/react'
import { useTideReveal } from '../motion'

const SHOTS = [
  { cls: 'gallery__a', src: '/images/soir.jpg', alt: 'Bateau au soleil couchant devant les montagnes', caption: 'Le soir tombe' },
  { cls: 'gallery__b', src: '/images/champagne.jpg', alt: 'Champagne servi à bord pendant la navigation', caption: 'À bord' },
  { cls: 'gallery__c', src: '/images/voilier.jpg', alt: 'Voilier classique sous voiles', caption: 'Le large' },
  { cls: 'gallery__d', src: '/images/mer.jpg', alt: 'Yacht au mouillage dans une eau turquoise', caption: 'Au mouillage' },
]

export default function Gallery() {
  const head = useTideReveal()
  const grid = useTideReveal(0.1)

  return (
    <section className="section" id="galerie">
      <div className="container">
        <motion.div className="section-head" {...head}>
          <p className="kicker">Galerie</p>
          <h2 className="display" style={{ fontSize: 'clamp(34px, 4vw, 56px)' }}>
            Des images plutôt que <em>des promesses</em>
          </h2>
        </motion.div>

        <motion.div className="gallery" {...grid}>
          {SHOTS.map((s) => (
            <figure className={s.cls} key={s.src + s.caption}>
              <img src={s.src} alt={s.alt} loading="lazy" />
              <figcaption>{s.caption}</figcaption>
            </figure>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
