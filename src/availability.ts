/* ---------------------------------------------------------------------------
   Disponibilité en temps réel — lit les réservations déjà confirmées (et les
   dates bloquées manuellement) directement dans Supabase, via la fonction
   publique `get_booked_slots` (lecture seule, aucune donnée client exposée :
   uniquement date / heure / type de prestation).

   Alimente le calendrier (jours pleins grisés) et le choix d'heure du
   formulaire de réservation (créneaux 9 h-21 h, 1 h de battement entre deux
   sorties). Toute réservation payée déclenche déjà, côté Supabase, la
   synchronisation automatique vers Google Calendar (trigger
   trg_bookings_sync_gcal) — cette lecture ferme la boucle côté site.
--------------------------------------------------------------------------- */

import { SORTIE_WINDOW } from './pricing'

const SUPABASE_URL = 'https://szdfpjyytwedhochvzfd.supabase.co'
/* Clé publique (anon) — protégée par RLS côté Supabase, conçue pour être
   exposée au navigateur. Ne donne accès qu'à la fonction get_booked_slots. */
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6ZGZwanl5dHdlZGhvY2h2emZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NzExMDEsImV4cCI6MjA5NTM0NzEwMX0.LKISYgm1CBPYP4VfvH_S6C7meSQb1H57LxkldF9UhC0'

export type BookedSlot = {
  date: string // YYYY-MM-DD
  start_time: string | null // HH:MM:SS
  end_time: string | null
  booking_type: string // 'sortie_privative' | 'nuit_prestige' | 'nuit_insolite' | 'blocked'
}

/* Variante qui dit si la lecture a RÉUSSI, en plus de ce qu'elle a lu.
   `fetchBookedSlots` renvoie [] aussi bien quand Supabase est injoignable que
   quand il n'y a aucune réservation — indistinguable, et c'est très bien pour
   le calendrier (dans le doute, on laisse essayer). Mais pour annoncer « ces
   dates sont libres », il faut savoir si l'on a vraiment regardé : un bateau
   sans aucune réservation est un cas normal, pas une panne. */
export async function fetchBookedSlotsResult(
  fromISO: string,
  toISO: string,
): Promise<{ ok: boolean; slots: BookedSlot[] }> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_booked_slots`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ p_from: fromISO, p_to: toISO }),
    })
    if (!res.ok) return { ok: false, slots: [] }
    return { ok: true, slots: (await res.json()) as BookedSlot[] }
  } catch {
    return { ok: false, slots: [] }
  }
}

export async function fetchBookedSlots(fromISO: string, toISO: string): Promise<BookedSlot[]> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_booked_slots`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ p_from: fromISO, p_to: toISO }),
    })
    if (!res.ok) return []
    return (await res.json()) as BookedSlot[]
  } catch {
    /* Site utilisable même si Supabase est injoignable : on retombe sur
       "tout est disponible" plutôt que de bloquer la réservation. */
    return []
  }
}

function toMinutes(t: string) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

const NIGHT_TYPES = new Set(['nuit_prestige', 'nuit_insolite'])
/* La nuit embarque à 18 h : une sortie qui finit après 17 h ce jour-là
   empiète sur le battement avant l'accueil des clients de la nuit. */
const NIGHT_CHECKIN_HOUR = 18

export function isNightBlocked(dateISO: string, slots: BookedSlot[]) {
  return slots.some((s) => {
    if (s.date !== dateISO) return false
    if (s.booking_type === 'blocked') return true
    if (NIGHT_TYPES.has(s.booking_type)) return true
    if (s.booking_type === 'sortie_privative' && s.end_time) {
      return toMinutes(s.end_time) > (NIGHT_CHECKIN_HOUR - SORTIE_WINDOW.bufferHours) * 60
    }
    return false
  })
}

export function isDateFullyBlocked(dateISO: string, slots: BookedSlot[]) {
  return slots.some((s) => s.date === dateISO && s.booking_type === 'blocked')
}

/* Heures de départ possibles pour une sortie de `durationHours`, entre 9 h
   et 21 h : on retire les heures qui chevaucheraient une sortie déjà
   réservée (± 1 h de battement) ou qui empiéteraient sur une nuit réservée
   ce jour-là (embarquement 18 h). */
export function getSortieStartHours(dateISO: string, durationHours: number, slots: BookedSlot[]) {
  const { openHour, closeHour, bufferHours } = SORTIE_WINDOW
  const daySlots = slots.filter((s) => s.date === dateISO)
  if (daySlots.some((s) => s.booking_type === 'blocked')) return []

  const nightThatDay = daySlots.some((s) => NIGHT_TYPES.has(s.booking_type))
  const hardClose = nightThatDay ? NIGHT_CHECKIN_HOUR - bufferHours : closeHour

  const hours: number[] = []
  for (let start = openHour; start + durationHours <= hardClose; start += 1) {
    const end = start + durationHours
    const conflict = daySlots.some((s) => {
      if (s.booking_type !== 'sortie_privative' || !s.start_time || !s.end_time) return false
      const busyStart = toMinutes(s.start_time) / 60 - bufferHours
      const busyEnd = toMinutes(s.end_time) / 60 + bufferHours
      return start < busyEnd && end > busyStart
    })
    if (!conflict) hours.push(start)
  }
  return hours
}

export function formatHour(h: number) {
  return `${String(h).padStart(2, '0')} h 00`
}
