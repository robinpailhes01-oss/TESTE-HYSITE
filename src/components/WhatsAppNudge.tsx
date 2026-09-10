import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ease } from '../motion'
import { whatsappLink } from '../whatsapp'
import { WhatsAppGlyph } from './WhatsAppButton'

/* ---------------------------------------------------------------------------
   La bulle de Ludivine.

   Pas une fenêtre : un message, signé, qui glisse en bas de l'écran quand la
   personne a de quoi poser une question, jamais avant. Deux moments :

     · la lecture : huit secondes de présence ET un quart d'écran défilé,
       une fois par 24 h ;
     · l'hésitation : une date choisie dans le formulaire et soixante
       secondes sans paiement. Le message cite la date.

   Une seule voix à la fois : la bulle prévient le pop-up -5 % (événement
   `hy:wa-nudge`), qui attend 45 s et s'efface si WhatsApp a été ouvert.
   On répond à toute heure en moins de cinq minutes : la promesse est
   écrite telle quelle.
--------------------------------------------------------------------------- */

export const NUDGE_AT_KEY = 'hy_wa_nudge_at'
export const WA_OPENED_KEY = 'hy_wa_opened'
const READ_DELAY_MS = 8000
const READ_SCROLL = 0.25
const HESITATION_MS = 60000
const REMEMBER_MS = 24 * 3600 * 1000

type Variant =
  | { kind: 'read' }
  | { kind: 'date'; iso: string; label: string; group: 'sortie' | 'nuit'; guests: string | null }

function longDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
}

function shownRecently() {
  try {
    const at = Number(window.localStorage.getItem(NUDGE_AT_KEY) || 0)
    return at > 0 && Date.now() - at < REMEMBER_MS
  } catch {
    return false
  }
}

function remember(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // sans persistance, la bulle peut revenir à la prochaine visite : acceptable.
  }
}

export default function WhatsAppNudge() {
  const reduced = useReducedMotion()
  const { pathname } = useLocation()
  const [variant, setVariant] = useState<Variant | null>(null)
  const [open, setOpen] = useState(false)
  const reservable = /^\/(sortie-en-mer-carnon|nuit-a-bord-yacht-carnon)\/?$/.test(pathname)

  /* --- la lecture ------------------------------------------------------- */
  useEffect(() => {
    if (shownRecently()) return
    let armed = false
    let shown = false
    let raf = 0
    const show = () => {
      if (shown) return
      shown = true
      setVariant({ kind: 'read' })
      setOpen(true)
    }
    const check = () => {
      if (!armed || shown) return
      /* Une fenêtre déjà ouverte (le pop-up -5 %) garde la parole. */
      if (document.querySelector('.lead-magnet__backdrop')) return
      if (window.scrollY > window.innerHeight * READ_SCROLL) show()
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(check)
    }
    const timer = setTimeout(() => {
      armed = true
      check()
    }, READ_DELAY_MS)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  /* --- l'hésitation ----------------------------------------------------- */
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined
    let done = false
    const onDate = (e: Event) => {
      const d = (e as CustomEvent<{ iso: string; group: 'sortie' | 'nuit'; guests: string | null }>).detail
      if (done || !d?.iso) return
      clearTimeout(timer)
      timer = setTimeout(() => {
        if (done) return
        done = true
        setVariant({ kind: 'date', iso: d.iso, label: longDate(d.iso), group: d.group, guests: d.guests })
        setOpen(true)
      }, HESITATION_MS)
    }
    const onCheckout = () => {
      done = true
      clearTimeout(timer)
      setOpen(false)
    }
    window.addEventListener('hy:date-chosen', onDate)
    window.addEventListener('hy:checkout-started', onCheckout)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('hy:date-chosen', onDate)
      window.removeEventListener('hy:checkout-started', onCheckout)
    }
  }, [])

  /* À l'ouverture : on date la bulle, on prévient le pop-up, on écarte les
     avis qui partagent le même coin. */
  useEffect(() => {
    if (!open) {
      document.body.classList.remove('has-nudge')
      return
    }
    remember(NUDGE_AT_KEY, String(Date.now()))
    window.dispatchEvent(new CustomEvent('hy:wa-nudge'))
    document.body.classList.add('has-nudge')
    return () => document.body.classList.remove('has-nudge')
  }, [open])

  /* Changer de page ferme la bulle : elle appartient au moment. */
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  if (!variant) return null

  const what = variant.kind === 'date' ? (variant.group === 'nuit' ? 'une nuit à bord' : 'une sortie en mer') : null
  const text =
    variant.kind === 'date'
      ? `Bonjour Ludivine, je regarde ${what} le ${variant.label}${variant.guests ? ` pour ${variant.guests}` : ''}, est-ce disponible ?`
      : 'Bonjour Ludivine, je regarde une sortie en mer ou une nuit à bord et j’aimerais savoir quelles dates sont disponibles.'

  const onWrite = () => {
    remember(WA_OPENED_KEY, '1')
    setOpen(false)
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.aside
          className={`nudge${reservable ? ' nudge--over-dock' : ''}`}
          role="status"
          aria-label="Message de Ludivine"
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.45, ease }}
        >
          <button type="button" className="nudge__close" aria-label="Fermer" onClick={() => setOpen(false)}>
            ×
          </button>
          <div className="nudge__head">
            <span className="nudge__avatar" aria-hidden="true">
              L
            </span>
            <span className="nudge__who">
              Ludivine
              <span className="nudge__sub">Harmonie Yacht · répond en moins de 5 min, à toute heure</span>
            </span>
          </div>
          <p className="nudge__text">
            {variant.kind === 'date' ? (
              <>
                Le <strong>{variant.label}</strong> vous tente ? Je vous confirme la disponibilité en cinq
                minutes, sans engagement.
              </>
            ) : (
              <>
                Bonjour, c’est Ludivine. Vous cherchez une date ? Dites-moi laquelle, je vous réponds en
                moins de cinq minutes, à toute heure.
              </>
            )}
          </p>
          <a className="btn nudge__cta" href={whatsappLink(text)} target="_blank" rel="noopener noreferrer" onClick={onWrite}>
            <WhatsAppGlyph />
            Écrire à Ludivine
          </a>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  )
}
