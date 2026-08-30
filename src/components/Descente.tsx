import { useRef } from 'react'
import { useActProgress } from '../useActProgress'
import '../descente.css'

/* ---------------------------------------------------------------------------
   La descente — page « Nuit à bord ».

   Un seul trajet, sans coupure : du haut des marches jusqu'à la cabine. Cinq
   plans réels du bateau, nettoyés et relevés en lumière de fin de journée, que
   le défilement traverse en travelling avant. Ce n'est pas un diaporama : à
   aucun moment on ne quitte le bateau, et chaque plan reprend là où le
   précédent s'arrête.

   Aucune vidéo, et c'est un choix mesuré, pas une économie. Le device évident
   pour une descente serait un clip scrubbé ; ce site se consulte surtout au
   téléphone, et une version antérieure de ce projet a passé quatre tours de
   vérification au vert pendant que le clip restait figé sur l'appareil réel.
   Une image fixe déplacée en CSS n'a ni décodeur à satisfaire, ni politique
   d'autoplay, ni mode économie d'énergie.

   Tout le rendu est en CSS, piloté par --sc-p publié au défilement. Le JS ne
   sert qu'au compteur de marches, qui compte quelque chose de réel.
--------------------------------------------------------------------------- */

/* Les fenêtres de chaque plan, en fraction de la course. Elles suivent la
   partition du brief : l'acte du seuil (le pic) reçoit la plus grande part,
   et l'acte qui le précède est le plus court — le silence avant. */
type Plate = {
  src: string
  /* Variante portrait. Un plan 16:9 dans un écran de téléphone plein cadre ne
     laisse voir que 26 % de sa largeur — mesuré : les deux premières vues n'y
     montraient plus que de la moquette. Chaque plan a donc son cadrage vertical,
     recomposé depuis le plan large pour que ce soit exactement la même scène. */
  srcP: string
  alt: string
  a: number // début de sa fenêtre
  b: number // fin de sa fenêtre
  s0: number // échelle au début
  s1: number // échelle à la fin, atteinte APRÈS l'effacement
  f?: number // durée de son propre effacement
  y0?: string // hauteur de regard au début (le cadre glisse dans l'image)
  y1?: string
}

const PLATES: Plate[] = [
  {
    src: '/images/descente-1-haut.webp',
    srcP: '/images/descente-1-haut-p.webp',
    alt: 'Le haut de l’escalier du yacht : les marches descendent vers le carré, et la porte de la cabine ouverte au fond.',
    a: -1,
    b: 0.357,
    /* On commence en regardant ses pieds, sur les marches, puis le regard se
       relève vers la pièce. C'est ce que fait un corps qui descend un escalier
       de bateau, et c'est ce qui rend « quatre marches » vrai à l'écran. */
    s0: 1.09,
    s1: 1.44,
    y0: '5.5%',
    y1: '-3%',
  },
  {
    src: '/images/descente-2-carre.webp',
    srcP: '/images/descente-2-carre-p.webp',
    alt: 'Le carré du yacht : la banquette en cuir crème, la table ovale, et le couloir vers la cabine.',
    a: 0.357,
    b: 0.5,
    /* Le silence avant le pic : le cadre respire, il n'avance pas. À 1,22 il
       progressait de 15 % et volait au passage de la porte ce qui fait sa
       force — être le seul endroit où l'on avance vraiment. */
    s0: 1.06,
    s1: 1.12,
  },
  {
    src: '/images/descente-3-couloir.webp',
    srcP: '/images/descente-3-couloir-p.webp',
    alt: 'Le couloir sous le pont, la porte de la cabine ouverte au fond sur le lit.',
    a: 0.5,
    b: 0.66,
    s0: 1,
    s1: 1.26,
  },
  {
    src: '/images/descente-4-seuil.webp',
    srcP: '/images/descente-4-seuil-p.webp',
    alt: 'Le seuil de la cabine : l’encadrement en acajou verni s’ouvre sur le lit.',
    a: 0.66,
    /* Le seuil tient jusqu'à 0,86, bien après que la phrase du pic se soit
       effacée : le passage dans la cabine ne doit croiser aucun texte. */
    b: 0.86,
    /* Le montant de porte passe de part et d'autre du regard et sort du cadre :
       à 1,78 il ne reste que du bois flou, ce qui est exactement ce qu'on voit
       en franchissant une porte. Et l'effacement est le plus court de la page —
       on ne s'attarde pas sur un seuil. */
    s0: 1.05,
    s1: 1.78,
    f: 0.013,
  },
  {
    src: '/images/descente-5-cabine.webp',
    srcP: '/images/descente-5-cabine-p.webp',
    alt: 'La cabine du yacht : le lit rond fait, les boiseries, le hublot.',
    a: 0.86,
    b: 2,
    s0: 1.16,
    s1: 1,
  },
]

/* Quatre lignes sur sept écrans. Le client demande moins d'écriture et plus de
   défilement ; l'image porte, le texte ponctue. */
const CUES: { text: string; a: number; b: number }[] = [
  { text: 'Quatre marches.', a: 0.02, b: 0.15 },
  { text: 'Vous y dînez, vous y traînez.', a: 0.37, b: 0.49 },
  { text: 'Et puis, la porte.', a: 0.67, b: 0.79 },
  { text: 'Votre cabine.', a: 0.915, b: 1.02 },
]

/* Le vrai nombre de marches de cet escalier. Un compteur qui compte du faux
   n'a aucune raison d'exister. */
const MARCHES = 4
/* Sans mouvement, la section se lit comme un reportage : chaque ligne se range
   après le plan qu'elle commente. */
const PLATE_ORDER = [1, 3, 5, 6, 8]
const CUE_ORDER = [2, 4, 7, 9]
/* Passé ce point on est en bas : le compteur n'a plus rien à dire. */
const AU_SOL = 0.34

export default function Descente() {
  const ref = useRef<HTMLElement>(null)
  const stepRef = useRef<HTMLParagraphElement>(null)

  /* « On descend vraiment » — la signature. Le défilement ne fait pas défiler
     des photos, il fait descendre l'escalier, et les marches restantes le
     disent. Elles s'effacent une fois en bas : compter après l'arrivée
     transformerait un repère en décoration. */
  useActProgress(ref, (p) => {
    const el = stepRef.current
    if (!el) return
    const reste = Math.max(1, Math.ceil((1 - p / AU_SOL) * MARCHES))
    el.firstElementChild!.textContent = String(reste)
    el.dataset.done = p >= AU_SOL ? 'true' : 'false'
  })

  return (
    <section
      className="desc"
      ref={ref}
      data-sc-act="pin"
      data-sc-span="7"
      aria-label="Descente à bord, du haut de l’escalier jusqu’à la cabine"
    >
      <div className="desc__stage">
        {PLATES.map((pl, i) => (
          <picture className="desc__pic" key={pl.src}>
            <source media="(max-width: 700px)" srcSet={pl.srcP} />
            <img
              className="desc__plate"
              src={pl.src}
              alt={pl.alt}
              draggable={false}
              loading={i === 0 ? 'eager' : 'lazy'}
              fetchPriority={i === 0 ? 'high' : undefined}
              style={
                {
                  '--z': String(PLATES.length - i),
                  /* Ordre de lecture sans mouvement, posé explicitement : avec
                     un <picture> autour, nth-of-type ne distingue plus les
                     plans les uns des autres. */
                  '--order': String(PLATE_ORDER[i]),
                  '--a': String(pl.a),
                  '--b': String(pl.b),
                  '--s0': String(pl.s0),
                  '--s1': String(pl.s1),
                  ...(pl.f ? { '--f': String(pl.f) } : {}),
                  ...(pl.y0 ? { '--y0': pl.y0 } : {}),
                  ...(pl.y1 ? { '--y1': pl.y1 } : {}),
                } as React.CSSProperties
              }
            />
          </picture>
        ))}

        <div className="desc__scrim" aria-hidden="true" />

        {CUES.map((c, i) => (
          <p
            key={c.text}
            className="desc__cue"
            style={
              {
                '--a': String(c.a),
                '--b': String(c.b),
                '--order': String(CUE_ORDER[i]),
              } as React.CSSProperties
            }
          >
            {c.text}
          </p>
        ))}

        <p className="desc__steps" ref={stepRef} data-done="false" aria-hidden="true">
          <span>{MARCHES}</span>
          <span className="desc__steps-label">marches</span>
        </p>
      </div>
    </section>
  )
}
