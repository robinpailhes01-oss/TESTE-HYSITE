import type Lenis from 'lenis'

/* ---------------------------------------------------------------------------
   L'instance de défilement inertiel, partagée.

   Un geste direct doit pouvoir suspendre le défilement inertiel le temps qu'il
   dure : sinon Lenis continue d'écrire sa propre cible à chaque image et se
   bat avec le doigt. On la range ici plutôt que de la passer par le contexte
   React — c'est un objet unique pour toute la page, pas un état.
--------------------------------------------------------------------------- */

let instance: Lenis | null = null

export function setLenis(l: Lenis | null) {
  instance = l
}

export function getLenis() {
  return instance
}
