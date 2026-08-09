import { useState } from 'react'

const MONTHS = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
]
const WEEKDAYS = ['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim']

type Props = {
  value: Date | null
  onChange: (d: Date) => void
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

/* Calendrier visuel maison — mois par mois, semaine commençant le lundi. */
export default function Calendar({ value, onChange }: Props) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [view, setView] = useState(() => {
    const base = value ?? today
    return new Date(base.getFullYear(), base.getMonth(), 1)
  })

  const year = view.getFullYear()
  const month = view.getMonth()
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7 // lundi = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth()

  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  return (
    <div className="calendar" role="group" aria-label="Choisir une date">
      <div className="calendar__head">
        <button
          type="button"
          className="calendar__nav"
          aria-label="Mois précédent"
          disabled={isCurrentMonth}
          onClick={() => setView(new Date(year, month - 1, 1))}
        >
          ←
        </button>
        <span className="calendar__month">
          {MONTHS[month]} <span className="calendar__year">{year}</span>
        </span>
        <button
          type="button"
          className="calendar__nav"
          aria-label="Mois suivant"
          onClick={() => setView(new Date(year, month + 1, 1))}
        >
          →
        </button>
      </div>

      <div className="calendar__weekdays" aria-hidden="true">
        {WEEKDAYS.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      <div className="calendar__grid">
        {cells.map((day, i) => {
          if (day === null) return <span key={`empty-${i}`} />
          const date = new Date(year, month, day)
          const past = date < today
          const selected = value !== null && sameDay(date, value)
          const isToday = sameDay(date, today)
          return (
            <button
              type="button"
              key={day}
              className={`calendar__day${selected ? ' is-selected' : ''}${isToday ? ' is-today' : ''}`}
              disabled={past}
              aria-pressed={selected}
              onClick={() => onChange(date)}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}
