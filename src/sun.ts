/* ---------------------------------------------------------------------------
   Heure du coucher de soleil à Carnon.

   Calcul astronomique local (algorithme NOAA), pas d'appel réseau : toujours
   juste, jamais en panne, rien à payer, et ça marche hors ligne.

   Deux pièges évités :
     - le résultat est formaté sur le fuseau de CARNON, pas sur celui du
       visiteur : un client à Londres doit lire l'heure du couchant sur place,
       pas la sienne ;
     - le site est prérendu (SSG), donc ce calcul ne peut pas se faire au build
       (l'heure serait figée au jour de la compilation). Il tourne au montage,
       côté navigateur, sur la vraie date du visiteur.
--------------------------------------------------------------------------- */

/* Carnon-Plage, port de Carnon (Mauguio, Hérault). */
export const CARNON = { lat: 43.5456, lng: 3.9861, tz: 'Europe/Paris' }

const RAD = Math.PI / 180
const DAY_MS = 86400000
const J1970 = 2440588
const J2000 = 2451545
/* Angle du centre du soleil sous l'horizon au coucher « officiel » :
   -0,833° tient compte de la réfraction atmosphérique et du rayon apparent. */
const SUNSET_ANGLE = -0.833

const toJulian = (d: Date) => d.valueOf() / DAY_MS - 0.5 + J1970
const fromJulian = (j: number) => new Date((j + 0.5 - J1970) * DAY_MS)

function solarMeanAnomaly(d: number) {
  return RAD * (357.5291 + 0.98560028 * d)
}

function eclipticLongitude(M: number) {
  /* Équation du centre + longitude du périhélie terrestre. */
  const C = RAD * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M))
  const P = RAD * 102.9372
  return M + C + P + Math.PI
}

function declination(L: number) {
  const e = RAD * 23.4397 /* obliquité de l'écliptique */
  return Math.asin(Math.sin(e) * Math.sin(L))
}

/* Date/heure UTC du coucher de soleil pour un jour et un lieu donnés. */
export function sunsetAt(date: Date, lat = CARNON.lat, lng = CARNON.lng): Date | null {
  return sunEvent(date, 'set', lat, lng)
}

/* Le lever, par la même route : le midi solaire moins le demi-arc. */
export function sunriseAt(date: Date, lat = CARNON.lat, lng = CARNON.lng): Date | null {
  return sunEvent(date, 'rise', lat, lng)
}

/* Est-ce le jour à Carnon, à cet instant ? Entre le lever et le coucher
   du jour civil courant. Si le calcul échoue (impossible ici), on répond
   « jour » : c'est le côté qui vend le plus. */
export function isDayAt(now: Date): boolean {
  const rise = sunriseAt(now)
  const set = sunsetAt(now)
  if (!rise || !set) return true
  return now >= rise && now <= set
}

function sunEvent(date: Date, which: 'rise' | 'set', lat: number, lng: number): Date | null {
  const lw = RAD * -lng
  const phi = RAD * lat

  const d = toJulian(date) - J2000 + 0.0008
  const n = Math.round(d - 0.0009 - lw / (2 * Math.PI))
  const ds = 0.0009 + lw / (2 * Math.PI) + n

  const M = solarMeanAnomaly(ds)
  const L = eclipticLongitude(M)
  /* Midi solaire vrai : correction de l'équation du temps. */
  const Jnoon = J2000 + ds + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L)
  const dec = declination(L)

  const cosH =
    (Math.sin(RAD * SUNSET_ANGLE) - Math.sin(phi) * Math.sin(dec)) / (Math.cos(phi) * Math.cos(dec))
  /* Hors de [-1, 1] : soleil de minuit ou nuit polaire. Impossible à Carnon,
     mais la fonction reste honnête si on la réutilise ailleurs. */
  if (cosH > 1 || cosH < -1) return null

  const H = Math.acos(cosH)
  const J = which === 'set' ? Jnoon + H / (2 * Math.PI) : Jnoon - H / (2 * Math.PI)
  return fromJulian(J)
}

/* « 20 h 14 », à l'heure de Carnon quel que soit le fuseau du visiteur. */
export function formatCarnonTime(d: Date): string {
  const parts = new Intl.DateTimeFormat('fr-FR', {
    timeZone: CARNON.tz,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(d)
  const h = parts.find((p) => p.type === 'hour')?.value ?? ''
  const m = parts.find((p) => p.type === 'minute')?.value ?? ''
  return `${Number(h)} h ${m}`
}

/* L'heure de départ conseillée pour être au large pile au couchant :
   on arrondit au quart d'heure inférieur, `lead` heures avant. */
export function departureForSunset(sunset: Date, leadHours: number): string {
  const d = new Date(sunset.getTime() - leadHours * 3600_000)
  const parts = new Intl.DateTimeFormat('fr-FR', {
    timeZone: CARNON.tz,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(d)
  const h = Number(parts.find((p) => p.type === 'hour')?.value ?? '0')
  const m = Number(parts.find((p) => p.type === 'minute')?.value ?? '0')
  const q = Math.floor(m / 15) * 15
  return q === 0 ? `${h} h` : `${h} h ${String(q).padStart(2, '0')}`
}
