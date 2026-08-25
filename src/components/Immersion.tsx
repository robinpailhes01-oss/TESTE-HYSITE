import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import '../immersion.css'

/* ---------------------------------------------------------------------------
   Séquence immersive de la page d'accueil — « la soirée à bord, heure par
   heure ». Six actes pilotés par le moteur scrollcraft (public/sc/scrollcraft.js,
   vanilla, chargé au montage) : le scroll scrub les deux clips (arrivée,
   salon), fait défiler le rail des expériences et relaie les lignes de texte.

   Signature « l'heure du bord » : un petit cadran fixe dont l'heure avance avec
   le scroll, calé sur le vrai déroulé de la Nuit Prestige (18 h embarquement,
   coucher de soleil, 23 h nuit à bord, 10 h petit-déjeuner — src/experiences.ts).
   Codé ici, dans la page : le moteur n'est pas modifié.
--------------------------------------------------------------------------- */

declare global {
  interface Window {
    ScrollCraft?: { mount: (root: Element | Document) => unknown }
  }
}

let enginePromise: Promise<void> | null = null
function loadEngine(): Promise<void> {
  if (window.ScrollCraft) return Promise.resolve()
  if (!enginePromise) {
    enginePromise = new Promise((resolve, reject) => {
      const s = document.createElement('script')
      s.src = '/sc/scrollcraft.js'
      s.onload = () => resolve()
      s.onerror = () => reject(new Error('scrollcraft.js introuvable'))
      document.head.appendChild(s)
    })
  }
  return enginePromise
}

/* Heure affichée par acte : [minutes au début, minutes à la fin, libellé, phase].
   Le saut 23 h → 10 h entre les actes 5 et 6 est voulu : on a dormi. */
const CLOCK_SEGMENTS = [
  { start: 17.5 * 60, end: 18 * 60, label: "L'arrivée", phase: 'day' },
  { start: 18 * 60, end: 19.5 * 60, label: "L'embarquement", phase: 'day' },
  { start: 19.5 * 60, end: 21.5 * 60, label: 'Au large', phase: 'day' },
  { start: 21.5 * 60, end: 23 * 60, label: 'Le port s’endort', phase: 'night' },
  { start: 23 * 60, end: 23 * 60, label: 'La nuit à bord', phase: 'night' },
  { start: 10 * 60, end: 10 * 60, label: 'Le réveil', phase: 'morning' },
]

function formatHour(minutes: number): string {
  const m = Math.round(minutes / 5) * 5
  const h = Math.floor(m / 60) % 24
  const mn = m % 60
  return mn === 0 ? `${h} h` : `${h} h ${String(mn).padStart(2, '0')}`
}

export default function Immersion() {
  const rootRef = useRef<HTMLDivElement>(null)
  const clockRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root || root.dataset.scMounted) return
    root.dataset.scMounted = '1'

    let disposed = false
    loadEngine().then(() => {
      if (disposed || !window.ScrollCraft) return
      window.ScrollCraft.mount(root)
      /* Le spacer et les lignes sont mesurés au montage : une fois les vraies
         fontes arrivées, une relayout évite les cadrages faux. */
      if (document.fonts?.ready) document.fonts.ready.then(() => dispatchEvent(new Event('resize')))
    })

    /* --- l'heure du bord ------------------------------------------------- */
    const acts = Array.from(root.querySelectorAll<HTMLElement>('[data-sc-act]'))
    const clock = clockRef.current
    let raf = 0
    let ticking = false

    const update = () => {
      ticking = false
      if (!clock || acts.length < CLOCK_SEGMENTS.length) return
      const vh = innerHeight

      /* Fini ? — l'acte du matin est passé aux trois quarts. */
      const lastRect = acts[acts.length - 1].getBoundingClientRect()
      const started = acts[0].getBoundingClientRect().top < -40
      const over = lastRect.bottom < vh * 0.55

      if (!started || over) {
        clock.classList.remove('is-on')
        return
      }
      clock.classList.add('is-on')

      /* Acte courant : le dernier dont le haut est passé au-dessus du centre. */
      let idx = 0
      for (let i = 0; i < acts.length; i++) {
        if (acts[i].getBoundingClientRect().top < vh * 0.5) idx = i
      }
      const seg = CLOCK_SEGMENTS[idx]
      /* Progression publiée par le moteur sur chaque acte (--sc-p). */
      const p = parseFloat(getComputedStyle(acts[idx]).getPropertyValue('--sc-p')) || 0
      const minutes = seg.start + (seg.end - seg.start) * Math.min(1, Math.max(0, p))

      const time = clock.querySelector('.imm-clock__time')
      const label = clock.querySelector('.imm-clock__label')
      if (time) time.textContent = formatHour(minutes)
      if (label) label.textContent = seg.label
      clock.dataset.phase = seg.phase
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        raf = requestAnimationFrame(update)
      }
    }
    addEventListener('scroll', onScroll, { passive: true })
    update()

    /* Clavier : sur un acte épinglé, centrer l'élément ne suffit pas — il faut
       amener l'acte à la progression où son cue est ouvert, sinon le focus se
       pose sur un lien invisible (cas documenté du moteur, à traiter côté page). */
    const suiteLink = root.querySelector<HTMLElement>('.imm-suite-copy a')
    const onSuiteFocus = () => {
      const act = suiteLink?.closest<HTMLElement>('[data-sc-act]')
      if (!act) return
      const p = parseFloat(getComputedStyle(act).getPropertyValue('--sc-p')) || 0
      if (p > 0.2 && p < 0.8) return
      const top = act.getBoundingClientRect().top + scrollY
      scrollTo({ top: top + (act.offsetHeight - innerHeight) * 0.5, behavior: 'instant' as ScrollBehavior })
    }
    suiteLink?.addEventListener('focus', onSuiteFocus)

    return () => {
      disposed = true
      removeEventListener('scroll', onScroll)
      suiteLink?.removeEventListener('focus', onSuiteFocus)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="immersion" ref={rootRef}>
      <noscript>
        <style>{`[data-sc-cue]{opacity:1 !important}`}</style>
      </noscript>

      {/* Acte 1 — l'arrivée. Le bateau entier, la caméra avance sous la main. */}
      <section data-sc-act="scrub" data-sc-span="2.6" data-sc-dwell="0.34" data-sc-drift="#123a5c" aria-label="Le yacht Harmonie au coucher de soleil">
        <div data-sc-stage>
          <picture>
            <source media="(max-width: 860px)" srcSet="/immersion/hero-poster-m.webp" />
            <img
              className="sc-stage__poster"
              src="/immersion/hero-poster.webp"
              alt="Le yacht Harmonie vu de loin au soleil couchant, reflets dorés sur une mer calme"
            />
          </picture>
          <video data-sc-scrub data-sc-src="/immersion/hero.mp4" data-sc-src-mobile="/immersion/hero-m.mp4" muted playsInline />
          <div className="sc-scrim sc-scrim--lead imm-hero-scrim" aria-hidden="true" />
          <div className="sc-copy sc-copy--lead imm-hero-copy" data-sc-cue="0 0.66 0">
            <p className="kicker">Harmonie Yacht — Port de Carnon</p>
            <h1 className="mixed">
              Créateur de moments <span className="it">authentiques</span> sur l’eau
            </h1>
            <p className="imm-line">
              Sorties en mer privées et nuits à bord, toute l’année, sur réservation.
            </p>
            <a href="#prestations" className="btn btn--light">
              Voir nos prestations
            </a>
          </div>
        </div>
      </section>

      {/* Acte 2 — l'embarquement. Le cadre tient, les lignes se relaient. */}
      <section data-sc-act="pin" data-sc-span="2.6" data-sc-drift="#0e2e4a" aria-label="L'embarquement">
        <div data-sc-stage className="imm-board">
          <div className="imm-board__ground" data-sc-parallax="-0.8" aria-hidden="true">
            <img src="/images/sortie-coucher-soleil-poupe.jpg" alt="" loading="lazy" />
          </div>
          <div className="imm-board__veil" aria-hidden="true" />
          <div className="imm-board__lines">
            <p data-sc-cue="0 0.34 0">
              <span className="imm-hour">18 h 00</span>
              Vous montez à bord. Le yacht est à vous.
            </p>
            <p data-sc-cue="0.28 0.62">Le pont est prêt, la table est dressée.</p>
            <p data-sc-cue="0.56 0.88">Il ne reste qu’à larguer les amarres.</p>
          </div>
        </div>
      </section>

      {/* Acte 3 — le large. Défilement latéral des expériences. */}
      <section data-sc-act="pan" data-sc-span="3.2" data-sc-drift="#0b2440" aria-label="Les expériences en mer">
        <div data-sc-stage className="imm-rail-stage">
          <div className="imm-rail" data-sc-pan="0.06">
            <div className="imm-rail__lead">
              <p className="kicker">L’heure dorée</p>
              <h2 className="mixed">
                Le large, <span className="it">à votre rythme</span>
              </h2>
              <p>Baignade, jeux d’eau ou apéritif face au soleil qui descend — tout est déjà à bord.</p>
            </div>
            <figure>
              <img src="/images/sortie-efoil-coucher-soleil.jpg" alt="Efoil au coucher de soleil, face à Carnon" loading="lazy" />
              <figcaption>
                <strong>L’efoil au couchant</strong>
                <span>Formule Ultra Premium</span>
              </figcaption>
            </figure>
            <figure>
              <img src="/images/sortie-paddle.jpg" alt="Paddle depuis la plateforme de bain du yacht" loading="lazy" />
              <figcaption>
                <strong>Le paddle</strong>
                <span>En libre usage</span>
              </figcaption>
            </figure>
            <figure>
              <img src="/images/sortie-plateau-fruits-de-mer.jpg" alt="Plateau de fruits de mer servi à bord, en famille" loading="lazy" />
              <figcaption>
                <strong>Plateau de la mer</strong>
                <span>Sur demande</span>
              </figcaption>
            </figure>
            <p className="imm-rail__end">Le soleil descend. On rentre doucement vers le port.</p>
          </div>
        </div>
      </section>

      {/* Acte 4 — le silence (voulu). La nuit tombe. */}
      <section data-sc-act="flow" data-sc-drift="#071829" className="imm-night" aria-label="La nuit tombe sur le port">
        <p data-sc-in>
          <span className="imm-hour">21 h 30</span>
          Puis le port s’endort.
        </p>
      </section>

      {/* Acte 5 — LE PIC. La suite sur l'eau, à la lumière chaude. */}
      <section data-sc-act="scrub" data-sc-span="3.6" data-sc-dwell="0.4" data-sc-drift="#050f1c" aria-label="Le salon du yacht, la nuit à bord">
        <div data-sc-stage>
          <picture>
            <source media="(max-width: 860px)" srcSet="/immersion/salon-poster-m.webp" />
            <img
              className="sc-stage__poster"
              src="/immersion/salon-poster.webp"
              alt="Le salon du yacht Harmonie, table dressée et décor « Amour »"
            />
          </picture>
          <video data-sc-scrub data-sc-src="/immersion/salon.mp4" data-sc-src-mobile="/immersion/salon-m.mp4" muted playsInline />
          <div className="sc-scrim sc-scrim--trail imm-suite-scrim" aria-hidden="true" />
          <div className="sc-copy sc-copy--trail imm-suite-copy" data-sc-cue="0.14 0.88 0.12 0.12">
            <p className="kicker">23 h 00 — Nuits insolites</p>
            <h2 className="mixed">
              Votre suite <span className="it">sur l’eau</span>
            </h2>
            <p className="imm-line">
              Le clapot contre la coque, le port qui s’endort autour de vous. Ce qu’aucune
              chambre d’hôtel ne peut offrir.
            </p>
            <Link to="/nuit-a-bord-yacht-carnon" className="link-arrow">
              Découvrir la nuit à bord
            </Link>
          </div>
        </div>
      </section>

      {/* Acte 6 — le matin. Retour à la lumière, le site reprend la main. */}
      <section data-sc-act="flow" className="imm-morning" aria-label="Le petit-déjeuner au réveil">
        <div className="container">
          <figure data-sc-reveal="up" data-sc-reveal-at="0.12 0.5">
            <img
              src="/images/nuit-petit-dejeuner-pont.jpg"
              alt="Petit-déjeuner servi sur le pont au réveil, face au port de Carnon"
              loading="lazy"
              width="585"
              height="1017"
            />
          </figure>
          <div data-sc-in data-sc-stagger="70">
            <p className="kicker">10 h 00 — Le réveil</p>
            <h2 className="mixed">
              Réveil <span className="it">face à la mer</span>
            </h2>
            <p>
              Petit-déjeuner sur plateau servi jusqu’à 10 h (Hôtel Neptune), le port encore
              calme. Checkout à midi — vous repartez avec le sentiment d’avoir voyagé très
              loin, sans avoir quitté le port.
            </p>
          </div>
        </div>
      </section>

      {/* La signature : l'heure du bord */}
      <div className="imm-clock" ref={clockRef} data-phase="day" aria-hidden="true">
        <span className="imm-clock__orb" />
        <span className="imm-clock__time">17 h 30</span>
        <span className="imm-clock__label">L’arrivée</span>
      </div>
    </div>
  )
}
