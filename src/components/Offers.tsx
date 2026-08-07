import { motion } from 'motion/react'
import { useTideReveal } from '../motion'

/* Tarifs indicatifs — à ajuster avant mise en ligne. */
const OFFERS = [
  {
    name: 'Sortie en mer',
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
  const head = useTideReveal()
  const grid = useTideReveal(0.1)

  return (
    <section className="section" id="tarifs">
      <div className="container">
        <motion.div className="section-head" {...head}>
          <p className="kicker">Tarifs</p>
          <h2 className="display" style={{ fontSize: 'clamp(34px, 4vw, 56px)' }}>
            Deux formules, <em>tout compris</em>
          </h2>
        </motion.div>

        <motion.div className="offers" {...grid}>
          {OFFERS.map((o) => (
            <article className="offer" key={o.name}>
              <h3 className="display offer__name">{o.name}</h3>
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
              <a href="#reservation" className="btn btn--ghost">
                Vérifier une date
              </a>
            </article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
