import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useLocation } from 'react-router'
import { ease } from '../motion'
import { REVIEWS } from '../reviews'

/* On ne montre qu'un extrait court en notification — les avis plus longs
   restent réservés à la section « Avis » de la page. */
const TOASTS = REVIEWS.filter((r) => r.text.length <= 140)

const FIRST_DELAY = 1400
const INTERVAL = 14000
const VISIBLE_FOR = 6500

/* Notification discrète reprenant de vrais avis Google — se déclenche
   quand le visiteur approche la section réservation (là où l'hésitation
   au moment de payer l'acompte est la plus probable), pas au hasard dès
   le chargement de la page. */
export default function ReviewToast() {
  const reduced = useReducedMotion()
  const { pathname } = useLocation()
  const [armed, setArmed] = useState(false)
  const [index, setIndex] = useState(-1)
  const [visible, setVisible] = useState(false)
  const [dismissedAll, setDismissedAll] = useState(false)

  /* Se réarme à chaque page (home vs pages détail ont chacune leur #reservation). */
  useEffect(() => {
    setArmed(false)
    setIndex(-1)
    setVisible(false)
  }, [pathname])

  useEffect(() => {
    if (reduced || armed || TOASTS.length === 0) return
    const target = document.getElementById('reservation')
    if (!target) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setArmed(true)
          obs.disconnect()
        }
      },
      { rootMargin: '-20% 0px -20% 0px' },
    )
    obs.observe(target)
    return () => obs.disconnect()
  }, [reduced, armed, pathname])

  useEffect(() => {
    if (!armed || dismissedAll) return
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
      ;(window as unknown as { __reviewLoop?: ReturnType<typeof setInterval> }).__reviewLoop = loop
    }, FIRST_DELAY)
    return () => {
      clearTimeout(first)
      clearTimeout(hideTimer)
      const w = window as unknown as { __reviewLoop?: ReturnType<typeof setInterval> }
      if (w.__reviewLoop) clearInterval(w.__reviewLoop)
    }
  }, [armed, dismissedAll])

  const toast = index >= 0 ? TOASTS[index] : null

  return (
    <div className="toast-zone" aria-live="polite">
      <AnimatePresence>
        {visible && toast ? (
          <motion.div
            key={toast.name}
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
                {toast.name} <span className="toast__stars">★★★★★</span>
              </span>
              <span className="toast__text">« {toast.text} »</span>
            </span>
            <button
              className="toast__close"
              aria-label="Fermer la notification"
              onClick={() => {
                setVisible(false)
                setDismissedAll(true)
              }}
            >
              ×
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
