import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { Variants } from 'motion/react'
import { ease, useReveal } from '../motion'

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

type Step = { time: string; label: string; it?: string; note: string }

const DAY: Step[] = [
  { time: '10 h 00', label: 'Embarquement', note: 'Accueil au ponton, café servi à bord.' },
  { time: '11 h 30', label: 'Cap sur', it: 'les criques', note: 'Le skipper choisit avec vous le mouillage du jour.' },
  { time: '13 h 00', label: 'Déjeuner', it: 'au mouillage', note: 'Table dressée sur le pont, baignade à volonté.' },
  { time: '17 h 30', label: 'La', it: 'golden hour', note: 'Apéritif face au soleil qui descend.' },
  { time: '19 h 00', label: 'Retour au port', note: 'Dans la lumière du soir, sans se presser.' },
]

const NIGHT: Step[] = [
  { time: '18 h 00', label: 'Embarquement', note: 'Le yacht est prêt, la cabine aussi.' },
  { time: '19 h 00', label: 'Champagne', it: 'au carré', note: 'Coupe de bienvenue face au port.' },
  { time: '21 h 00', label: 'Soirée', it: 'sur le pont', note: 'Dîner livré à bord sur demande.' },
  { time: '23 h 00', label: 'Nuit à bord', note: 'Bercés par le clapot, loin de tout.' },
  { time: '9 h 00', label: 'Réveil', it: 'face à la mer', note: 'Petit-déjeuner servi sur le pont.' },
]

export default function Route() {
  const [mode, setMode] = useState<'day' | 'night'>('day')
  const reduced = useReducedMotion()
  const head = useReveal()
  const track = useReveal(0.1)
  const steps = mode === 'day' ? DAY : NIGHT

  return (
    <section className="section on-ocean" id="abord">
      <div className="container">
        <motion.div className="section-head" {...head}>
          <p className="kicker">À bord</p>
          <h2 className="mixed">
            Le parcours, <span className="it">heure par heure</span>
          </h2>
        </motion.div>

        <motion.div {...track}>
          <div className="route__switch" role="tablist" aria-label="Choisir l’expérience">
            <button
              role="tab"
              aria-selected={mode === 'day'}
              className="route__tab"
              onClick={() => setMode('day')}
            >
              Journée en mer
            </button>
            <button
              role="tab"
              aria-selected={mode === 'night'}
              className="route__tab"
              onClick={() => setMode('night')}
            >
              Nuit à quai
            </button>
          </div>

          <div className="route__track">
            <div className="route__line" aria-hidden="true" />
            <AnimatePresence mode="wait">
              <motion.ol
                key={mode}
                className="route__steps"
                variants={listVariants}
                initial={reduced ? false : 'hidden'}
                animate="show"
                exit={reduced ? undefined : 'exit'}
              >
                {steps.map((s) => (
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
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
