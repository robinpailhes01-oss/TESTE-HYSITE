import { motion } from 'motion/react'
import { useReveal } from '../motion'

/* Tarifs indicatifs — à ajuster avant mise en ligne. */
const OFFERS = [
  {
    name: 'Sortie en mer',
    it: 'en mer',
    plain: 'Sortie',
    amount: '890 €',
    unit: 'la journée',
    includes: [
      'Yacht privatisé, skipper inclus',
      'Carburant & mouillage compris',
      'Apéritif au soleil couchant',
      'Jusqu’à 8 invités',
    ],
    note: 'Demi-journée disponible sur demande.',
  },
  {
    name: 'Nuit insolite à quai',
    plain: 'Nuit insolite',
    it: 'à quai',
    amount: '490 €',
    unit: 'la nuit',
    includes: [
      'Le yacht pour vous seuls, de 18 h à 10 h',
      'Champagne de bienvenue',
      'Petit-déjeuner servi à bord',
      'Linge de maison & cabine préparée',
    ],
    note: 'Idéal anniversaires, demandes & escapades.',
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
            <article className="offer" key={o.name}>
              <h3 className="mixed offer__name">
                {o.plain} <span className="it">{o.it}</span>
              </h3>
              <p className="offer__price">
                <span className="offer__unit">à partir de</span>
                <span className="offer__amount">{o.amount}</span>
                <span className="offer__unit">{o.unit}</span>
              </p>
              <ul className="offer__includes">
                {o.includes.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <p className="offer__note">{o.note}</p>
              <a href="#reservation" className="btn btn--ocean">
                Vérifier une date
              </a>
            </article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
