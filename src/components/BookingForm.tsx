import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ease } from '../motion'
import Calendar from './Calendar'

type Props = {
  /* Si fourni, l'expérience est fixée (pages détail) — sinon menu déroulant (home). */
  fixedExperience?: string
}

function formatDate(d: Date) {
  return d.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/* Formulaire visuel uniquement — aucune donnée n'est envoyée pour l'instant. */
export default function BookingForm({ fixedExperience }: Props) {
  const [sent, setSent] = useState(false)
  const [experience, setExperience] = useState(fixedExperience ?? 'Sortie en mer')
  const [date, setDate] = useState<Date | null>(null)
  const [calOpen, setCalOpen] = useState(false)
  const [dateHint, setDateHint] = useState(false)

  useEffect(() => {
    if (fixedExperience) return
    const onPreselect = (e: Event) => setExperience((e as CustomEvent<string>).detail)
    window.addEventListener('preselect-experience', onPreselect)
    return () => window.removeEventListener('preselect-experience', onPreselect)
  }, [fixedExperience])

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!date) {
      setCalOpen(true)
      setDateHint(true)
      return
    }
    setSent(true)
  }

  return (
    <AnimatePresence mode="wait">
      {sent ? (
        <motion.div
          key="done"
          className="form__done"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
        >
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
            <circle cx="22" cy="22" r="21" stroke="currentColor" strokeOpacity="0.4" />
            <path d="M14 22.5l5.5 5.5L30 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="form__done-title mixed">
            Votre demande est <span className="it">bien reçue</span>
          </p>
          <p className="form__done-text">
            Nous revenons vers vous sous 24&nbsp;heures avec une proposition sur mesure pour votre{' '}
            {experience.toLowerCase()}
            {date ? ` le ${formatDate(date)}` : ''}.
          </p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          className="form"
          onSubmit={handleSubmit}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4, ease }}
        >
          <div className="field">
            <label htmlFor="bk-name">Nom</label>
            <input id="bk-name" name="name" type="text" autoComplete="name" required />
          </div>
          <div className="field">
            <label htmlFor="bk-email">Email</label>
            <input id="bk-email" name="email" type="email" autoComplete="email" required />
          </div>
          {fixedExperience ? (
            <div className="field">
              <label htmlFor="bk-guests">Nombre d’invités</label>
              <select id="bk-guests" name="guests" defaultValue="2">
                {['2', '3', '4', '5', '6', '7', '8'].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="field">
              <label htmlFor="bk-experience">Expérience</label>
              <select
                id="bk-experience"
                name="experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                required
              >
                <option>Sortie en mer</option>
                <option>Nuit insolite à quai</option>
                <option>Les deux — jour & nuit</option>
              </select>
            </div>
          )}

          {/* Date : vrai calendrier visuel */}
          <div className="field field--full">
            <label htmlFor="bk-date">Date souhaitée</label>
            <button
              id="bk-date"
              type="button"
              className={`cal-trigger${date ? ' has-value' : ''}`}
              aria-expanded={calOpen}
              onClick={() => setCalOpen((v) => !v)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
                <path d="M3.5 9.5h17M8 3v4M16 3v4" />
              </svg>
              {date ? formatDate(date) : 'Choisir une date'}
              <span className="cal-trigger__chevron" aria-hidden="true">
                {calOpen ? '▴' : '▾'}
              </span>
            </button>
            {dateHint && !date ? (
              <span className="cal-hint" role="alert">
                Choisissez d’abord une date dans le calendrier.
              </span>
            ) : null}
            <AnimatePresence>
              {calOpen ? (
                <motion.div
                  className="calendar-wrap"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.45, ease }}
                >
                  <Calendar
                    value={date}
                    onChange={(d) => {
                      setDate(d)
                      setDateHint(false)
                      window.setTimeout(() => setCalOpen(false), 260)
                    }}
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          <div className="field field--full">
            <label htmlFor="bk-message">Votre occasion, vos envies</label>
            <textarea
              id="bk-message"
              name="message"
              placeholder="Un anniversaire à fêter, une surprise à organiser…"
            />
          </div>
          <div className="form__footer">
            <button type="submit" className="btn btn--light">
              Envoyer la demande
            </button>
            <span className="form__hint">Réponse sous 24 h</span>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  )
}
