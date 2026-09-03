import { useEffect } from 'react'

/* ---------------------------------------------------------------------------
   L'aimant des boutons.

   Sur un pointeur fin, un bouton se laisse attirer de quelques pixels vers le
   curseur qui l'approche, et revient par un ressort quand il s'éloigne. Trois
   règles pour que ce soit un détail et pas un gadget :
     · l'amplitude est petite (4 px au plus) — on le sent, on ne le voit pas ;
     · seul le pointeur fin l'a (pas de souris, pas d'aimant) ;
     · le mouvement réduit le désactive entièrement.

   Un seul écouteur délégué pour tout le site : aucun bouton n'a besoin d'être
   un composant pour l'avoir.
--------------------------------------------------------------------------- */

const REACH = 4 // px d'attraction maximale
const SEL = '.btn, .wa-fab'

export function useMagnet() {
  useEffect(() => {
    if (!matchMedia('(pointer: fine)').matches) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let active: HTMLElement | null = null

    const onMove = (e: PointerEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>(SEL)
      if (el !== active) {
        if (active) release(active)
        active = el
        if (el) el.style.transition = 'transform 120ms cubic-bezier(0.16, 1, 0.3, 1)'
      }
      if (!el) return
      const r = el.getBoundingClientRect()
      const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2)
      const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2)
      el.style.setProperty('--mx', `${(dx * REACH).toFixed(1)}px`)
      el.style.setProperty('--my', `${(dy * REACH).toFixed(1)}px`)
    }

    /* Le retour est plus lent que l'attraction : l'objet cède vite, revient
       doucement — même règle que l'appui. */
    const release = (el: HTMLElement) => {
      el.style.transition = 'transform 420ms cubic-bezier(0.2, 0.9, 0.3, 1.15)'
      el.style.setProperty('--mx', '0px')
      el.style.setProperty('--my', '0px')
    }

    const onLeave = () => {
      if (active) release(active)
      active = null
    }

    document.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    return () => {
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      if (active) release(active)
    }
  }, [])
}
