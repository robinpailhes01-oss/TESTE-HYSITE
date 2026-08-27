import { useRef } from 'react'
import { Link } from 'react-router'
import { motion } from 'motion/react'
import { staggerContainer, staggerItem, useReveal } from '../motion'
import { useActProgress } from '../useActProgress'
import { useInterest, useInterestHandoff } from '../interest'
import '../parcours.css'

/* ---------------------------------------------------------------------------
   Le parcours — la page d'accueil suit l'ordre des questions que le visiteur
   se pose, une étape par question, trois éléments de texte au maximum chacune.

   1. C'est quoi ?            -> Ouverture (plan épinglé)
   2. Je peux faire quoi ?    -> Le choix : le jour, ou la nuit
   3. Une journée, ça donne ? -> Le jour (rail latéral)
   4. Et une nuit ?           -> La nuit (le pic)
   5. C'est pour mon occasion ? -> Les occasions
   Les avis et le formulaire suivent (composants existants).

   Le détail (déroulé heure par heure, spécifications, grille tarifaire) reste
   sur les pages dédiées : il n'a pas sa place dans une page de décision.

   Tout le rendu est piloté par --sc-p (cf. useActProgress) en CSS. Les
   attributs data-sc-* sont les marqueurs lus par le harnais de vérification.
--------------------------------------------------------------------------- */

/* --- 1. Ouverture ---------------------------------------------------------- */

function Ouverture() {
  const ref = useRef<HTMLElement>(null)
  useActProgress(ref)

  return (
    <section className="pc-open" ref={ref} data-sc-act="pin" data-sc-span="1.4" aria-label="Harmonie Yacht">
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
            Découvrir
          </a>
        </div>
      </div>
    </section>
  )
}

/* --- 2. Le choix ----------------------------------------------------------- */

const CHOIX = [
  {
    group: 'sortie' as const,
    to: '/sortie-en-mer-carnon',
    src: '/images/sortie-amis-coucher-soleil.jpg',
    alt: 'Entre amis à la proue du yacht, face au soleil couchant',
    label: 'Le jour',
    name: 'Sorties en mer',
    facts: ['2 h à 8 h', 'jusqu’à 10 invités', 'dès 380 €'],
  },
  {
    group: 'nuit' as const,
    to: '/nuit-a-bord-yacht-carnon',
    src: '/images/nuit-table-ambiance.jpg',
    alt: 'Ambiance à bord le soir, bougies et table dressée dans le salon',
    label: 'La nuit',
    name: 'Nuits à bord',
    facts: ['18 h → 12 h', 'à deux', 'dès 250 €'],
  },
]

function Choix() {
  const head = useReveal()
  const panels = useReveal(0.08)

  return (
    <section className="pc-choix" id="choix" data-sc-act="flow" aria-label="Le jour, ou la nuit">
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
            </span>
          </Link>
        ))}
      </motion.div>
    </section>
  )
}

/* --- 3. Le jour ------------------------------------------------------------ */

const JOUR = [
  { src: '/images/sortie-coucher-soleil-poupe.jpg', label: 'Le couchant', note: 'Sortie de 2 h' },
  { src: '/images/sortie-paddle.jpg', label: 'Le paddle', note: 'À bord, sans supplément' },
  { src: '/images/sortie-efoil-coucher-soleil.jpg', label: 'L’efoil', note: 'Formule Ultra Premium' },
  { src: '/images/sortie-plateau-fruits-de-mer.jpg', label: 'La table', note: 'Sur demande' },
  { src: '/images/sortie-efoil-jour.jpg', label: 'La baignade', note: 'Masque et tuba fournis' },
]

function Jour() {
  const ref = useRef<HTMLElement>(null)
  useActProgress(ref)
  useInterest(ref, 'sortie')

  return (
    <section className="pc-jour" ref={ref} data-sc-act="pan" data-sc-span="3.4" aria-label="Une journée en mer">
      <div className="pc-jour__stage" data-sc-stage>
        <div className="pc-jour__rail" data-sc-pan="0.04">
          <div className="pc-jour__lead">
            <p className="kicker">Le jour</p>
            <h2 className="mixed">
              Le large, <span className="it">à votre rythme</span>
            </h2>
          </div>
          {JOUR.map((j) => (
            <figure key={j.src}>
              <img src={j.src} alt={j.label} loading="lazy" />
              <figcaption>
                <strong>{j.label}</strong>
                <span>{j.note}</span>
              </figcaption>
            </figure>
          ))}
          <p className="pc-jour__end">Puis le soleil descend.</p>
        </div>
      </div>
    </section>
  )
}

/* --- 4. La nuit — le pic --------------------------------------------------- */

/* Deux plans portrait posés sur un fond sombre, pas une photo pleine largeur :
   les vraies photos de la nuit sont verticales, et un recadrage plein cadre
   les ampute (on n'y voyait plus que le plafond). Le texte est sur le fond,
   donc lisible par construction, sans voile qui aplatisse la photo.
   Les deux plans partagent le même décor « Amour » : le soir, puis le matin. */
function Nuit() {
  const ref = useRef<HTMLElement>(null)
  useActProgress(ref)
  useInterest(ref, 'nuit')

  return (
    <section className="pc-nuit" ref={ref} data-sc-act="pin" data-sc-span="3" aria-label="Une nuit à bord">
      <div className="pc-nuit__stage" data-sc-stage>
        <div className="pc-nuit__copy">
          <p className="kicker">La nuit</p>
          <p className="pc-nuit__l1" data-sc-cue="0 1 0 0">
            Votre suite sur l’eau.
          </p>
          <p className="pc-nuit__l2" data-sc-cue="0.3">
            Et le petit-déjeuner au réveil.
          </p>
          <Link to="/nuit-a-bord-yacht-carnon" className="link-arrow pc-nuit__link">
            La nuit à bord
          </Link>
        </div>

        <div className="pc-nuit__plates">
          <figure className="pc-nuit__plate pc-nuit__plate--a">
            <img
              src="/images/nuit-salon-amour.jpg"
              alt="Le salon du yacht le soir, table dressée et décor « Amour »"
              loading="lazy"
              data-breathe
            />
          </figure>
          <figure className="pc-nuit__plate pc-nuit__plate--b">
            <img
              src="/images/nuit-petit-dejeuner-plateau.jpg"
              alt="Petit-déjeuner sur plateau au réveil : viennoiseries, jus d’orange et confitures"
              loading="lazy"
            />
          </figure>
        </div>
      </div>
    </section>
  )
}

/* --- 5. Les occasions ------------------------------------------------------ */

const OCCASIONS = [
  { to: '/evjf-evg-bateau-montpellier', label: 'EVJF & EVG' },
  { to: '/demande-en-mariage-anniversaire-bateau', label: 'Demande en mariage' },
  { to: '/demande-en-mariage-anniversaire-bateau', label: 'Anniversaire' },
  { to: '/seminaire-entreprise-bateau-herault', label: 'Séminaire' },
]

function Occasions() {
  const head = useReveal()

  return (
    <section className="pc-occ" data-sc-act="flow" aria-label="Pour quelle occasion">
      <div className="container">
        <motion.h2 className="mixed pc-occ__q" {...head}>
          Pour <span className="it">quelle occasion</span> ?
        </motion.h2>
        <motion.ul
          className="pc-occ__list"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
        >
          {OCCASIONS.map((o) => (
            <motion.li key={o.label} variants={staggerItem}>
              <Link to={o.to}>{o.label}</Link>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}

/* --- Le parcours ----------------------------------------------------------- */

export default function Parcours() {
  useInterestHandoff()

  return (
    <>
      <Ouverture />
      <Choix />
      <Jour />
      <Nuit />
      <Occasions />
    </>
  )
}
