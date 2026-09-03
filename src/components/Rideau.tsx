import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from 'react'
import { Link } from 'react-router'
import { GOOGLE_REVIEWS_URL, REVIEWS } from '../reviews'
import type { Review } from '../reviews'
import { formatCarnonTime, isDayAt, sunsetAt } from '../sun'
import { pic } from '../pic'
import '../rideau.css'

/* ---------------------------------------------------------------------------
   Le rideau — l'accueil en scène partagée.

   Le jour à gauche, la nuit à droite, tenus côte à côte pendant toute la page
   et séparés par une couture de laiton. Le défilement fait pencher la
   balance : le jour d'abord, la nuit ensuite, une voix de chaque côté, puis la
   couture se range d'elle-même du côté où en est le soleil à Carnon — le jour
   avant le couchant, la nuit après. La couture se saisit aussi à la main, et
   revient en ressort quand on la lâche.

   Un seul lecteur calcule tout par image (progression, position de la
   couture, penchant du pointeur) et publie deux variables ; le CSS fait le
   reste. Aucun moteur d'animation.
--------------------------------------------------------------------------- */

type Side = 'jour' | 'nuit'

const SIZES_HALF = '(max-width: 860px) 100vw, 60vw'
/* La porte étroite que garde le côté perdant, en pixels. */
const DOOR_PX = 72

const VOIX: Record<Side, Review> = {
  jour: REVIEWS.find((r) => r.name === 'Sofia Capuozzi') ?? REVIEWS[0],
  nuit: REVIEWS.find((r) => r.name === 'Jess Ous') ?? REVIEWS[1],
}

const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
const smooth = (t: number) => {
  const x = clamp01(t)
  return x * x * (3 - 2 * x)
}

/* Où la couture doit être, selon la progression : 50/50, le jour penche, la
   nuit penche, retour au centre pour les voix, puis la fermeture. */
function seamGoal(p: number, final: number): number {
  const seg = (a: number, b: number, from: number, to: number) => from + (to - from) * smooth((p - a) / (b - a))
  if (p < 0.16) return 0.5
  if (p < 0.28) return seg(0.16, 0.28, 0.5, 0.62)
  if (p < 0.4) return 0.62
  if (p < 0.52) return seg(0.4, 0.52, 0.62, 0.38)
  if (p < 0.64) return 0.38
  if (p < 0.72) return seg(0.64, 0.72, 0.38, 0.5)
  if (p < 0.8) return 0.5
  if (p < 0.92) return seg(0.8, 0.92, 0.5, final)
  return final
}

const tempsOf = (p: number) => (p < 0.16 ? 0 : p < 0.4 ? 1 : p < 0.64 ? 2 : p < 0.8 ? 3 : 4)

type Live = {
  p: number
  seam: number
  lean: number
  dragging: boolean
  dragPos: number
  vertical: boolean
  W: number
  H: number
  raf: number
  wake: () => void
}

export default function Rideau() {
  const root = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const winnerRef = useRef<Side>('jour')
  const [winner, setWinner] = useState<Side>('jour')
  const [sunset, setSunset] = useState<string | null>(null)
  const live = useRef<Live>({
    p: 0,
    seam: 0.5,
    lean: 0,
    dragging: false,
    dragPos: 0.5,
    vertical: false,
    W: 1,
    H: 1,
    raf: 0,
    wake: () => {},
  })

  /* Le soleil de Carnon, lu sur l'appareil au montage : c'est lui qui décide
     du côté qui reste ouvert à la fin. */
  useEffect(() => {
    const now = new Date()
    const w: Side = isDayAt(now) ? 'jour' : 'nuit'
    winnerRef.current = w
    setWinner(w)
    const s = sunsetAt(now)
    if (s) setSunset(formatCarnonTime(s))
  }, [])

  useEffect(() => {
    const el = root.current
    const st = stage.current
    if (!el || !st) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const L = live.current
    const fine = matchMedia('(pointer: fine)').matches
    let running = false
    let dirty = true

    const measure = () => {
      L.W = st.clientWidth || 1
      L.H = st.clientHeight || 1
      L.vertical = matchMedia('(max-width: 860px)').matches
      st.style.setProperty('--W', `${L.W}px`)
      st.style.setProperty('--H', `${L.H}px`)

      /* Le cadre de chaque photo, et comment la photo (à la taille du volet)
         s'y réduit : une échelle et un décalage, pour que le cadre montre la
         photo entière et non son coin. À la fermeture, l'échelle revient à 1
         et le décalage à 0 : la photo prend le volet. Mêmes constantes que
         rideau.css (--ft, --fb, la gouttière). */
      const W = L.W
      const H = L.H
      const g = Math.min(64, Math.max(20, 0.04 * W))
      st.querySelectorAll<HTMLElement>('.rd__side').forEach((side) => {
        if (L.vertical) {
          side.style.setProperty('--s0', '1')
          side.style.setProperty('--tx0', '0px')
          side.style.setProperty('--ty0', '0px')
          return
        }
        const jour = side.classList.contains('rd__side--jour')
        const fl = jour ? g : 0.5 * W + 12
        const fr = jour ? 0.5 * W + 12 : g
        const ft = 92
        const fb = 0.44 * H
        const fw = W - fl - fr
        const fh = H - ft - fb
        const s0 = Math.max(fw / W, fh / H)
        side.style.setProperty('--s0', s0.toFixed(4))
        side.style.setProperty('--tx0', `${(fl - (s0 * W - fw) / 2).toFixed(1)}px`)
        side.style.setProperty('--ty0', `${(ft - (s0 * H - fh) / 2).toFixed(1)}px`)
      })
      dirty = true
    }

    const frame = () => {
      const r = el.getBoundingClientRect()
      const travel = r.height - innerHeight
      L.p = travel > 0 ? clamp01(-r.top / travel) : 0

      const door = DOOR_PX / (L.vertical ? L.H : L.W)
      const final = winnerRef.current === 'jour' ? 1 - door : door
      let goal: number
      if (L.dragging) {
        goal = L.dragPos
      } else {
        /* Le penchant du pointeur s'efface pendant la fermeture : à la fin,
           c'est le soleil qui décide, pas la souris. */
        const leanW = L.p < 0.8 ? 1 : 1 - smooth((L.p - 0.8) / 0.12)
        goal = seamGoal(L.p, final) + L.lean * leanW
      }
      goal = Math.min(1 - door, Math.max(door, goal))

      /* Le ressort : la couture cède tout de suite sous la main, revient
         doucement sans elle. */
      const k = L.dragging ? 1 : 0.14
      L.seam += (goal - L.seam) * k
      const settled = Math.abs(goal - L.seam) < 0.0004
      if (settled) L.seam = goal

      st.style.setProperty('--p', L.p.toFixed(4))
      st.style.setProperty('--seam', L.seam.toFixed(4))
      const t = String(tempsOf(L.p))
      if (st.dataset.temps !== t) st.dataset.temps = t
      st.setAttribute(
        'data-sc-verify-state',
        `p=${L.p.toFixed(2)} seam=${L.seam.toFixed(2)} temps=${t} gagnant=${winnerRef.current}`,
      )

      dirty = false
      if (L.dragging || !settled) {
        L.raf = requestAnimationFrame(frame)
      } else {
        running = false
      }
    }

    const wake = () => {
      dirty = true
      if (running) return
      running = true
      L.raf = requestAnimationFrame(frame)
    }
    L.wake = wake

    /* Le penchant : sur un pointeur fin, le côté qu'on survole s'ouvre un
       peu — la scène se penche vers le visiteur, pas l'inverse. */
    const onMove = (e: PointerEvent) => {
      if (!fine || L.vertical) return
      L.lean = (e.clientX / L.W - 0.5) * 0.12
      wake()
    }
    const onLeave = () => {
      L.lean = 0
      wake()
    }

    measure()
    wake()
    addEventListener('scroll', wake, { passive: true })
    addEventListener('resize', measure, { passive: true })
    st.addEventListener('pointermove', onMove, { passive: true })
    st.addEventListener('pointerleave', onLeave)
    return () => {
      removeEventListener('scroll', wake)
      removeEventListener('resize', measure)
      st.removeEventListener('pointermove', onMove)
      st.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(L.raf)
      L.wake = () => {}
      void dirty
    }
  }, [])

  /* La couture se tire : à la souris, au doigt, au clavier. */
  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    const L = live.current
    L.dragging = true
    L.dragPos = L.vertical ? e.clientY / L.H : e.clientX / L.W
    e.currentTarget.setPointerCapture(e.pointerId)
    L.wake()
  }
  const onDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    const L = live.current
    if (!L.dragging) return
    L.dragPos = L.vertical ? e.clientY / L.H : e.clientX / L.W
    L.wake()
  }
  const onUp = () => {
    const L = live.current
    L.dragging = false
    L.wake()
  }
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const L = live.current
    const more = e.key === 'ArrowRight' || e.key === 'ArrowDown'
    const less = e.key === 'ArrowLeft' || e.key === 'ArrowUp'
    if (!more && !less) return
    e.preventDefault()
    L.dragging = true
    L.dragPos = Math.min(0.92, Math.max(0.08, L.seam + (more ? 0.1 : -0.1)))
    L.wake()
    setTimeout(() => {
      L.dragging = false
      L.wake()
    }, 1400)
  }

  return (
    <main className="rd" ref={root} data-sc-act="pin" data-sc-span="6" data-sc-stage>
      <h1 className="sr-only">Harmonie Yacht : le jour en mer, la nuit à bord, à Carnon</h1>

      <div className="rd__stage" ref={stage} data-temps="0" data-winner={winner}>
        {/* Le jour */}
        <section className="rd__side rd__side--jour ground-day" aria-label="Le jour : sorties en mer">
          <div className="rd__pane">
            <div className="rd__frame">
              <img
                className="rd__ph rd__ph--1"
                {...pic('/images/sortie-bateau.jpg', SIZES_HALF)}
                alt="Le yacht Harmonie au mouillage sur une eau turquoise"
                fetchPriority="high"
                style={{ viewTransitionName: 'hero-jour' }}
              />
              <img
                className="rd__ph rd__ph--2"
                {...pic('/images/sortie-amis-coucher-soleil.jpg', SIZES_HALF)}
                alt="Entre amis à la proue du yacht, face au soleil couchant"
                loading="lazy"
              />
              <div className="rd__scrim" aria-hidden="true" />
            </div>
            <p className="rd__kicker kicker">Le jour · Sorties en mer</p>
            <div className="rd__copy">
              <p className="rd__kicker--m kicker">Le jour · Sorties en mer</p>
              <div className="rd__cues">
                <div className="rd__cue rd__cue--title">
                  <h2 className="mixed rd__title">Le large, à vous seuls.</h2>
                  <p className="rd__facts">
                    <span>2 h à 8 h</span>
                    <span>jusqu’à 10 invités</span>
                    <span>dès 380 €</span>
                  </p>
                </div>
                <div className="rd__cue rd__cue--more">
                  <p className="rd__more">Nager, ramer, déjeuner à bord. Carburant et mouillage compris.</p>
                  <p className="rd__facts">
                    <span>Paddle, plateforme, masque et tuba</span>
                    <span>Barbecue dès 3 h</span>
                    <span>Avec ou sans capitaine</span>
                  </p>
                </div>
                <blockquote className="rd__cue rd__cue--voice rd__voice">
                  « {VOIX.jour.text} »
                  <footer>
                    {VOIX.jour.name} ·{' '}
                    <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer">
                      avis Google
                    </a>
                  </footer>
                </blockquote>
                <p className="rd__cue rd__cue--sun rd__sunline">
                  {sunset ? (
                    <>
                      À cette heure-ci, à Carnon, c’est le jour. Le soleil se couche à <strong>{sunset}</strong>.
                    </>
                  ) : (
                    <>À cette heure-ci, à Carnon, c’est le jour.</>
                  )}
                </p>
              </div>
              <Link to="/sortie-en-mer-carnon" className="btn rd__door" viewTransition>
                Voir les sorties
              </Link>
            </div>
          </div>
          <Link
            to="/sortie-en-mer-carnon"
            className="rd__slim"
            viewTransition
            aria-label="Voir les sorties en mer"
            tabIndex={-1}
          >
            <span>Le jour</span>
          </Link>
        </section>

        {/* La nuit */}
        <section className="rd__side rd__side--nuit ground-night" aria-label="La nuit : nuits à bord">
          <div className="rd__pane">
            <div className="rd__frame">
              <img
                className="rd__ph rd__ph--1"
                {...pic('/images/soir-3-bougies.webp', SIZES_HALF)}
                alt="La table du salon le soir, bougies et pétales, sous la lampe"
                fetchPriority="high"
                style={{ viewTransitionName: 'hero-nuit' }}
              />
              <img
                className="rd__ph rd__ph--2"
                {...pic('/images/descente-6-cabine.webp', SIZES_HALF)}
                alt="La cabine du yacht, le lit fait, en lumière de fin de journée"
                loading="lazy"
              />
              <div className="rd__scrim" aria-hidden="true" />
            </div>
            <p className="rd__kicker kicker">La nuit · Nuits à bord</p>
            <div className="rd__copy">
              <p className="rd__kicker--m kicker">La nuit · Nuits à bord</p>
              <div className="rd__cues">
                <div className="rd__cue rd__cue--title">
                  <h2 className="mixed rd__title">La nuit à bord, à deux.</h2>
                  <p className="rd__facts">
                    <span>18 h → 12 h</span>
                    <span>petit-déjeuner jusqu’à 10 h</span>
                    <span>dès 250 €</span>
                  </p>
                </div>
                <div className="rd__cue rd__cue--more">
                  <p className="rd__more">Le port s’endort autour. La cabine est prête, le réveil est face à la mer.</p>
                  <p className="rd__facts">
                    <span>Nuit à quai 250 €</span>
                    <span>Nuit Prestige 380 €, sortie au couchant et tapas</span>
                    <span>Checkout à midi</span>
                  </p>
                </div>
                <blockquote className="rd__cue rd__cue--voice rd__voice">
                  « {VOIX.nuit.text} »
                  <footer>
                    {VOIX.nuit.name} ·{' '}
                    <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer">
                      avis Google
                    </a>
                  </footer>
                </blockquote>
                <p className="rd__cue rd__cue--sun rd__sunline">
                  {sunset ? (
                    <>
                      À cette heure-ci, à Carnon, c’est la nuit. Le soleil s’est couché à <strong>{sunset}</strong>.
                    </>
                  ) : (
                    <>À cette heure-ci, à Carnon, c’est la nuit.</>
                  )}
                </p>
              </div>
              <Link to="/nuit-a-bord-yacht-carnon" className="btn btn--light rd__door" viewTransition>
                Voir les nuits
              </Link>
            </div>
          </div>
          <Link
            to="/nuit-a-bord-yacht-carnon"
            className="rd__slim"
            viewTransition
            aria-label="Voir les nuits à bord"
            tabIndex={-1}
          >
            <span>La nuit</span>
          </Link>
        </section>

        {/* La couture : le chrome de la page. */}
        <div className="rd__seam" aria-hidden="true">
          <div className="rd__seam-fill" />
        </div>
        <div
          className="rd__handle"
          role="separator"
          aria-orientation="vertical"
          aria-label="Le rideau entre le jour et la nuit. Tirez-le, ou utilisez les flèches."
          tabIndex={0}
          onPointerDown={onDown}
          onPointerMove={onDrag}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onKeyDown={onKey}
        >
          <div className="rd__crest" aria-hidden="true">
            <img src="/images/logo-s.png" alt="" width="44" height="31" />
          </div>
          {sunset ? (
            <p className="rd__sun" aria-hidden="true">
              Couchant {sunset}
            </p>
          ) : null}
        </div>
      </div>
    </main>
  )
}
