import { motion } from 'motion/react'
import { useTideReveal } from '../motion'

const DATA = [
  { key: 'Formule', value: 'Privatisation totale' },
  { key: 'Équipage', value: 'Skipper dédié' },
  { key: 'Expériences', value: 'Mer & nuit à quai' },
  { key: 'Service', value: 'Sur mesure' },
]

export default function Manifesto() {
  const reveal = useTideReveal()
  const revealData = useTideReveal(0.15)

  return (
    <section className="section section--ivory" id="maison">
      <div className="container">
        <motion.div className="section-head" {...reveal}>
          <p className="kicker">La maison</p>
        </motion.div>

        <motion.p className="manifesto__text" {...reveal}>
          Harmonie Yacht est née d’une conviction&nbsp;: les plus beaux moments méritent un écrin
          rare. Nous privatisons notre yacht pour une seule chose — <em>vous recevoir</em> comme
          les grandes maisons&nbsp;: avec calme, précision et générosité. En mer à la journée, ou
          amarré au port pour une nuit que vous n’oublierez pas.
        </motion.p>

        <motion.dl className="manifesto__data" {...revealData}>
          {DATA.map((d) => (
            <div className="manifesto__cell" key={d.key}>
              <dt>{d.key}</dt>
              <dd>{d.value}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  )
}
