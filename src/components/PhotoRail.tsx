import { useRef } from 'react'
import { useActProgress } from '../useActProgress'
import { useDragRail } from '../useDragRail'
import '../rail.css'

/* ---------------------------------------------------------------------------
   Rail immersif : le plan tient, et le défilement vertical fait avancer les
   photos latéralement. Sert à montrer tout ce à quoi le client a accès, sans
   une ligne de prose — une photo, un nom, un fait.

   Le rail parcourt exactement son débordement : 0 à p = 0, (écran - rail) à
   p = 1. Le pourcentage d'un translateX se résout sur la largeur de l'élément
   lui-même, ce qui donne le débordement sans aucune mesure en JS.
--------------------------------------------------------------------------- */

export type RailItem = { src: string; alt: string; label: string; note: string }

type Props = {
  kicker: string
  titlePlain: string
  titleIt: string
  items: RailItem[]
  closing?: string
  /* Hauteur de la course, en hauteurs d'écran. Environ 0,6 par photo plus une. */
  span?: number
  tone?: 'ocean' | 'deep'
}

export default function PhotoRail({
  kicker,
  titlePlain,
  titleIt,
  items,
  closing,
  span,
  tone = 'ocean',
}: Props) {
  const ref = useRef<HTMLElement>(null)
  const countRef = useRef<HTMLParagraphElement>(null)

  /* « Le compte y est » — la signature de cette version.

     Le client veut qu'on montre TOUT ce à quoi le visiteur a accès. Un rail de
     photos le montre ; il ne le fait pas sentir. Le compteur avance avec le
     défilement et s'arrête sur le total : on ne voit pas seulement les
     prestations passer, on constate qu'on les a toutes vues. C'est la seule
     chose de la page qui compte quelque chose, et elle ne compte que du réel :
     le nombre d'éléments effectivement présents dans le rail. */
  useActProgress(ref, (p) => {
    const el = countRef.current
    if (!el) return
    const n = Math.max(1, Math.min(items.length, Math.ceil(p * items.length || 1)))
    el.firstElementChild!.textContent = String(n)
    el.dataset.complete = n === items.length ? 'true' : 'false'
  })

  /* Le rail se saisit aussi à la main. Le geste ne déplace pas le rail : il
     déplace le défilement de la page, dont le rail découle déjà. Une seule
     source de vérité, donc rien à resynchroniser au relâchement. */
  useDragRail(ref)

  const height = span ?? Math.min(5.2, 1 + items.length * 0.55)

  return (
    <section
      className={`rail rail--${tone}`}
      ref={ref}
      /* Via une variable, pas une hauteur en dur : le mode « animations
         réduites » doit pouvoir replier la section, et il ne peut pas
         surcharger un style en ligne sans !important. */
      style={{ ['--rail-h' as string]: String(height) }}
      data-sc-act="pan"
      data-sc-span={height}
      aria-label={`${titlePlain} ${titleIt}`}
    >
      <div className="rail__stage" data-sc-stage>
        <div className="rail__track" data-sc-pan="0.04">
          <div className="rail__lead">
            <p className="kicker">{kicker}</p>
            <h2 className="mixed">
              {titlePlain} <span className="it">{titleIt}</span>
            </h2>
          </div>

          {items.map((it) => (
            <figure key={it.src + it.label}>
              <img src={it.src} alt={it.alt} loading="lazy" draggable={false} />
              <figcaption>
                <strong>{it.label}</strong>
                <span>{it.note}</span>
              </figcaption>
            </figure>
          ))}

          {closing ? <p className="rail__end">{closing}</p> : null}
        </div>

        <p className="rail__count" ref={countRef} data-complete="false" aria-hidden="true">
          <span>1</span>
          <span className="rail__count-sep">/</span>
          <span>{items.length}</span>
          <span className="rail__count-label">à bord</span>
        </p>
      </div>
    </section>
  )
}
