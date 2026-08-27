/* ---------------------------------------------------------------------------
   « Le souffle » — la signature de la page d'accueil.

   Tout le reste du site est piloté par le défilement. Ceci fait l'inverse :
   après ~900 ms sans que le visiteur bouge, on pose la classe `is-still` sur
   <html>, et les photos marquées [data-breathe] entament une dilatation très
   lente (CSS, 9 s linéaires, imperceptible image par image). Au premier
   mouvement, tout revient en place en 1,2 s.

   Un hôtel de luxe récompense le fait de s'arrêter, pas celui d'aller vite.

   Un seul écouteur pour toute la page, quel que soit le nombre de composants
   qui appellent le hook (compteur de références).
--------------------------------------------------------------------------- */

import { useEffect } from 'react'

const STILL_CLASS = 'is-still'
const REST_DELAY = 900

/* Lenis émet bien un `scroll` natif, mais wheel/touchmove arrivent avant lui :
   on écoute les trois pour que la respiration se coupe dès le geste, sans
   attendre que l'inertie ait commencé. */
const EVENTS = ['scroll', 'wheel', 'touchmove', 'pointerdown', 'keydown'] as const

let refs = 0
let timer: ReturnType<typeof setTimeout> | undefined

function wake() {
  document.documentElement.classList.remove(STILL_CLASS)
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    document.documentElement.classList.add(STILL_CLASS)
  }, REST_DELAY)
}

export function useBreath() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    refs += 1
    if (refs === 1) {
      EVENTS.forEach((e) => addEventListener(e, wake, { passive: true }))
      wake() /* première respiration après le chargement, sans geste */
    }

    return () => {
      refs -= 1
      if (refs === 0) {
        EVENTS.forEach((e) => removeEventListener(e, wake))
        if (timer) clearTimeout(timer)
        document.documentElement.classList.remove(STILL_CLASS)
      }
    }
  }, [])
}
