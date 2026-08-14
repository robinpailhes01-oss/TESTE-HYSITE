import { motion } from 'motion/react'
import { useReveal } from '../motion'

const OFFERS = [
  {
    plain: 'Sortie',
    it: 'en mer',
    group: 'sortie',
    amount: '380 €',
    unit: 'les 2 heures',
    desc: 'Yacht privatisé avec capitaine, carburant et mouillage compris. Formules 2 h, 3 h ou 4 h — sans capitaine (permis côtier) dès 320 €. Jusqu’à 8 invités.',
  },
  {
    plain: 'Nuit',
    it: 'à quai',
    group: 'nuit',
    amount: '180 €',
    unit: 'la nuit',
    desc: 'Nuit Insolite (hiver, yacht chauffé) dès 180 €, ou Nuit Prestige (été, avec sortie en mer) à 380 €. Le yacht pour vous seuls, petit-déjeuner inclus. Jusqu’à 2 personnes.',
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
