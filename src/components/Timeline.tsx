import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { tide, useTideReveal } from '../motion'

type Step = { time: string; label: string; note: string }

const DAY: Step[] = [
  { time: '10 h 00', label: 'Embarquement', note: 'Accueil au ponton, café servi à bord.' },
  { time: '11 h 30', label: 'Cap sur les criques', note: 'Le skipper choisit avec vous le mouillage du jour.' },
  { time: '13 h 00', label: 'Déjeuner au mouillage', note: 'Table dressée sur le pont, baignade à volonté.' },
  { time: '17 h 30', label: 'La golden hour', note: 'Apéritif face au soleil qui descend.' },
  { time: '19 h 00', label: 'Retour au port', note: 'Dans la lumière du soir, sans se presser.' },
]

const NIGHT: Step[] = [
  { time: '18 h 00', label: 'Embarquement', note: 'Le yacht est prêt, la cabine aussi.' },
  { time: '19 h 00', label: 'Champagne au carré', note: 'Coupe de bienvenue face au port.' },
  { time: '21 h 00', label: 'Soirée sur le pont', note: 'Dîner livré à bord sur demande.' },
  { time: '23 h 00', label: 'Nuit à bord', note: 'Bercés par le clapot, loin de tout.' },
  { time: '9 h 00', label: 'Réveil face à la mer', note: 'Petit-déjeuner servi sur le pont.' },
]

export default function Timeline() {
  const [mode, setMode] = useState<'day' | 'night'>('day')
  const reduced = useReducedMotion()
  const head = useTideReveal()
  const track = useTideReveal(0.1)
  const steps = mode === 'day' ? DAY : NIGHT

  return (
    <section className="section" id="deroule">
      <div className="container">
        <motion.div className="section-head" {...head}>
          <p className="kicker">À bord</p>
          <h2 className="display" style={{ fontSize: 'clamp(34px, 4vw, 56px)' }}>
            Le déroulé, réglé comme <em>une marée</em>
          </h2>
        </motion.div>

        <motion.div {...track}>
          <div className="timeline__switch" role="tablist" aria-label="Choisir l’expérience">
            <button
              role="tab"
              aria-selected={mode === 'day'}
              className="timeline__tab"
              onClick={() => setMode('day')}
            >
              Journée en mer
            </button>
            <button
              role="tab"
              aria-selected={mode === 'night'}
              className="timeline__tab"
              onClick={() => setMode('night')}
            >
              Nuit à quai
            </button>
          </div>

          <div className="timeline__track">
            <div className="timeline__line horizon" />
            <AnimatePresence mode="wait">
              <motion.ol
                key={mode}
                className="timeline__steps"
                style={{ listStyle: 'none' }}
                initial={reduced ? undefined : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -12 }}
                transition={{ duration: 0.5, ease: tide }}
              >
                {steps.map((s) => (
                  <li className="timeline__step" key={s.label}>
                    <span className="timeline__time">{s.time}</span>
                    <p className="timeline__label">{s.label}</p>
                    <p className="timeline__note">{s.note}</p>
                  </li>
                ))}
              </motion.ol>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
