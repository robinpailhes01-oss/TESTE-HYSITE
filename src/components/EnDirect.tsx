import { useEffect, useState } from 'react'
import { fetchBookedSlotsResult, getSortieStartHours, isNightBlocked } from '../availability'
import { departureForSunset, formatCarnonTime, sunsetAt } from '../sun'
import { findPrice } from '../pricing'
import '../endirect.css'

/* ---------------------------------------------------------------------------
   « En direct de Carnon » — le seul endroit du site qui parle du monde réel.

   Deux faits, tous les deux vrais et vérifiables :
     - l'heure exacte du coucher de soleil ce soir à Carnon (calcul local,
       pas d'API, cf. src/sun.ts) ;
     - les trois prochaines dates réellement libres pour cette prestation,
       lues dans les vraies réservations (Supabase, get_booked_slots).

   Pourquoi ici, entre l'immersion et les formules : c'est le moment précis où
   le visiteur, convaincu, se demande « oui mais c'est libre quand ? ». Y
   répondre avant qu'il aille chercher, c'est le geste qui distingue un hôtel
   qui s'occupe de vous d'un site qui attend que vous remplissiez un formulaire.

   Prudence assumée : si Supabase est injoignable, la liste des dates n'est pas
   affichée du tout. Mieux vaut ne rien annoncer qu'annoncer « libre » sans le
   savoir — c'est une promesse faite au client, et la disponibilité est de
   toute façon revérifiée au paiement.
--------------------------------------------------------------------------- */

type Props = { group: 'sortie' | 'nuit' }

/* Combien de jours on regarde devant soi pour trouver trois dates libres. */
const HORIZON_DAYS = 60
const WANTED = 3

function toISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function labelFR(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Intl.DateTimeFormat('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }).format(
    new Date(y, m - 1, d),
  )
}

export default function EnDirect({ group }: Props) {
  const [dates, setDates] = useState<string[] | null>(null)
  const [sunset, setSunset] = useState<Date | null>(null)

  /* Le site est prérendu : ces deux valeurs dépendent du jour où l'on regarde,
     donc elles ne peuvent être calculées qu'ici, dans le navigateur. */
  useEffect(() => {
    setSunset(sunsetAt(new Date()))
  }, [])

  useEffect(() => {
    let alive = true
    const today = new Date()
    const end = new Date(today)
    end.setDate(end.getDate() + HORIZON_DAYS)

    fetchBookedSlotsResult(toISO(today), toISO(end)).then(({ ok, slots }) => {
      if (!alive) return
      /* Lecture ratée : on n'annonce rien. Annoncer « libre » sans avoir pu
         vérifier serait une promesse en l'air faite au client. Une lecture
         réussie qui ne ramène rien, en revanche, veut simplement dire que tout
         est libre — cas parfaitement normal pour un bateau peu réservé. */
      if (!ok) {
        setDates([])
        return
      }

      /* La durée la plus courte de la prestation : c'est elle qui décide si un
         jour est « ouvert » au sens le plus large. */
      const shortest = findPrice(group === 'nuit' ? 'nuit-prestige' : 'sortie-2h-capitaine')
      const found: string[] = []

      for (let i = 1; i <= HORIZON_DAYS && found.length < WANTED; i++) {
        const d = new Date(today)
        d.setDate(d.getDate() + i)
        const iso = toISO(d)
        if (shortest?.availableFrom && iso < shortest.availableFrom) continue

        const free =
          group === 'nuit'
            ? !isNightBlocked(iso, slots)
            : getSortieStartHours(iso, shortest?.durationHours ?? 2, slots).length > 0
        if (free) found.push(iso)
      }
      setDates(found)
    })

    return () => {
      alive = false
    }
  }, [group])

  const nothingToShow = !sunset && (!dates || dates.length === 0)
  if (nothingToShow) return null

  return (
    <section className="endirect" aria-label="En direct de Carnon">
      <div className="container endirect__inner">
        {sunset ? (
          <p className="endirect__sun">
            <span className="endirect__dot" aria-hidden="true" />
            Ce soir, le soleil se couche à <strong>{formatCarnonTime(sunset)}</strong> sur Carnon.
            {group === 'sortie' ? (
              <>
                {' '}
                Une sortie de 2 h partie à {departureForSunset(sunset, 1.5)} vous met au large pile à ce
                moment-là.
              </>
            ) : (
              <>
                {' '}
                L’embarquement est à 18 h : la sortie de la Nuit Prestige y est calée.
              </>
            )}
          </p>
        ) : null}

        {dates && dates.length > 0 ? (
          <div className="endirect__dates">
            <p className="kicker">Prochaines dates libres</p>
            <ul>
              {dates.map((iso) => (
                <li key={iso}>
                  <a
                    href="#reservation"
                    onClick={() =>
                      window.dispatchEvent(new CustomEvent('preselect-date', { detail: iso }))
                    }
                  >
                    {labelFR(iso)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  )
}
