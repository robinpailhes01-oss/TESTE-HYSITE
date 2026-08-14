import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ease } from '../motion'
import Calendar from './Calendar'
import { DEPOSIT_RATE, findPrice, SORTIE_WINDOW } from '../pricing'
import {
  fetchBookedSlots,
  formatHour,
  getSortieStartHours,
  isDateFullyBlocked,
  isNightBlocked,
} from '../availability'
import type { BookedSlot } from '../availability'

type Group = 'sortie' | 'nuit'
type Duration = '2h' | '3h' | '4h' | '8h'
type NightFormule = 'prestige' | 'sans-sortie'

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

/* YYYY-MM-DD à partir des composantes LOCALES du navigateur — jamais via
   toISOString(), qui convertit en UTC et décale la date d'un jour pour tout
   fuseau positif (dont la France l'été) quand on est proche de minuit. */
function toDateOnly(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/* Ven/sam/dim — la Nuit Prestige le week-end se réserve avec l'équipe, pas en ligne
   (même règle que l'agent Léa : escalade humaine obligatoire). */
function isWeekend(d: Date) {
  const day = d.getDay()
  return day === 0 || day === 5 || day === 6
}

const CONTACT_EMAIL = 'harmonieyacht@gmail.com'

/* Formulaire de réservation — encaisse un acompte de 30 % via Stripe Checkout.
   Le solde restant se règle directement (à bord ou par virement). */
export default function BookingForm({ group: fixedGroup }: Props) {
  const [groupChoice, setGroupChoice] = useState<Group>(fixedGroup ?? 'sortie')
  const [duration, setDuration] = useState<Duration>('3h')
  const [captain, setCaptain] = useState<'avec' | 'sans'>('avec')
  const [nightFormule, setNightFormule] = useState<NightFormule>('prestige')
  const [date, setDate] = useState<Date | null>(null)
  const [startHour, setStartHour] = useState<number | null>(null)
  const [calOpen, setCalOpen] = useState(false)
  const [dateHint, setDateHint] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [slots, setSlots] = useState<BookedSlot[]>([])

  /* Disponibilité réelle : lue une fois dans Supabase (réservations déjà
     confirmées + dates bloquées), sur une fenêtre de 6 mois glissants. */
  useEffect(() => {
    const from = new Date()
    const to = new Date()
    to.setMonth(to.getMonth() + 6)
    fetchBookedSlots(toDateOnly(from), toDateOnly(to)).then(setSlots)
  }, [])

  /* Les cartes de formules (pages détail) présélectionnent une durée (sorties)
     ou une formule de nuit. Les cartes tarifaires de la home ne présélectionnent
     que la prestation (sortie/nuit), sans formule précise. */
  useEffect(() => {
    const onFormule = (e: Event) => {
      const key = (e as CustomEvent<string>).detail
      if (key === '2h' || key === '3h' || key === '4h' || key === '8h') {
        setGroupChoice('sortie')
        setDuration(key)
      } else if (key === 'prestige' || key === 'sans-sortie') {
        setGroupChoice('nuit')
        setNightFormule(key)
      }
    }
    const onGroup = (e: Event) => {
      const g = (e as CustomEvent<string>).detail
      if (g === 'sortie' || g === 'nuit') setGroupChoice(g)
    }
    window.addEventListener('preselect-formule', onFormule)
    window.addEventListener('preselect-group', onGroup)
    return () => {
      window.removeEventListener('preselect-formule', onFormule)
      window.removeEventListener('preselect-group', onGroup)
    }
  }, [])

  const isUltraPremium = groupChoice === 'sortie' && duration === '8h'

  const priceId = useMemo(() => {
    if (groupChoice === 'nuit') return nightFormule === 'prestige' ? 'nuit-prestige' : 'nuit-sans-sortie'
    if (isUltraPremium) return 'sortie-8h-ultra-premium'
    return `sortie-${duration}-${captain === 'avec' ? 'capitaine' : 'solo'}`
  }, [groupChoice, duration, captain, nightFormule, isUltraPremium])

  const price = findPrice(priceId)
  const deposit = price ? Math.round(price.amount * DEPOSIT_RATE) : null
  const balance = price && deposit !== null ? price.amount - deposit : null

  const dateISO = date ? toDateOnly(date) : null

  /* Créneaux de départ possibles pour une sortie, une fois la date choisie —
     entre 9 h et 21 h, 1 h de battement avec les sorties déjà réservées. */
  const sortieHours = useMemo(() => {
    if (groupChoice !== 'sortie' || !dateISO || !price?.durationHours) return []
    return getSortieStartHours(dateISO, price.durationHours, slots)
  }, [groupChoice, dateISO, price, slots])

  useEffect(() => {
    setStartHour(null)
  }, [dateISO, duration])

  const disabledDates = useMemo(() => {
    const set = new Set<string>()
    const from = new Date()
    const to = new Date()
    to.setMonth(to.getMonth() + 6)
    for (const d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
      const iso = toDateOnly(d)
      if (price?.availableFrom && iso < price.availableFrom) {
        set.add(iso)
        continue
      }
      if (isDateFullyBlocked(iso, slots)) {
        set.add(iso)
        continue
      }
      if (groupChoice === 'nuit' && isNightBlocked(iso, slots)) {
        set.add(iso)
        continue
      }
      if (groupChoice === 'sortie' && price?.durationHours && getSortieStartHours(iso, price.durationHours, slots).length === 0) {
        set.add(iso)
      }
    }
    return set
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupChoice, slots, price?.durationHours, price?.availableFrom])

  /* Si la date déjà choisie devient invalide (ex. bascule vers la Nuit à
     quai, disponible seulement à partir du 1er septembre), on la vide plutôt
     que de laisser une date impossible sélectionnée. */
  useEffect(() => {
    if (dateISO && price?.availableFrom && dateISO < price.availableFrom) {
      setDate(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [price?.availableFrom])

  /* Nuit Prestige + date tombant un week-end : pas de paiement en ligne. */
  const blockedWeekendPrestige =
    groupChoice === 'nuit' &&
    !!price?.weekendRequiresContact &&
    date !== null &&
    isWeekend(date)

  const needsSortieHour = groupChoice === 'sortie'

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrorMsg(null)

    if (!date) {
      setCalOpen(true)
      setDateHint(true)
      return
    }
    if (!price || deposit === null || blockedWeekendPrestige) return
    if (needsSortieHour && startHour === null) {
      setErrorMsg('Choisissez une heure de départ disponible.')
      return
    }

    const data = new FormData(e.currentTarget)
    const startTime = groupChoice === 'nuit' ? '18:00' : startHour !== null ? `${String(startHour).padStart(2, '0')}:00` : ''
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
          date: toDateOnly(date),
          startTime,
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
            data-variant="sortie"
            aria-pressed={groupChoice === 'sortie'}
            onClick={() => setGroupChoice('sortie')}
          >
            Sortie en mer
          </button>
          <button
            type="button"
            role="tab"
            data-variant="nuit"
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
              <option value="8h">8 heures — Ultra Premium (1 250 €, tout compris)</option>
            </select>
          </div>
          {!isUltraPremium ? (
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
              {captain === 'sans' ? (
                <p className="field__note">
                  Permis bateau depuis au moins 5 ans et 50 h de navigation justifiables sur un
                  bateau de ce type.
                </p>
              ) : null}
            </div>
          ) : (
            <p className="field__note field--full">
              Journée aux Aresquiers, capitaine et tout inclus — efoil et BBQ à bord.
            </p>
          )}
        </>
      ) : (
        <div className="field field--full">
          <label htmlFor="bk-formule">Formule</label>
          <select
            id="bk-formule"
            value={nightFormule}
            onChange={(e) => setNightFormule(e.target.value as NightFormule)}
          >
            <option value="prestige">Nuit Prestige — avec sortie en mer & tapas (380 €)</option>
            <option value="sans-sortie">Nuit à quai — petit-déjeuner seul (250 €)</option>
          </select>
          {nightFormule === 'sans-sortie' ? (
            <p className="field__note">Disponible à partir du 1er septembre.</p>
          ) : null}
        </div>
      )}

      <div className="field">
        <label htmlFor="bk-guests">Nombre d’invités</label>
        <select id="bk-guests" name="guests" defaultValue="2">
          {(groupChoice === 'nuit' ? ['1', '2'] : ['2', '3', '4', '5', '6', '7', '8', '9', '10']).map((n) => (
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
                disabledDates={disabledDates}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {needsSortieHour && date ? (
        <div className="field field--full">
          <label htmlFor="bk-hour">Heure de départ</label>
          {sortieHours.length > 0 ? (
            <select
              id="bk-hour"
              value={startHour ?? ''}
              onChange={(e) => setStartHour(e.target.value ? Number(e.target.value) : null)}
              required
            >
              <option value="" disabled>
                Choisir une heure
              </option>
              {sortieHours.map((h) => (
                <option key={h} value={h}>
                  {formatHour(h)}
                </option>
              ))}
            </select>
          ) : (
            <p className="cal-hint" role="alert">
              Plus aucun créneau disponible ce jour-là (sorties entre {SORTIE_WINDOW.openHour} h et{' '}
              {SORTIE_WINDOW.closeHour} h, 1 h de battement entre deux sorties) — choisissez une
              autre date.
            </p>
          )}
        </div>
      ) : null}

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

      {blockedWeekendPrestige ? (
        <div className="form__error field--full" role="alert">
          La Nuit Prestige le week-end (ven-dim) se réserve directement avec notre équipe.
          Écrivez-nous à <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </div>
      ) : null}

      {errorMsg ? (
        <p className="form__error field--full" role="alert">
          {errorMsg} Vous pouvez aussi nous écrire directement à{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      ) : null}

      <div className="form__footer">
        <button type="submit" className="btn btn--light" disabled={loading || blockedWeekendPrestige}>
          {loading ? 'Redirection vers le paiement…' : 'Payer l’acompte et réserver'}
        </button>
        <span className="form__hint">Paiement sécurisé · Stripe</span>
      </div>
    </motion.form>
  )
}
