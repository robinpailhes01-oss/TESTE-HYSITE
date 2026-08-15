import { motion } from 'motion/react'
import { useReveal } from '../motion'

const OFFERS = [
  {
    plain: 'Sortie',
    it: 'en mer',
    group: 'sortie',
    amount: '380 €',
    unit: 'les 2 heures',
    desc: 'Yacht privatisé avec capitaine, carburant et mouillage compris. De 2 h à 8 h (Ultra Premium, 1 250 €) — sans capitaine dès 320 €. Jusqu’à 10 invités.',
  },
  {
    plain: 'Nuit',
    it: 'à quai',
    group: 'nuit',
    amount: '250 €',
    unit: 'la nuit',
    desc: 'À partir de 250 € (petit-déjeuner sur plateau, jusqu’à 10 h), ou 380 € en Nuit Prestige avec sortie en mer au coucher de soleil et tapas Una Mas. Le yacht pour vous seuls. Jusqu’à 2 personnes.',
  },
]

export default function Offers() {
  const head = useReveal()
  const grid = useReveal(0.1)

  return (
    <section className="section" id="tarifs">
      <div className="container">
        <motion.div className="section-head" {...head}>
          <p className="kicker">Tarifs</p>
          <h2 className="mixed">
            Deux prestations, <span className="it">tout compris</span>
          </h2>
        </motion.div>

        <motion.div className="offers" {...grid}>
          {OFFERS.map((o) => (
            <article className="offer" key={o.plain}>
              <h3 className="mixed offer__name">
                {o.plain} <span className="it">{o.it}</span>
              </h3>
              <p className="offer__price">
                <span className="offer__unit">à partir de</span>
                <span className="offer__amount">{o.amount}</span>
                <span className="offer__unit">{o.unit}</span>
              </p>
              <p className="offer__desc">{o.desc}</p>
              <a
                href="#reservation"
                className="link-arrow"
                onClick={() =>
                  window.dispatchEvent(new CustomEvent('preselect-group', { detail: o.group }))
                }
              >
                Vérifier une date
              </a>
            </article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
