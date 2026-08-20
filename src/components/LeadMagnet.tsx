import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useLocation } from 'react-router'
import { ease } from '../motion'
import { LEAD_MAGNET_CODE, LEAD_MAGNET_PERCENT, LEAD_MAGNET_SEEN_KEY, PROMO_STORAGE_KEY } from '../leadMagnet'

const SUPABASE_URL = 'https://szdfpjyytwedhochvzfd.supabase.co'
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6ZGZwanl5dHdlZGhvY2h2emZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NzExMDEsImV4cCI6MjA5NTM0NzEwMX0.LKISYgm1CBPYP4VfvH_S6C7meSQb1H57LxkldF9UhC0'

const ARM_DELAY = 2500

/* Pop-up de capture email — un code -5 % contre un prénom et un email.
   Ne se déclenche qu'après un vrai signal d'intérêt (la galerie de la
   page, juste avant la réservation) sans que le client ait encore ouvert
   le formulaire, et une seule fois par visiteur. */
export default function LeadMagnet() {
  const reduced = useReducedMotion()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const alreadyHandled = useRef(false)

  useEffect(() => {
    if (reduced || alreadyHandled.current) return
    try {
      if (window.localStorage.getItem(LEAD_MAGNET_SEEN_KEY)) {
        alreadyHandled.current = true
        return
      }
    } catch {
      // localStorage indisponible — on retente sans persistance, tant pis.
    }

    const target = document.querySelector('.page-gallery')
    if (!target) return

    let armTimer: ReturnType<typeof setTimeout>
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || alreadyHandled.current) return
        armTimer = setTimeout(() => {
          if (alreadyHandled.current) return
          setOpen(true)
        }, ARM_DELAY)
        obs.disconnect()
      },
      { threshold: 0.3 },
    )
    obs.observe(target)
    return () => {
      obs.disconnect()
      clearTimeout(armTimer)
    }
  }, [reduced, pathname])

  function dismiss() {
    setOpen(false)
    alreadyHandled.current = true
    try {
      window.localStorage.setItem(LEAD_MAGNET_SEEN_KEY, '1')
    } catch {
      // pas grave — au pire le pop-up peut se redéclencher sur cette session.
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const firstName = String(data.get('first_name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    if (!firstName || !email) return

    setStatus('sending')
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/lead-magnet-signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ first_name: firstName, email }),
      })
      if (!res.ok) throw new Error('failed')
      setStatus('done')
      try {
        window.localStorage.setItem(PROMO_STORAGE_KEY, LEAD_MAGNET_CODE)
        window.localStorage.setItem(LEAD_MAGNET_SEEN_KEY, '1')
      } catch {
        // le code reste affiché à l'écran même si on ne peut pas le retenir.
      }
      alreadyHandled.current = true
    } catch {
      setStatus('error')
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="lead-magnet__backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease }}
          onClick={dismiss}
        >
          <motion.div
            className="lead-magnet"
            role="dialog"
            aria-modal="true"
            aria-label="Recevoir un code de réduction"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.4, ease }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="lead-magnet__close" aria-label="Fermer" onClick={dismiss}>
              ×
            </button>

            {status === 'done' ? (
              <div className="lead-magnet__done">
                <p className="kicker">Merci !</p>
                <p className="lead-magnet__title">Votre code est prêt</p>
                <p className="lead-magnet__code">{LEAD_MAGNET_CODE}</p>
                <p className="lead-magnet__hint">
                  Il est déjà pré-rempli dans le formulaire de réservation, en bas de page.
                </p>
                <button type="button" className="btn btn--light" onClick={dismiss}>
                  Continuer
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <p className="kicker">Avant de partir</p>
                <p className="lead-magnet__title">
                  -{LEAD_MAGNET_PERCENT} % sur votre réservation
                </p>
                <p className="lead-magnet__text">
                  Laissez-nous votre email, on vous envoie un code de réduction à utiliser quand
                  vous serez prêt à réserver.
                </p>
                <div className="field">
                  <label htmlFor="lm-name">Prénom</label>
                  <input id="lm-name" name="first_name" type="text" autoComplete="given-name" required />
                </div>
                <div className="field">
                  <label htmlFor="lm-email">Email</label>
                  <input id="lm-email" name="email" type="email" autoComplete="email" required />
                </div>
                {status === 'error' ? (
                  <p className="form__error">Une erreur est survenue, réessayez.</p>
                ) : null}
                <button type="submit" className="btn btn--light" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Envoi…' : 'Recevoir mon code'}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
