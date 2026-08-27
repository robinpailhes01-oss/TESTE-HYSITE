import { useRef } from 'react'
import { Link } from 'react-router'
import { motion } from 'motion/react'
import { useReveal } from '../motion'
import { useActProgress } from '../useActProgress'
import '../parcours.css'

/* ---------------------------------------------------------------------------
   L'accueil est un aiguillage, pas une vitrine.

     1. On voit le bateau, en entier, tout de suite.
     2. On voit immédiatement le choix : sorties en mer, ou nuits à bord.
     3. On clique, et on part sur la page de son choix — c'est là que
        l'immersion a lieu, et c'est là qu'on réserve.

   Rien d'autre au-dessus des avis : chaque section supplémentaire ici est une
   occasion de ne pas choisir.
--------------------------------------------------------------------------- */

/* --- 1. Le bateau ---------------------------------------------------------- */

function Ouverture() {
  const ref = useRef<HTMLElement>(null)
  useActProgress(ref)

  return (
    <section className="pc-open" ref={ref} data-sc-act="pin" data-sc-span="1.15" aria-label="Harmonie Yacht">
      <div className="pc-open__stage" data-sc-stage>
        <div className="pc-open__media">
          <img
            src="/images/hero-bateau.jpg"
            alt="Le yacht Harmonie vu de loin au soleil couchant, sur une mer calme"
            data-breathe
            fetchPriority="high"
          />
        </div>
        <div className="pc-open__veil" aria-hidden="true" />
        <div className="pc-open__copy" data-sc-cue="0 1 0 0">
          <p className="kicker">Harmonie Yacht · Carnon</p>
          <h1 className="mixed pc-open__title">
            Créateur de moments <span className="it">authentiques</span> sur l’eau
          </h1>
          <a href="#choix" className="btn btn--light">
            Choisir
          </a>
        </div>
      </div>
    </section>
  )
}

/* --- 2. Le choix ----------------------------------------------------------- */

const CHOIX = [
  {
    group: 'sortie',
    to: '/sortie-en-mer-carnon',
    src: '/images/sortie-amis-coucher-soleil.jpg',
    alt: 'Entre amis à la proue du yacht, face au soleil couchant',
    label: 'Le jour',
    name: 'Sorties en mer',
    facts: ['2 h à 8 h', 'jusqu’à 10 invités', 'dès 380 €'],
    cta: 'Voir la sortie en mer',
  },
  {
    group: 'nuit',
    to: '/nuit-a-bord-yacht-carnon',
    src: '/images/nuit-table-ambiance.jpg',
    alt: 'Ambiance à bord le soir, bougies et table dressée dans le salon',
    label: 'La nuit',
    name: 'Nuits insolites',
    facts: ['18 h → 12 h', 'à deux', 'dès 250 €'],
    cta: 'Voir la nuit à bord',
  },
]

function Choix() {
  const head = useReveal()
  const panels = useReveal(0.08)

  return (
    <section className="pc-choix" id="choix" data-sc-act="flow" aria-label="Sorties en mer, ou nuits à bord">
      <motion.h2 className="mixed pc-choix__q" {...head}>
        Le jour, <span className="it">ou la nuit</span> ?
      </motion.h2>
      <motion.div className="pc-choix__panels" {...panels}>
        {CHOIX.map((c) => (
          <Link className="pc-panel" to={c.to} key={c.group}>
            <img src={c.src} alt={c.alt} loading="lazy" />
            <span className="pc-panel__veil" aria-hidden="true" />
            <span className="pc-panel__body">
              <span className="pc-panel__label">{c.label}</span>
              <span className="mixed pc-panel__name">{c.name}</span>
              <span className="pc-panel__facts">
                {c.facts.map((f) => (
                  <span key={f}>{f}</span>
                ))}
              </span>
              <span className="pc-panel__cta">{c.cta}</span>
            </span>
          </Link>
        ))}
      </motion.div>
    </section>
  )
}

export default function Parcours() {
  return (
    <>
      <Ouverture />
      <Choix />
    </>
  )
}
