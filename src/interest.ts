import { useEffect, type RefObject } from 'react'

/* ---------------------------------------------------------------------------
   « La formule vous suit » — la signature de cette version.

   Le site mesure combien de temps le visiteur a réellement passé devant
   l'étape « le jour » et devant l'étape « la nuit ». À l'approche du
   formulaire, la formule gagnante y est déjà cochée.

   La consigne était « en fonction du parcours clients » : un tunnel qui
   observe le parcours et s'y adapte, c'est littéralement ça. Et c'est de
   l'écriture en moins — plus besoin de demander « laquelle vous intéresse ? ».

   Trois garde-fous, parce qu'une pré-sélection qui se trompe est pire que pas
   de pré-sélection du tout :
     1. il faut un écart net entre les deux (sinon on ne touche à rien) ;
     2. on ne le fait qu'une fois par visite ;
     3. on ne le fait jamais si le visiteur a déjà touché au formulaire — un
        choix délibéré ne se fait pas écraser par une mesure.

   Réutilise l'évènement `preselect-group` que BookingForm écoute déjà.
--------------------------------------------------------------------------- */

type Group = 'sortie' | 'nuit'

const seen: Record<Group, number> = { sortie: 0, nuit: 0 }
/* Écart minimal pour trancher. En dessous, le visiteur n'a pas vraiment
   choisi et on laisse la valeur par défaut du formulaire. */
const MIN_LEAD_MS = 1200
let handedOff = false
let formTouched = false

/* Compte le temps où la section est vraiment regardée, onglet au premier plan.

   Le seuil se mesure sur le CENTRE DE L'ÉCRAN, pas sur une fraction de la
   section : une étape fait trois hauteurs d'écran, et « 50 % de la section
   visible » est alors impossible à satisfaire — la mesure ne partait jamais.
   En réduisant la zone d'observation à la ligne médiane de l'écran
   (rootMargin -50 % en haut et en bas), on intersecte exactement quand le
   visiteur regarde cette étape. */
export function useInterest(ref: RefObject<HTMLElement | null>, group: Group) {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    let since = 0

    const flush = () => {
      if (since) {
        seen[group] += Date.now() - since
        since = 0
      }
    }

    const atCentre = () => {
      const r = el.getBoundingClientRect()
      return r.top <= innerHeight / 2 && r.bottom >= innerHeight / 2
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !document.hidden) since = since || Date.now()
        else flush()
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    )
    obs.observe(el)

    const onVisibility = () => {
      if (document.hidden) flush()
      else if (atCentre()) since = Date.now()
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      flush()
      obs.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [ref, group])
}

/* Pose la formule au moment où le visiteur arrive sur la réservation. */
export function useInterestHandoff() {
  useEffect(() => {
    const form = document.getElementById('reservation')
    if (!form) return

    /* Un choix délibéré prime toujours sur la mesure. */
    const onTouch = () => {
      formTouched = true
    }
    form.addEventListener('pointerdown', onTouch)
    form.addEventListener('keydown', onTouch)

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || handedOff || formTouched) return
        const lead = seen.sortie - seen.nuit
        if (Math.abs(lead) < MIN_LEAD_MS) return
        handedOff = true
        dispatchEvent(
          new CustomEvent('preselect-group', { detail: lead > 0 ? 'sortie' : 'nuit' }),
        )
      },
      /* Déclenché une hauteur d'écran avant, pour que l'onglet soit déjà le bon
         quand le formulaire entre dans le champ de vision. */
      { rootMargin: '100% 0px 0px 0px' },
    )
    obs.observe(form)

    return () => {
      obs.disconnect()
      form.removeEventListener('pointerdown', onTouch)
      form.removeEventListener('keydown', onTouch)
    }
  }, [])
}
