import { motion } from 'motion/react'
import { useReveal } from '../motion'
import RevealImage from './RevealImage'

const SPECS = [
  { key: 'Invités en journée', value: '10' },
  { key: 'Invités la nuit', value: '2' },
  { key: 'Skipper', value: 'Inclus' },
  { key: 'Pont', value: 'Bains de soleil avant & arrière, table extérieure centrale' },
  { key: 'Salon intérieur', value: 'Table & frigo' },
]

export default function Yacht() {
  const body = useReveal(0.12)

  return (
    <section className="section" id="yacht">
      <div className="container yacht">
        <RevealImage
          className="yacht__media"
          src="/images/yacht-salon-interieur.jpg"
          alt="Le salon intérieur du yacht Harmonie, boiseries et coin repas"
        />
        <motion.div className="yacht__body" {...body}>
          <p className="kicker">Le yacht</p>
          <h2 className="mixed yacht__title">
            Un seul bateau, tenu <span className="it">avec soin</span>
          </h2>
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
