import { useRef } from 'react'
import { useActProgress } from '../useActProgress'
import '../descente.css'

/* ---------------------------------------------------------------------------
   La visite — page « Nuit à bord ».

   Un seul trajet, sans coupure : du haut des marches jusqu'à la cabine. Six
   plans réels du bateau, nettoyés et relevés en lumière de fin de journée, que
   le défilement traverse en travelling avant. Chaque pièce arrive en plein
   écran, avec une légende courte qui la nomme et donne un fait vrai — pas une
   phrase d'ambiance. Le client veut qu'on montre les pièces ; la petite
   écriture les présente sans jamais couvrir l'image.

   Aucune vidéo, et c'est un choix mesuré, pas une économie. Le device évident
   pour une descente serait un clip scrubbé ; ce site se consulte surtout au
   téléphone, et une version antérieure de ce projet a passé quatre tours de
   vérification au vert pendant que le clip restait figé sur l'appareil réel.
   Une image fixe déplacée en CSS n'a ni décodeur à satisfaire, ni politique
   d'autoplay, ni mode économie d'énergie.

   Tout le rendu est en CSS, piloté par --sc-p publié au défilement. Le JS ne
   sert qu'au compteur de marches, qui compte quelque chose de réel.
--------------------------------------------------------------------------- */

type Plate = {
  src: string
  /* Variante portrait. Un plan 16:9 dans un écran de téléphone plein cadre ne
     laisse voir que 26 % de sa largeur — mesuré : les premières vues n'y
     montraient plus que de la moquette. Chaque plan a donc son cadrage
     vertical, recomposé depuis le plan large pour que ce soit la même scène. */
  srcP: string
  alt: string
  /* La légende de la pièce : son nom, puis un fait. Tous les faits viennent des
     données réelles de la formule (src/experiences.ts) ou de ce qui est visible
     sur la photo. Rien n'est inventé pour faire joli. */
  room: string
  note: string
  a: number // début de sa fenêtre
  b: number // fin de sa fenêtre
  s0: number // échelle au début
  s1: number // échelle à la fin, atteinte APRÈS l'effacement
  f?: number // durée de son propre effacement
  y0?: string // hauteur de regard au début (le cadre glisse dans l'image)
  y1?: string
  /* Fenêtre de la légende, resserrée dans celle du plan : aucun texte ne doit
     traverser un fondu. */
  ca: number
  cb: number
}

const PLATES: Plate[] = [
  {
    src: '/images/descente-1-haut.webp',
    srcP: '/images/descente-1-haut-p.webp',
    alt: 'Le haut de l’escalier du yacht : les marches descendent vers le carré, et la porte de la cabine ouverte au fond.',
    room: 'L’escalier',
    note: 'Quatre marches, et le port disparaît derrière vous.',
    a: -1,
    b: 0.26,
    /* On commence en regardant ses pieds, sur les marches, puis le regard se
       relève vers la pièce. C'est ce que fait un corps qui descend un escalier
       de bateau, et c'est ce qui rend « quatre marches » vrai à l'écran. */
    s0: 1.09,
    s1: 1.4,
    y0: '5.5%',
    y1: '-3%',
    ca: 0.02,
    cb: 0.22,
  },
  {
    src: '/images/descente-2-carre.webp',
    srcP: '/images/descente-2-carre-p.webp',
    alt: 'Le carré du yacht : la banquette en cuir crème, la table ovale, et le couloir vers la cabine.',
    room: 'Le carré',
    note: 'Banquette en cuir, table ovale. On y dîne, on y traîne.',
    a: 0.26,
    b: 0.41,
    /* Le silence avant le pic : le cadre respire, il n'avance pas. Plus ample,
       il volerait au passage de la porte ce qui fait sa force — être le seul
       endroit où l'on avance vraiment. */
    s0: 1.06,
    s1: 1.12,
    ca: 0.285,
    cb: 0.385,
  },
  {
    src: '/images/descente-3-cuisine.webp',
    srcP: '/images/descente-3-cuisine-p.webp',
    alt: 'Le coin cuisine du yacht : plan de travail, évier inox et rangements en acajou.',
    room: 'Le coin cuisine',
    note: 'Évier, plan de travail et rangements. Le petit-déjeuner arrive sur plateau.',
    a: 0.41,
    b: 0.53,
    s0: 1.02,
    s1: 1.14,
    ca: 0.435,
    cb: 0.51,
  },
  {
    src: '/images/descente-4-couloir.webp',
    srcP: '/images/descente-4-couloir-p.webp',
    alt: 'Le couloir sous le pont, la porte de la cabine ouverte au fond sur le lit.',
    room: 'Le couloir',
    note: 'Penderie d’un côté, la cabine au fond.',
    a: 0.53,
    b: 0.64,
    s0: 1,
    s1: 1.18,
    ca: 0.555,
    cb: 0.62,
  },
  {
    src: '/images/descente-5-seuil.webp',
    srcP: '/images/descente-5-seuil-p.webp',
    alt: 'Le seuil de la cabine : l’encadrement en acajou verni s’ouvre sur le lit.',
    room: 'Le seuil',
    note: 'La porte se referme sur vous deux.',
    a: 0.64,
    /* Le pic : la plus grande course d'un seul plan de la page. Il tient bien
       après que sa légende se soit effacée — le passage dans la cabine ne doit
       croiser aucun texte. */
    b: 0.88,
    /* Le montant de porte passe de part et d'autre du regard et sort du cadre :
       à 1,78 il ne reste que du bois flou, ce qui est exactement ce qu'on voit
       en franchissant une porte. Et l'effacement est le plus court de la page —
       on ne s'attarde pas sur un seuil. */
    s0: 1.05,
    s1: 1.78,
    f: 0.013,
    ca: 0.665,
    cb: 0.855,
  },
  {
    src: '/images/descente-6-cabine.webp',
    srcP: '/images/descente-6-cabine-p.webp',
    alt: 'La cabine du yacht : le lit rond fait, les boiseries, le hublot.',
    room: 'La cabine',
    note: 'Lit double, hublots, rangements sous le lit. Jusqu’à 12 h le lendemain.',
    a: 0.88,
    b: 2,
    s0: 1.16,
    s1: 1,
    ca: 0.905,
    cb: 1.02,
  },
]

/* Le vrai nombre de marches de cet escalier. Un compteur qui compte du faux
   n'a aucune raison d'exister. */
const MARCHES = 4
/* Passé ce point on est en bas : le compteur n'a plus rien à dire. */
const AU_SOL = 0.25

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
      aria-label="Visite du bateau, du haut de l’escalier jusqu’à la cabine"
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
                  '--order': String(i * 2 + 1),
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

        {/* Une légende par pièce : le nom, puis un fait. Petite, en bas à
            gauche, toujours du même côté — on sait où regarder sans chercher. */}
        {PLATES.map((pl, i) => (
          <div
            key={`c-${pl.src}`}
            className="desc__cap"
            style={
              {
                '--a': String(pl.ca),
                '--b': String(pl.cb),
                '--order': String(i * 2 + 2),
              } as React.CSSProperties
            }
          >
            <p className="desc__room">{pl.room}</p>
            <p className="desc__note">{pl.note}</p>
          </div>
        ))}

        <p className="desc__steps" ref={stepRef} data-done="false" aria-hidden="true">
          <span>{MARCHES}</span>
          <span className="desc__steps-label">marches</span>
        </p>
      </div>
    </section>
  )
}
