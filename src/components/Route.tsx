import { motion, useReducedMotion } from 'motion/react'
import type { Variants } from 'motion/react'
import { ease, useReveal } from '../motion'
import { NIGHT_STEPS } from '../experiences'

/* Les waypoints s'égrènent un à un le long du parcours */
const listVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3, ease } },
}

const stepVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
}

export default function Route() {
  const reduced = useReducedMotion()
  const head = useReveal()
  const track = useReveal(0.1)

  return (
    <section className="section on-ocean" id="abord">
      <div className="container">
        <motion.div className="section-head" {...head}>
          <p className="kicker">La nuit à quai</p>
          <h2 className="mixed">
            La nuit, <span className="it">heure par heure</span>
          </h2>
        </motion.div>

        <motion.div {...track}>
          <div className="route__track">
            <div className="route__line" aria-hidden="true" />
            <motion.ol
              className="route__steps"
              variants={listVariants}
              initial={reduced ? false : 'hidden'}
              animate="show"
            >
              {NIGHT_STEPS.map((s) => (
                <motion.li className="route__step" variants={stepVariants} key={s.label + s.time}>
                  <span className="route__time">{s.time}</span>
                  <p className="route__label">
                    {s.label}
                    {s.it ? (
                      <>
                        {' '}
                        <span className="it">{s.it}</span>
                      </>
                    ) : null}
                  </p>
                  <p className="route__note">{s.note}</p>
                </motion.li>
              ))}
            </motion.ol>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
