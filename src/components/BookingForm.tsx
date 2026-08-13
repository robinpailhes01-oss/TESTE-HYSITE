import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ease } from '../motion'
import Calendar from './Calendar'
import { DEPOSIT_RATE, findPrice } from '../pricing'

type Group = 'sortie' | 'nuit'
type Duration = '2h' | '3h' | '4h'

type Props = {
  /* Si fourni, la prestation est fixée (pages détail) — sinon bascule (home). */
  group?: Group
}

function formatDate(d: Date) {
  return d.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/* Formulaire de réservation — encaisse un acompte de 30 % via Stripe Checkout.
   Le solde restant se règle directement (à bord ou par virement). */
export default function BookingForm({ group: fixedGroup }: Props) {
  const [groupChoice, setGroupChoice] = useState<Group>(fixedGroup ?? 'sortie')
  const [duration, setDuration] = useState<Duration>('3h')
  const [captain, setCaptain] = useState<'avec' | 'sans'>('avec')
  const [date, setDate] = useState<Date | null>(null)
  const [calOpen, setCalOpen] = useState(false)
  const [dateHint, setDateHint] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  /* Les cartes de formules (page Sorties) présélectionnent une durée. */
  useEffect(() => {
    const onPreselect = (e: Event) => setDuration((e as CustomEvent<Duration>).detail)
    window.addEventListener('preselect-formule', onPreselect)
    return () => window.removeEventListener('preselect-formule', onPreselect)
  }, [])

  const priceId = useMemo(
    () =>
      groupChoice === 'nuit'
        ? 'nuit-a-quai'
        : `sortie-${duration}-${captain === 'avec' ? 'capitaine' : 'solo'}`,
    [groupChoice, duration, captain],
  )
  const price = findPrice(priceId)
  const deposit = price ? Math.round(price.amount * DEPOSIT_RATE) : null
  const balance = price && deposit !== null ? price.amount - deposit : null

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrorMsg(null)

    if (!date) {
      setCalOpen(true)
      setDateHint(true)
      return
    }
    if (!price || deposit === null) return

    const data = new FormData(e.currentTarget)
    setLoading(true)
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          name: String(data.get('name') ?? ''),
          email: String(data.get('email') ?? ''),
          guests: String(data.get('guests') ?? ''),
          message: String(data.get('message') ?? ''),
          date: date.toISOString(),
        }),
      })
      const payload = await res.json().catch(() => ({}))
      if (!res.ok || !payload.url) {
        throw new Error(payload.error || 'Une erreur est survenue.')
      }
      window.location.href = payload.url
    } catch (err) {
      setLoading(false)
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Le paiement en ligne est momentanément indisponible.',
      )
    }
  }

  return (
    <motion.form
      className="form"
      onSubmit={handleSubmit}
      transition={{ duration: 0.4, ease }}
    >
      {!fixedGroup ? (
        <div className="group-switch field--full" role="tablist" aria-label="Choisir la prestation">
          <button
            type="button"
            role="tab"
            aria-pressed={groupChoice === 'sortie'}
            onClick={() => setGroupChoice('sortie')}
          >
            Sortie en mer
          </button>
          <button
            type="button"
            role="tab"
            aria-pressed={groupChoice === 'nuit'}
            onClick={() => setGroupChoice('nuit')}
          >
            Nuit à quai
          </button>
        </div>
      ) : null}

      <div className="field">
        <label htmlFor="bk-name">Nom</label>
        <input id="bk-name" name="name" type="text" autoComplete="name" required />
      </div>
      <div className="field">
        <label htmlFor="bk-email">Email</label>
        <input id="bk-email" name="email" type="email" autoComplete="email" required />
      </div>

      {groupChoice === 'sortie' ? (
        <>
          <div className="field">
            <label htmlFor="bk-duration">Durée</label>
            <select
              id="bk-duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value as Duration)}
            >
              <option value="2h">2 heures</option>
              <option value="3h">3 heures</option>
              <option value="4h">4 heures</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="bk-captain">Capitaine</label>
            <select
              id="bk-captain"
              value={captain}
              onChange={(e) => setCaptain(e.target.value as 'avec' | 'sans')}
            >
              <option value="avec">Avec capitaine</option>
              <option value="sans">Sans capitaine (permis côtier)</option>
            </select>
          </div>
        </>
      ) : null}

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

      {/* Récapitulatif tarifaire — l'acompte est ce qui est réglé maintenant */}
      {price && deposit !== null && balance !== null ? (
        <div className="price-recap field--full" aria-live="polite">
          <div className="price-recap__row is-total">
            <span>{price.label}</span>
            <span>{price.amount} €</span>
          </div>
          <div className="price-recap__row is-deposit">
            <span>Acompte réglé en ligne (30 %)</span>
            <span>{deposit} €</span>
          </div>
          <p className="price-recap__note">
            Solde de {balance} € à régler directement avant l’embarquement.
          </p>
        </div>
      ) : null}

      {errorMsg ? (
        <p className="form__error field--full" role="alert">
          {errorMsg} Vous pouvez aussi nous écrire directement à{' '}
          <a href="mailto:harmonieyacht@gmail.com">harmonieyacht@gmail.com</a>.
        </p>
      ) : null}

      <div className="form__footer">
        <button type="submit" className="btn btn--light" disabled={loading}>
          {loading ? 'Redirection vers le paiement…' : 'Payer l’acompte et réserver'}
        </button>
        <span className="form__hint">Paiement sécurisé · Stripe</span>
      </div>
    </motion.form>
  )
}
