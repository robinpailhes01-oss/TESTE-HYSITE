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
    <section className="section" id="manifeste">
      <div className="container">
        <motion.p className="kicker" style={{ marginBottom: 24 }} {...head}>
          Notre promesse
        </motion.p>

        <motion.p className="manifesto__text" {...text}>
          Nous sommes convaincus qu’un moment en mer est <span className="it">la parfaite
          solution pour s’évader</span>. Harmonie Yacht vous accueille pour vos après-midis entre
          amis ou en famille, vos EVJF, vos demandes en mariage — en mer à la journée, ou amarré
          au port pour une nuit que vous n’oublierez pas.
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
