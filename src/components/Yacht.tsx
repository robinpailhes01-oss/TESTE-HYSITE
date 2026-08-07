import { motion } from 'motion/react'
import { useTideReveal } from '../motion'

/* Caractéristiques à ajuster avec les vraies données du bateau. */
const SPECS = [
  { key: 'Invités en journée', value: '8' },
  { key: 'Couchages pour la nuit', value: '4' },
  { key: 'Cabines', value: '2' },
  { key: 'Skipper', value: 'Inclus' },
  { key: 'Pont', value: 'Teck & bain de soleil' },
]

export default function Yacht() {
  const media = useTideReveal()
  const body = useTideReveal(0.15)

  return (
    <section className="section section--ivory" id="yacht">
      <div className="container yacht">
        <motion.div className="yacht__media" {...media}>
          <img src="/images/yacht.jpg" alt="Yacht à coque sombre naviguant au large" loading="lazy" />
        </motion.div>
        <motion.div className="yacht__body" {...body}>
          <p className="kicker">Le yacht</p>
          <h2 className="display yacht__title">
            Un seul bateau, tenu comme <em>une maison</em>
          </h2>
          <p className="yacht__desc">
            Nous ne gérons pas une flotte. Nous tenons un yacht — préparé, briefé et fleuri avant
            chaque embarquement, comme on prépare une suite avant une arrivée. Vous le trouverez
            exactement comme vous l’espérez.
          </p>
          <ul className="specs">
            {SPECS.map((s) => (
              <li key={s.key}>
                <span className="specs__key">{s.key}</span>
                <span className="specs__value">{s.value}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  )
}
