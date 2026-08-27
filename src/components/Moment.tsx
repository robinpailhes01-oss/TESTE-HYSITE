import { useEffect, useRef } from 'react'

/* ---------------------------------------------------------------------------
   « Le moment » — le seul plan tenu de toute la page.

   Remplace l'ancienne bande citation (qui portait la dernière photo stock du
   site). Le cadre s'immobilise pendant 2,6 hauteurs d'écran, la photo se pose
   lentement (1.08 -> 1), et deux phrases se relaient. C'est le pic de la page :
   nulle part ailleurs le défilement ne s'arrête.

   Tout le rendu est en CSS, piloté par une seule variable : --sc-p, la
   progression de la course épinglée (0 -> 1), publiée ici à chaque image. Rien
   n'est animé en JS. C'est le motif du moteur scrollcraft, sans en charger le
   moteur : le site a déjà motion/react et Lenis, un troisième système de
   défilement serait précisément le poids que cette version évite.

   Les attributs data-sc-* sont des marqueurs de vérification : le harnais de
   captures les lit pour échantillonner l'acte, mesurer le contraste réel sous
   chaque ligne et détecter un défilement mort.
--------------------------------------------------------------------------- */

const SRC = '/images/sortie-coucher-soleil-poupe.jpg'

/* La première ligne accueille : pleine opacité dès p = 0, et elle y reste. Le
   cadre est visible une hauteur d'écran avant que la course commence, une ligne
   montant depuis zéro laisserait cet écran-là muet. La seconde se pose dessous
   à mi-course et complète la phrase. */
const L2_IN = [0.42, 0.58]

export default function Moment() {
  const ref = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    const stage = stageRef.current
    if (!el || !stage) return

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

      /* État RENDU (les valeurs qui peignent, pas la progression brute) pour le
         détecteur de défilement mort du harnais. */
      const o2 = clamp01((p - L2_IN[0]) / (L2_IN[1] - L2_IN[0]))
      stage.setAttribute(
        'data-sc-verify-state',
        `${o2.toFixed(2)}|${(1.08 - 0.08 * p).toFixed(3)}`,
      )
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
  }, [])

  return (
    <section className="moment" ref={ref} data-sc-act="pin" data-sc-span="2.6" aria-label="Le moment">
      <div className="moment__stage" ref={stageRef} data-sc-stage data-sc-verify-state="0.00|1.080">
        <div className="moment__media">
          <img
            src={SRC}
            alt="Le soleil se couche sur Carnon, vu depuis le pont du yacht Harmonie"
            loading="lazy"
            data-breathe
          />
        </div>

        <div className="moment__scrim" aria-hidden="true" />

        <div className="moment__copy">
          <p className="moment__l1" data-sc-cue="0 1 0 0">
            Venir pour une nuit.
          </p>
          <p className="moment__l2" data-sc-cue="0.44">
            Repartir avec le sentiment d’avoir voyagé très loin, sans avoir quitté le port.
          </p>
        </div>

        {/* La légende du souffle : elle n'arrive que si le visiteur s'arrête. */}
        <p className="moment__detail">Vue du pont, face à Carnon</p>
      </div>
    </section>
  )
}

function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v
}
