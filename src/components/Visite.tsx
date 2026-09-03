import { useRef } from 'react'
import { useActProgress } from '../useActProgress'
import { srcSet } from '../pic'
import '../visite.css'

/* ---------------------------------------------------------------------------
   La visite — page « Nuit à bord ».

   Une visite virtuelle : dix plans en plein écran qui se remplacent au
   défilement, sans jamais quitter le bateau. L'ordre est celui d'une vraie
   nuit à bord — on descend, on visite, on sort au couchant, la table se
   dresse, le soir tombe, et le petit-déjeuner arrive. Chaque plan porte une
   légende courte qui nomme le lieu ou le moment et donne un fait vrai.

   Le rail de photos qui servait ici a disparu : le client veut chaque image en
   plein écran, et une vignette de 200 px dans un rail est l'inverse de ça.

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

/* La partition. Chaque plan reçoit sa part de la course ; le seuil de la
   cabine garde la plus grande d'un seul tenant (0,155 contre 0,125 pour le
   plus long des autres) parce que c'est le pic du parcours. */
const PLATES: Plate[] = [
  {
    src: '/images/descente-1-haut.webp',
    srcP: '/images/descente-1-haut-p.webp',
    alt: 'Le haut de l’escalier du yacht : les marches descendent vers le carré, et la porte de la cabine ouverte au fond.',
    room: 'L’escalier',
    note: 'Quatre marches, et le port disparaît derrière vous.',
    a: -1,
    b: 0.115,
    /* On commence en regardant ses pieds, sur les marches, puis le regard se
       relève vers la pièce. C'est ce que fait un corps qui descend un escalier
       de bateau, et c'est ce qui rend « quatre marches » vrai à l'écran. */
    s0: 1.09,
    s1: 1.4,
    y0: '5.5%',
    y1: '-3%',
    ca: 0.012,
    cb: 0.093,
  },
  {
    src: '/images/descente-2-carre.webp',
    srcP: '/images/descente-2-carre-p.webp',
    alt: 'Le carré du yacht : la banquette en cuir crème, la table ovale, et le couloir vers la cabine.',
    room: 'Le carré',
    note: 'Banquette en cuir, table ovale. On y dîne, on y traîne.',
    a: 0.115,
    b: 0.2,
    /* Le silence avant le pic : le cadre respire, il n'avance pas. Plus ample,
       il volerait au passage de la porte ce qui fait sa force — être le seul
       endroit où l'on avance vraiment. */
    s0: 1.06,
    s1: 1.12,
    ca: 0.133,
    cb: 0.178,
  },
  {
    src: '/images/descente-3-cuisine.webp',
    srcP: '/images/descente-3-cuisine-p.webp',
    alt: 'Le coin cuisine du yacht : plan de travail, évier inox et rangements en acajou.',
    room: 'Le coin cuisine',
    note: 'Évier, plan de travail et rangements. Le petit-déjeuner arrive sur plateau.',
    a: 0.2,
    b: 0.28,
    s0: 1.02,
    s1: 1.14,
    ca: 0.218,
    cb: 0.258,
  },
  {
    src: '/images/descente-4-couloir.webp',
    srcP: '/images/descente-4-couloir-p.webp',
    alt: 'Le couloir sous le pont, la porte de la cabine ouverte au fond sur le lit.',
    room: 'Le couloir',
    note: 'Penderie d’un côté, la cabine au fond.',
    a: 0.28,
    b: 0.355,
    s0: 1,
    s1: 1.18,
    ca: 0.298,
    cb: 0.333,
  },
  {
    src: '/images/descente-5-seuil.webp',
    srcP: '/images/descente-5-seuil-p.webp',
    alt: 'Le seuil de la cabine : l’encadrement en acajou verni s’ouvre sur le lit.',
    room: 'Le seuil',
    note: 'La porte se referme sur vous deux.',
    a: 0.355,
    /* Le pic : la plus grande course d'un seul plan de la page. Il tient bien
       après que sa légende se soit effacée — le passage dans la cabine ne doit
       croiser aucun texte. */
    b: 0.51,
    /* Le montant de porte passe de part et d'autre du regard et sort du cadre :
       à 1,78 il ne reste que du bois flou, ce qui est exactement ce qu'on voit
       en franchissant une porte. Et l'effacement est le plus court de la page —
       on ne s'attarde pas sur un seuil. */
    s0: 1.05,
    s1: 1.78,
    f: 0.013,
    ca: 0.373,
    cb: 0.488,
  },
  {
    src: '/images/descente-6-cabine.webp',
    srcP: '/images/descente-6-cabine-p.webp',
    alt: 'La cabine du yacht : le lit rond fait, les boiseries, le hublot.',
    room: 'La cabine',
    note: 'Lit double, hublots, rangements sous le lit.',
    a: 0.51,
    b: 0.61,
    s0: 1.16,
    s1: 1.04,
    ca: 0.528,
    cb: 0.588,
  },
  {
    src: '/images/soir-1-couchant.webp',
    srcP: '/images/sortie-coucher-soleil-poupe.jpg',
    alt: 'Le soleil se couche sur la mer, vu depuis le pont arrière du yacht.',
    room: 'La sortie au couchant',
    note: 'En Nuit Prestige : une sortie en mer au coucher du soleil.',
    a: 0.61,
    b: 0.705,
    s0: 1.04,
    s1: 1.14,
    ca: 0.628,
    cb: 0.683,
  },
  {
    src: '/images/soir-2-amour.webp',
    srcP: '/images/nuit-salon-amour.jpg',
    alt: 'Le salon du yacht, table ronde dressée en blanc sous les lettres « Amour ».',
    room: 'La table dressée',
    note: 'Tapas de notre partenaire Una Mas, en Nuit Prestige.',
    a: 0.705,
    b: 0.79,
    s0: 1.03,
    s1: 1.12,
    ca: 0.723,
    cb: 0.768,
  },
  {
    src: '/images/soir-3-bougies.webp',
    srcP: '/images/nuit-table-ambiance.jpg',
    alt: 'La table du salon au soir : nappe blanche, pétales, bougies allumées.',
    room: 'Le salon, le soir',
    note: 'Bougies et plaids à bord.',
    a: 0.79,
    b: 0.875,
    s0: 1.03,
    s1: 1.12,
    ca: 0.808,
    cb: 0.853,
  },
  {
    src: '/images/soir-4-dejeuner.webp',
    srcP: '/images/nuit-petit-dejeuner-plateau.jpg',
    alt: 'Le petit-déjeuner servi sur plateau : viennoiseries, pain, confitures, fruits et jus d’orange.',
    room: 'Le petit-déjeuner',
    note: 'Sur plateau, servi jusqu’à 10 h. Vous repartez à midi.',
    a: 0.875,
    b: 2,
    s0: 1.14,
    s1: 1,
    ca: 0.893,
    cb: 1.02,
  },
]

/* Le vrai nombre de marches de cet escalier. Un compteur qui compte du faux
   n'a aucune raison d'exister. */
const MARCHES = 4
/* Passé ce point on est en bas : le compteur n'a plus rien à dire. */
const AU_SOL = 0.105

/* L'opacité d'un plan, calculée exactement comme le fait le CSS. Sert à
   publier l'état visuel pour la vérification — pas au rendu, qui reste
   entièrement en CSS. */
function opacityOf(pl: Plate, p: number) {
  const f = pl.f ?? 0.022
  const inn = Math.min(1, Math.max(0, (p - pl.a + f) / f))
  const out = Math.min(1, Math.max(0, (pl.b + f - p) / f))
  return Math.min(inn, out)
}

export default function Visite() {
  const ref = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const stepRef = useRef<HTMLParagraphElement>(null)

  /* « On descend vraiment » — la signature. Le défilement ne fait pas défiler
     des photos, il fait descendre l'escalier, et les marches restantes le
     disent. Elles s'effacent une fois en bas : compter après l'arrivée
     transformerait un repère en décoration. */
  useActProgress(ref, (p) => {
    const el = stepRef.current
    if (el) {
      const reste = Math.max(1, Math.ceil((1 - p / AU_SOL) * MARCHES))
      el.firstElementChild!.textContent = String(reste)
      el.dataset.done = p >= AU_SOL ? 'true' : 'false'
    }

    /* L'état visuel, publié pour le harnais de vérification.

       Le mouvement de cette section ne passe par aucun device du moteur
       (ni pan, ni scrub) : ce sont des plans empilés qui se fondent et
       avancent en CSS. Sans cette publication, la vérification de « scroll
       mort » ne voit qu'une scène collée en haut de l'écran qui ne bouge
       jamais, et déclare morte la totalité de la visite. Le harnais prévoit
       exactement ce cas : une page dont le mouvement lui est étranger publie
       une représentation compacte de ce qu'on voit réellement. */
    const stage = stageRef.current
    if (!stage) return
    let top = 0
    for (let i = 0; i < PLATES.length; i++) {
      if (opacityOf(PLATES[i], p) > 0.002) { top = i; break }
    }
    const pl = PLATES[top]
    const local = Math.min(1, Math.max(0, (p - pl.a) / (pl.b + (pl.f ?? 0.022) - pl.a)))
    const scale = pl.s0 + (pl.s1 - pl.s0) * local
    const cap = PLATES.findIndex((q) => p >= q.ca - 0.014 && p <= q.cb + 0.014)
    stage.setAttribute(
      'data-sc-verify-state',
      `plan=${top + 1}/${PLATES.length} op=${opacityOf(pl, p).toFixed(2)} ` +
        `zoom=${scale.toFixed(3)} legende=${cap >= 0 ? cap + 1 : '-'}`,
    )
  })

  return (
    <section
      className="vis"
      ref={ref}
      data-sc-act="pin"
      data-sc-span="9.5"
      aria-label="Visite du bateau : les pièces, la soirée et le matin"
    >
      <div className="vis__stage" data-sc-stage ref={stageRef}>
        {PLATES.map((pl, i) => (
          <picture className="vis__pic" key={pl.src}>
            <source media="(max-width: 700px)" srcSet={srcSet(pl.srcP) ?? pl.srcP} sizes="100vw" />
            <img
              className="vis__plate"
              src={pl.src}
              srcSet={srcSet(pl.src)}
              sizes="100vw"
              decoding="async"
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

        <div className="vis__scrim" aria-hidden="true" />

        {/* Une légende par pièce : le nom, puis un fait. Petite, en bas à
            gauche, toujours du même côté — on sait où regarder sans chercher. */}
        {PLATES.map((pl, i) => (
          <div
            key={`c-${pl.src}`}
            className="vis__cap"
            style={
              {
                '--a': String(pl.ca),
                '--b': String(pl.cb),
                '--order': String(i * 2 + 2),
              } as React.CSSProperties
            }
          >
            <p className="vis__room">{pl.room}</p>
            <p className="vis__note">{pl.note}</p>
          </div>
        ))}

        <p className="vis__steps" ref={stepRef} data-done="false" aria-hidden="true">
          <span>{MARCHES}</span>
          <span className="vis__steps-label">marches</span>
        </p>
      </div>
    </section>
  )
}
