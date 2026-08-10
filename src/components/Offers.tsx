import { motion } from 'motion/react'
import { useReveal } from '../motion'

/* Tarifs indicatifs — à ajuster avant mise en ligne. */
const OFFERS = [
  {
    plain: 'Sortie',
    it: 'en mer',
    value: 'Sortie en mer',
    amount: '380 €',
    unit: 'les 2 heures',
    desc: 'Yacht privatisé avec capitaine, carburant et mouillage compris. Formules 2 h, 3 h ou 4 h — sans capitaine (permis côtier) dès 320 €. Jusqu’à 8 invités.',
  },
  {
    plain: 'Nuit insolite',
    it: 'à quai',
    value: 'Nuit insolite à quai',
    amount: '490 €',
    unit: 'la nuit',
    desc: 'Le yacht pour vous seuls de 18 h à 10 h — champagne de bienvenue, cabine préparée, petit-déjeuner servi à bord au réveil.',
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
            Deux formules, <span className="it">tout compris</span>
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
                  window.dispatchEvent(
                    new CustomEvent('preselect-experience', { detail: o.value }),
                  )
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
