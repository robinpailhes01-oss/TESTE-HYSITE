import { useEffect, type RefObject } from 'react'

/* ---------------------------------------------------------------------------
   Publie sur la section la progression de sa course épinglée, sous forme de
   variable CSS --sc-p (0 -> 1). Tout le rendu des étapes du parcours en
   découle en CSS : rien n'est animé en JS.

   Le site a déjà motion/react et Lenis ; ajouter un troisième système
   d'animation serait le poids que ces versions cherchent justement à éviter.

   `onProgress` sert aux mesures qui ne sont pas du rendu (le temps passé sur
   une étape, pour la pré-sélection de la formule).
--------------------------------------------------------------------------- */

export function useActProgress(
  ref: RefObject<HTMLElement | null>,
  onProgress?: (p: number) => void,
) {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    let raf = 0
    let queued = false

    const read = () => {
      queued = false
      const r = el.getBoundingClientRect()
      /* Course épinglée : 0 quand le haut de la section atteint le haut de
         l'écran, 1 quand son bas atteint le bas de l'écran. */
      const travel = r.height - innerHeight
      const p = travel > 0 ? Math.min(1, Math.max(0, -r.top / travel)) : 0
      el.style.setProperty('--sc-p', p.toFixed(4))
      onProgress?.(p)
    }

    const onScroll = () => {
      if (queued) return
      queued = true
      raf = requestAnimationFrame(read)
    }

    read()
    addEventListener('scroll', onScroll, { passive: true })
    addEventListener('resize', onScroll, { passive: true })
    return () => {
      removeEventListener('scroll', onScroll)
      removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [ref, onProgress])
}
