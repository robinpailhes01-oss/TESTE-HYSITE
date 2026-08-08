import { motion } from 'motion/react'
import { useFocusReveal, useReveal } from '../motion'

const DATA = [
  { key: 'Formule', value: 'Privatisation totale' },
  { key: 'Équipage', value: 'Skipper dédié' },
  { key: 'Expériences', value: 'Mer & nuit à quai' },
  { key: 'Service', value: 'Sur mesure' },
]

export default function Manifesto() {
  const head = useReveal()
  const text = useFocusReveal(0.05)
  const data = useReveal(0.15)

  return (
    <section className="section" id="maison">
      <div className="container">
        <motion.p className="kicker" style={{ marginBottom: 24 }} {...head}>
          La maison
        </motion.p>

        <motion.p className="manifesto__text" {...text}>
          Harmonie Yacht est née d’une conviction&nbsp;: les plus beaux moments méritent un écrin
          rare. Nous privatisons notre yacht pour une seule chose — <span className="it">vous
          recevoir</span> comme les grandes maisons&nbsp;: avec calme, précision et générosité.
          En mer à la journée, ou amarré au port pour une nuit que vous n’oublierez pas.
        </motion.p>

        <motion.dl className="manifesto__data" {...data}>
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
