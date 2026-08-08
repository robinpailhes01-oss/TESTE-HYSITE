import { motion } from 'motion/react'
import { useReveal } from '../motion'

/* Caractéristiques à ajuster avec les vraies données du bateau. */
const SPECS = [
  { key: 'Invités en journée', value: '8' },
  { key: 'Couchages pour la nuit', value: '4' },
  { key: 'Cabines', value: '2' },
  { key: 'Skipper', value: 'Inclus' },
  { key: 'Pont', value: 'Teck & bain de soleil' },
]

export default function Yacht() {
  const media = useReveal()
  const body = useReveal(0.12)

  return (
    <section className="section" id="yacht">
      <div className="container yacht">
        <motion.div className="yacht__media" {...media}>
          <img
            src="/images/calme-bateau.jpg"
            alt="Le yacht Harmonie à l’ancre sur une mer calme, un invité à la proue"
            loading="lazy"
          />
        </motion.div>
        <motion.div className="yacht__body" {...body}>
          <p className="kicker">Le yacht</p>
          <h2 className="mixed yacht__title">
            Un seul bateau, tenu <span className="it">comme une maison</span>
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
