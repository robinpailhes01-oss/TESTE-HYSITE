import manifest from './images.json'

/* ---------------------------------------------------------------------------
   Les images en plusieurs tailles.

   Mesuré avant : la photo de titre pesait 460 Ko en 2200 px, servie telle
   quelle à un téléphone de 390 px. `scripts/images.mjs` produit des variantes
   WebP à 480, 800, 1200 et 1600 px, et un manifeste des largeurs réelles.
   Ce module en fait un `srcset` : le navigateur choisit la taille qui couvre
   son écran, jamais plus.

   L'original reste dans la liste avec sa vraie largeur : pour une photo de
   960 px, les variantes s'arrêtent à 800, et sans l'original un écran large
   recevrait du 800 agrandi — pire que le fichier de départ.
--------------------------------------------------------------------------- */

type Entry = { w: number; v: number[] }
const M = manifest as Record<string, Entry>

/* Les tailles d'affichage, nommées par usage, pour ne pas les recopier. */
export const SIZES = {
  full: '100vw',
  column: '(max-width: 860px) 100vw, 42vw',
  half: '(max-width: 700px) 100vw, 50vw',
  third: '(max-width: 700px) 100vw, 33vw',
  rail: '(max-width: 700px) 62vw, 25vw',
} as const

export function srcSet(src: string): string | undefined {
  const e = M[src]
  if (!e) return undefined
  const base = src.replace(/\.(jpe?g|webp|png)$/i, '')
  const parts = e.v.map((w) => `${base}-${w}.webp ${w}w`)
  parts.push(`${src} ${e.w}w`)
  return parts.join(', ')
}

/* Les attributs à étaler sur un <img> : src, srcSet, sizes, decoding. */
export function pic(src: string, sizes: string = SIZES.full) {
  return { src, srcSet: srcSet(src), sizes, decoding: 'async' as const }
}
