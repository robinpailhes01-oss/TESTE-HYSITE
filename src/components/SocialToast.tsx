import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ease } from '../motion'
import { REVIEWS } from '../experiences'

type Toast = { initials: string; title: string; text: string; stars: boolean }

/* Petites notifications discrètes : avis + réservations récentes (exemples). */
const TOASTS: Toast[] = [
  {
    initials: 'L&T',
    title: 'Léa & Thomas — nuit insolite',
    text: '« Réveillés par le soleil sur le port… »',
    stars: true,
  },
  {
    initials: 'M',
    title: 'Réservation confirmée',
    text: 'Une sortie en mer vient d’être réservée pour samedi.',
    stars: false,
  },
  {
    initials: 'C',
    title: `Camille — ${REVIEWS[1].context}`,
    text: '« Le skipper a trouvé une crique incroyable. »',
    stars: true,
  },
  {
    initials: 'J',
    title: 'Julien — demande en fiançailles',
    text: '« Elle a dit oui. »',
    stars: true,
  },
]

const FIRST_DELAY = 7000
const INTERVAL = 20000
const VISIBLE_FOR = 6500

export default function SocialToast() {
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(-1)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (reduced) return
    let count = 0
    let hideTimer: ReturnType<typeof setTimeout>
    const show = () => {
      if (count >= TOASTS.length) return
      setIndex(count)
      setVisible(true)
      hideTimer = setTimeout(() => setVisible(false), VISIBLE_FOR)
      count += 1
    }
    const first = setTimeout(() => {
      show()
      const loop = setInterval(() => {
        if (count >= TOASTS.length) {
          clearInterval(loop)
          return
        }
        show()
      }, INTERVAL)
      ;(window as unknown as { __toastLoop?: ReturnType<typeof setInterval> }).__toastLoop = loop
    }, FIRST_DELAY)
    return () => {
      clearTimeout(first)
      clearTimeout(hideTimer)
      const w = window as unknown as { __toastLoop?: ReturnType<typeof setInterval> }
      if (w.__toastLoop) clearInterval(w.__toastLoop)
    }
  }, [reduced])

  const toast = index >= 0 ? TOASTS[index] : null

  return (
    <div className="toast-zone" aria-live="polite">
      <AnimatePresence>
        {visible && toast ? (
          <motion.div
            key={index}
            className="toast"
            initial={{ opacity: 0, x: -24, y: 8 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.7, ease }}
          >
            <span className="toast__avatar" aria-hidden="true">
              {toast.initials}
            </span>
            <span className="toast__body">
              <span className="toast__title">
                {toast.title}
                {toast.stars ? <span className="toast__stars"> ★★★★★</span> : null}
              </span>
              <span className="toast__text">{toast.text}</span>
            </span>
            <button
              className="toast__close"
              aria-label="Fermer la notification"
              onClick={() => setVisible(false)}
            >
              ×
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
