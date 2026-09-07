import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { Link } from 'react-router'
import { EXPERIENCES } from '../experiences'
import { GOOGLE_REVIEWS_URL, REVIEWS } from '../reviews'
import { formatCarnonTime, sunsetAt } from '../sun'
import { groundFor } from '../ground'
import { pic, SIZES } from '../pic'
import { fetchBookedSlotsResult, getSortieStartHours, isNightBlocked, type BookedSlot } from '../availability'
import { getLenis } from '../lenisRef'
import { useDragRail } from '../useDragRail'
import '../rail.css'
import '../scrollcraft.css'
import '../tour.css'

/* ---------------------------------------------------------------------------
   Le tour du propriétaire — l'accueil comme une visite guidée par les hôtes.

   Sept actes pilotés par le moteur scrollcraft (public/sc/scrollcraft.js,
   chargé au montage, jamais modifié) : le yacht qui tourne sous la main, deux
   phrases, le jour à bord en stations, le couchant à l'heure vraie, la
   descente dans le bateau la nuit, le réveil, et le plan du bord qui se
   déploie en calendrier des dates libres.

   Deux choses sont codées ici, dans la page :
     · la signature « le tour sous la main » : sur le héro, un glissé
       horizontal (souris ou doigt) fait tourner le bateau et continue en
       inertie quand on lâche. Le geste ne touche pas le clip : il déplace le
       défilement de la page, seule source de vérité du moteur ;
     · le chrome « le plan du bord » : un plan du bateau fixe dans la marge,
       quatre stations qui s'allument et se cliquent, et qui, en clôture,
       devient le calendrier.
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

const SORTIE = EXPERIENCES.find((e) => e.group === 'sortie')!
const NUIT = EXPERIENCES.find((e) => e.group === 'nuit')!

const VOIX = ['Alpack', 'Jess Ous', 'Min Jung Hong']
  .map((n) => REVIEWS.find((r) => r.name === n))
  .filter((r): r is NonNullable<typeof r> => Boolean(r))

/* Les quatre stations du plan, dans l'ordre de la visite. `act` est l'id de
   l'acte qu'elles allument et vers lequel elles mènent. */
const STATIONS = [
  { key: 'proue', label: 'La proue', act: 'tour', y: 30 },
  { key: 'cabine', label: 'La cabine', act: 'reveil', y: 64 },
  { key: 'carre', label: 'Le carré', act: 'descente', y: 98 },
  { key: 'pont', label: 'Le pont', act: 'jour', y: 132 },
] as const

/* Le plan du bord : un dessin au trait, vue de dessus, dans un cadre 100×160.
   Le même dessin sert au chrome (petit, dans la marge) et à la clôture (grand,
   qui se trace puis s'efface derrière les dates). */
function DeckPlan({ big }: { big?: boolean }) {
  return (
    <svg viewBox="0 0 100 160" className={big ? 'plan plan--big' : 'plan'} aria-hidden="true" focusable="false">
      <path pathLength={1} className="plan__hull" d="M50 5 C 68 26, 77 78, 76 146 L 24 146 C 23 78, 32 26, 50 5 Z" />
      <path pathLength={1} className="plan__deck" d="M50 22 C 62 40, 68 78, 67 128 L 33 128 C 32 78, 38 40, 50 22 Z" />
      <path pathLength={1} className="plan__line" d="M35 96 L 65 96" />
      <path pathLength={1} className="plan__line" d="M37 60 L 63 60" />
      <path pathLength={1} className="plan__line" d="M30 132 L 70 132 M 24 146 L 76 146" />
      <path pathLength={1} className="plan__line" d="M20 150 L 80 150 L 80 156 L 20 156 Z" />
    </svg>
  )
}

type Day = { iso: string; dow: string; num: number; jour: boolean; nuit: boolean }

function isoOf(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

function buildDays(slots: BookedSlot[], count: number): Day[] {
  const out: Day[] = []
  const start = new Date()
  start.setHours(12, 0, 0, 0)
  start.setDate(start.getDate() + 1)
  const fmt = new Intl.DateTimeFormat('fr-FR', { weekday: 'short' })
  for (let i = 0; i < count; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    const iso = isoOf(d)
    out.push({
      iso,
      dow: fmt.format(d).replace('.', ''),
      num: d.getDate(),
      /* Le jour est libre s'il reste au moins un départ pour une sortie de 3 h. */
      jour: getSortieStartHours(iso, 3, slots).length > 0,
      nuit: !isNightBlocked(iso, slots),
    })
  }
  return out
}

export default function Tour() {
  const rootRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  const jourRef = useRef<HTMLElement>(null)
  const couchantRef = useRef<HTMLElement>(null)
  const closeRef = useRef<HTMLElement>(null)
  const [sunset, setSunset] = useState<string | null>(null)
  const [days, setDays] = useState<Day[] | null>(null)
  const [daysFailed, setDaysFailed] = useState(false)
  const [station, setStation] = useState<string>('proue')
  const [closing, setClosing] = useState(false)

  useDragRail(jourRef)

  /* L'heure vraie du couchant, calculée au montage sur la date du visiteur. */
  useEffect(() => {
    const s = sunsetAt(new Date())
    if (s) setSunset(formatCarnonTime(s))
  }, [])

  /* Les vraies dates libres, trois semaines à partir de demain. */
  useEffect(() => {
    const from = new Date()
    from.setDate(from.getDate() + 1)
    const to = new Date(from)
    to.setDate(from.getDate() + 21)
    fetchBookedSlotsResult(isoOf(from), isoOf(to)).then(({ ok, slots }) => {
      if (!ok) setDaysFailed(true)
      setDays(buildDays(slots, 21))
    })
  }, [])

  /* Le moteur, le sol, les stations, la signature. */
  useEffect(() => {
    const root = rootRef.current
    const hero = heroRef.current
    if (!root || !hero || root.dataset.scMounted) return
    root.dataset.scMounted = '1'
    const html = document.documentElement
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches

    let disposed = false
    loadEngine().then(() => {
      if (disposed || !window.ScrollCraft) return
      window.ScrollCraft.mount(root)
      /* Les actes sont mesurés au montage : une fois les vraies fontes là, on
         relaie la mesure pour que les lignes cinétiques tombent juste. */
      if (document.fonts?.ready) document.fonts.ready.then(() => dispatchEvent(new Event('resize')))
    })

    /* --- le sol et les stations, un seul lecteur ------------------------- */
    /* Dans l'ordre de la page, pas dans l'ordre du plan : la station allumée
       est celle du dernier acte passé, et « le dernier » se lit de haut en bas. */
    const acts = STATIONS.map((s) => ({ key: s.key, el: document.getElementById(s.act) }))
      .filter((a) => a.el)
      .sort((a, b) => a.el!.offsetTop - b.el!.offsetTop)
    let raf = 0
    let queued = false
    const read = () => {
      queued = false
      const vh = innerHeight
      /* Le sol tourne à l'eau du port quand le couchant tient le milieu de
         l'écran, et revient au jour si l'on remonte. */
      const c = couchantRef.current
      if (c) {
        const r = c.getBoundingClientRect()
        const g = r.top + r.height * 0.5 <= vh * 0.5 ? 'night' : 'day'
        if (html.dataset.ground !== g) html.dataset.ground = g
      }
      /* La station allumée : le dernier acte dont le haut est passé le tiers
         de l'écran. */
      let cur = 'proue'
      for (const a of acts) {
        if (!a.el) continue
        if (a.el.getBoundingClientRect().top <= vh * 0.34) cur = a.key
      }
      setStation((s) => (s === cur ? s : cur))
      const cl = closeRef.current
      if (cl) {
        const on = cl.getBoundingClientRect().top <= vh * 0.6
        setClosing((v) => (v === on ? v : on))
      }
    }
    const onScroll = () => {
      if (queued) return
      queued = true
      raf = requestAnimationFrame(read)
    }
    read()
    addEventListener('scroll', onScroll, { passive: true })
    addEventListener('resize', onScroll, { passive: true })

    /* --- la signature : le tour sous la main ------------------------------ */
    /* Un glissé horizontal sur le héro fait tourner le bateau. Le geste
       déplace le défilement (le clip est tenu par le moteur depuis la position
       de la page), avec une inertie à la levée du doigt. Un glissé plutôt
       vertical est laissé à la page. */
    const frame = hero.querySelector<HTMLElement>('.tour__frame')
    let tracking = false
    let engaged = false
    let pointer = -1
    let startX = 0
    let startY = 0
    let startScroll = 0
    let ratio = 1
    let inertia = 0
    let samples: { x: number; t: number }[] = []
    const THRESHOLD = 8

    const setScroll = (y: number) => {
      const lenis = getLenis()
      if (lenis) lenis.scrollTo(y, { immediate: true, force: true })
      else scrollTo(0, y)
    }
    const stopInertia = () => {
      if (inertia) cancelAnimationFrame(inertia)
      inertia = 0
    }
    /* Le clip du héro couvre le défilement de 0 à la hauteur de l'acte moins
       un écran (la vie visible de la scène). Une traversée de l'écran au doigt
       fait un tour complet. */
    const measure = () => {
      const travel = hero.offsetHeight
      if (travel <= 8) return false
      ratio = travel / Math.max(innerWidth, 320)
      return true
    }
    const clampY = (y: number) => Math.min(Math.max(y, 0), hero.offsetHeight)

    const onDown = (e: PointerEvent) => {
      if (reduced) return
      if (e.pointerType === 'mouse' && e.button !== 0) return
      stopInertia()
      if (!measure()) return
      tracking = true
      engaged = false
      pointer = e.pointerId
      startX = e.clientX
      startY = e.clientY
      startScroll = scrollY
      samples = [{ x: e.clientX, t: performance.now() }]
    }
    const onMove = (e: PointerEvent) => {
      if (!tracking || e.pointerId !== pointer) return
      const dx = e.clientX - startX
      const dy = e.clientY - startY
      if (!engaged) {
        if (Math.abs(dy) > THRESHOLD && Math.abs(dy) >= Math.abs(dx)) {
          tracking = false
          return
        }
        if (Math.abs(dx) < THRESHOLD) return
        engaged = true
        frame?.setPointerCapture(pointer)
        hero.dataset.turning = 'true'
        startX = e.clientX
        startScroll = scrollY
      }
      e.preventDefault()
      samples.push({ x: e.clientX, t: performance.now() })
      if (samples.length > 12) samples.shift()
      setScroll(clampY(startScroll + (startX - e.clientX) * ratio))
    }
    const onUp = (e: PointerEvent) => {
      if (!tracking || e.pointerId !== pointer) return
      tracking = false
      if (!engaged) return
      engaged = false
      if (frame?.hasPointerCapture(pointer)) frame.releasePointerCapture(pointer)
      delete hero.dataset.turning
      const now = performance.now()
      const recent = samples.filter((s) => now - s.t <= 90)
      let vx = 0
      if (recent.length >= 2) {
        const a = recent[0]
        const b = recent[recent.length - 1]
        const dt = (b.t - a.t) / 1000
        if (dt > 0.001) vx = (b.x - a.x) / dt
      }
      /* L'inertie : la caméra continue, décélère et se pose. */
      let v = -vx * ratio
      if (Math.abs(v) < 60) return
      let y = scrollY
      let last = now
      const step = (t: number) => {
        const dt = Math.min(0.032, (t - last) / 1000)
        last = t
        v *= Math.pow(0.0025, dt)
        y = clampY(y + v * dt)
        setScroll(y)
        if (Math.abs(v) < 20 || y <= 0 || y >= hero.offsetHeight) {
          inertia = 0
          return
        }
        inertia = requestAnimationFrame(step)
      }
      inertia = requestAnimationFrame(step)
    }
    frame?.addEventListener('pointerdown', onDown)
    frame?.addEventListener('pointermove', onMove)
    frame?.addEventListener('pointerup', onUp)
    frame?.addEventListener('pointercancel', onUp)

    return () => {
      disposed = true
      stopInertia()
      removeEventListener('scroll', onScroll)
      removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
      frame?.removeEventListener('pointerdown', onDown)
      frame?.removeEventListener('pointermove', onMove)
      frame?.removeEventListener('pointerup', onUp)
      frame?.removeEventListener('pointercancel', onUp)
      html.dataset.ground = groundFor(location.pathname)
    }
  }, [])

  /* Aller à une station. Pour les dates, on va au bout de l'acte tenu : le
     calendrier est là, entier, et non le plan qui commence à se tracer. */
  const go = (id: string) => (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const el = document.getElementById(id)
    if (!el) return
    const offset = id === 'dates' ? Math.max(0, el.offsetHeight - innerHeight) : 0
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(el, { duration: 1.4, offset })
    else scrollTo({ top: el.getBoundingClientRect().top + scrollY + offset, behavior: 'smooth' })
  }

  const f = (key: string, group = SORTIE) => group.formules!.find((x) => x.key === key)!
  const sortieFrom = f('2h').amount
  const nuitFrom = f('sans-sortie', NUIT).amount

  return (
    <div className={`tour ${closing ? 'tour--closing' : ''}`} ref={rootRef}>
      <noscript>
        <style>{`[data-sc-cue]{opacity:1 !important} [data-sc-in]{opacity:1 !important;transform:none !important}`}</style>
      </noscript>

      {/* --- Le chrome : le plan du bord ------------------------------------ */}
      <div className="bord" aria-label="Le plan du bord">
        <Link to="/" className="bord__mark" aria-label="Harmonie Yacht">
          <img className="monogram__day" src="/images/logo-s.png" alt="" width="40" height="40" />
          <img className="monogram__night" src="/images/logo-bone-s.png" alt="" width="40" height="40" />
        </Link>
        <a href="#dates" className="bord__cta" onClick={go('dates')}>
          Les dates
        </a>
        <nav className="bord__plan" aria-label="Les stations de la visite">
          <DeckPlan />
          <ul className="bord__stations">
            {STATIONS.map((s) => (
              <li key={s.key} style={{ top: `${(s.y / 160) * 100}%` }} className={station === s.key ? 'is-on' : ''}>
                <a href={`#${s.act}`} onClick={go(s.act)}>
                  <span className="bord__dot" aria-hidden="true" />
                  <span className="bord__label">{s.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <main className="tour__main">
        {/* 1 · LE TOUR (le pic) : scrub + signature ----------------------- */}
        <section id="tour" data-sc-act="scrub" data-sc-span="3.4" data-sc-dwell="0.4" data-sc-drift="#f3f1eb" ref={heroRef} aria-label="Le yacht">
          <div data-sc-stage className="tour__hero">
            <div className="tour__frame">
              <picture>
                <source media="(max-width: 860px)" srcSet="/tour/tour-poster-m.webp" />
                <img className="sc-stage__poster" src="/tour/tour-poster.webp" alt="Le yacht Harmonie au mouillage, tour de la caméra dans la lumière du soir" width="1604" height="1080" fetchPriority="high" />
              </picture>
              <video data-sc-scrub data-sc-src="/tour/tour.mp4" data-sc-src-mobile="/tour/tour-m.mp4" muted playsInline preload="none" />
              <div className="sc-scrim sc-scrim--lead tour__scrim" aria-hidden="true" />
              <p className="tour__hint num" data-sc-cue="0 0.45 0" aria-hidden="true">
                Glissez pour faire le tour
              </p>
            </div>
            <div className="sc-copy sc-copy--lead tour__copy on-photo">
              <p className="kicker tour__kicker" data-sc-cue="0 0.82 0">
                Carnon · à 15 minutes de Montpellier
              </p>
              <h1 className="mixed tour__h1" data-sc-cue="0 0.82 0" data-sc-kinetic="lines">
                Un seul yacht. À vous seuls.
              </h1>
            </div>
            <p className="tour__strip num on-photo" data-sc-cue="0.1 0.95 0.2">
              <span>Le jour · jusqu’à dix invités</span>
              <span>La nuit · pour deux</span>
              {sunset ? <span>Ce soir, le couchant à {sunset}</span> : null}
            </p>
          </div>
        </section>

        {/* 2 · ON VOUS REÇOIT : flow ------------------------------------- */}
        <section id="accueil" data-sc-act="flow" data-sc-drift="#f3f1eb" className="tour__mot" aria-label="Robin et Ludivine">
          <div className="container tour__mot-in" data-sc-in data-sc-stagger="90">
            <p className="tour__mot-l mixed">
              Nous ne louons pas un bateau.
              <br />
              Nous vous recevons à bord.
            </p>
            <p className="tour__mot-p">
              Robin et Ludivine vous attendent au ponton. Le yacht est prêt, la table aussi. Le jour, pour
              dix invités ; la nuit, pour deux. Il ne reste rien à organiser.
            </p>
            <p className="tour__mot-s num">Le plan du bord, dans la marge, vous guide. Quatre stations, puis les dates.</p>
          </div>
        </section>

        {/* 3 · LE JOUR À BORD : pan -------------------------------------- */}
        <section id="jour" data-sc-act="pan" data-sc-span="3.0" data-sc-drift="#e8e5dd" className="tour__jour" ref={jourRef} aria-label="Le jour à bord">
          <div data-sc-stage className="rail__stage tour__rail-stage">
            <div className="rail__track tour__rail" data-sc-pan="0.04">
              <div className="tour__station tour__station--lead">
                <p className="kicker">Le jour</p>
                <h2 className="mixed">
                  Une journée à bord, <span className="it">station par station.</span>
                </h2>
                <p className="tour__rail-p">De deux à huit heures, entre 9 h et 21 h. Le yacht, le capitaine, le carburant et le mouillage compris.</p>
              </div>
              <figure className="tour__station">
                <img {...pic('/images/sortie-bateau.jpg', SIZES.half)} alt="Le yacht Harmonie au mouillage sur une eau turquoise" loading="lazy" />
                <figcaption className="num">Au mouillage, 9 h 40</figcaption>
              </figure>
              <figure className="tour__station tour__station--tall">
                <img {...pic('/images/sortie-paddle.jpg', SIZES.half)} alt="Paddle depuis la plateforme de bain du yacht" loading="lazy" />
                <figcaption className="num">La plateforme de bain, 11 h</figcaption>
              </figure>
              <figure className="tour__station">
                <img {...pic('/images/sortie-plateau-fruits-de-mer.jpg', SIZES.half)} alt="Plateau de fruits de mer servi à bord" loading="lazy" />
                <figcaption className="num">Le carré, 13 h 15</figcaption>
              </figure>
              <figure className="tour__station tour__station--tall">
                <img {...pic('/images/sortie-amis-coucher-soleil.jpg', SIZES.half)} alt="Entre amis à la proue du yacht, face au soleil couchant" loading="lazy" />
                <figcaption className="num">La proue, 19 h 50</figcaption>
              </figure>
              <div className="tour__station tour__station--note">
                <p className="tour__rail-note">Paddle, plateforme flottante, masque et tuba à bord. Barbecue dès trois heures. Jusqu’à dix invités.</p>
                <Link to={`/${SORTIE.slug}`} className="tour__link" viewTransition>
                  Les sorties, dès {sortieFrom}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 4 · LE COUCHANT : pin, silence voulu ------------------------- */}
        <section id="couchant" data-sc-act="pin" data-sc-span="1.4" data-sc-drift="#0a0e12" ref={couchantRef} className="tour__couchant" aria-label="Le couchant">
          <div data-sc-stage className="tour__couchant-stage on-photo">
            <figure className="tour__couchant-fig" data-sc-parallax="-0.5">
              <img {...pic('/images/hero-coucher-soleil-proue.jpg')} alt="Le soleil se couche devant la proue du yacht" loading="lazy" />
            </figure>
            <div className="sc-scrim sc-scrim--band tour__scrim" aria-hidden="true" />
            <div className="sc-copy sc-copy--lead tour__couchant-copy" data-sc-cue="0.08 0.92 0.25 0.3">
              <p className="mixed tour__couchant-l num">
                {sunset ? (
                  <>
                    Ce soir, le soleil se couche à <span className="it">{sunset}</span> sur Carnon.
                  </>
                ) : (
                  <>Ce soir, le soleil se couche sur Carnon.</>
                )}
              </p>
              <p className="tour__couchant-s">Et le bateau reste à vous.</p>
            </div>
          </div>
        </section>

        {/* 5 · LA DESCENTE : scrub, le second et dernier clip ------------ */}
        <section id="descente" data-sc-act="scrub" data-sc-span="2.2" data-sc-dwell="0.3" data-sc-drift="#0a0e12" aria-label="La nuit à bord">
          <div data-sc-stage className="tour__nuit on-photo">
            <picture>
              <source media="(max-width: 860px)" srcSet="/tour/salon-poster-m.webp" />
              <img className="sc-stage__poster" src="/tour/salon-poster.webp" alt="Le salon du yacht le soir, la table dressée pour deux" width="1920" height="1080" loading="lazy" />
            </picture>
            <video data-sc-scrub data-sc-src="/tour/salon.mp4" data-sc-src-mobile="/tour/salon-m.mp4" muted playsInline preload="none" />
            <div className="sc-scrim sc-scrim--trail tour__scrim" aria-hidden="true" />
            <div className="sc-copy sc-copy--trail tour__nuit-copy">
              <p className="kicker" data-sc-cue="0.12 0.9 0.25 0.3">
                La nuit · pour deux
              </p>
              <h2 className="mixed" data-sc-cue="0.14 0.9 0.3 0.3" data-sc-kinetic="lines">
                Le port s’endort. Le salon, puis la cabine.
              </h2>
              <p className="tour__nuit-p num" data-sc-cue="0.2 0.9 0.25 0.3">
                Le salon, 21 h 20 · la cabine avant, 23 h
              </p>
            </div>
          </div>
        </section>

        {/* 6 · LE RÉVEIL : reveal + les voix ---------------------------- */}
        <section id="reveil" data-sc-act="flow" data-sc-drift="#0a0e12" className="tour__reveil" aria-label="Le réveil">
          <div className="container tour__reveil-in">
            <figure className="tour__reveil-fig" data-sc-reveal="up" data-sc-reveal-at="0.12 0.5">
              <img {...pic('/images/soir-4-dejeuner.webp', SIZES.half)} alt="Le petit-déjeuner sur plateau, à bord, au matin" loading="lazy" />
              <figcaption className="num">Le plateau, 9 h 30 · le pont arrière, 10 h</figcaption>
            </figure>
            <div className="tour__reveil-copy" data-sc-in data-sc-stagger="80">
              <p className="kicker">Le réveil</p>
              <h2 className="mixed">
                Le petit-déjeuner de l’Hôtel Neptune, <span className="it">servi sur le pont.</span>
              </h2>
              <p className="tour__reveil-p">Jusqu’à 10 h. Checkout à midi. Le port s’éveille autour.</p>
              <div className="tour__voix">
                {VOIX.map((r) => (
                  <blockquote className="tour__voice" key={r.name}>
                    <p>« {r.text} »</p>
                    <footer className="num">
                      {r.name} ·{' '}
                      <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer">
                        avis Google
                      </a>
                    </footer>
                  </blockquote>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 7 · LES DATES : pin tenu, la clôture. Le plan se déploie. ----- */}
        <section id="dates" data-sc-act="pin" data-sc-span="1.5" data-sc-drift="#0a0e12" ref={closeRef} className="tour__close" aria-label="Les dates libres">
          <div data-sc-stage className="tour__close-stage">
            <div className="tour__close-plan" aria-hidden="true">
              <DeckPlan big />
            </div>
            <div className="container tour__close-in" data-sc-cue="0.1" data-sc-rise="0.6">
              <header className="tour__close-head">
                <p className="kicker">Les trois prochaines semaines</p>
                <h2 className="mixed">
                  Le plan du bord vous tend <span className="it">les dates libres.</span>
                </h2>
              </header>

              <ol className="tour__days" aria-label="Dates libres">
                {(days ?? Array.from({ length: 21 }, () => null)).map((d, i) => (
                  <li key={d ? d.iso : i} className={`tour__day ${d ? '' : 'is-blank'}`}>
                    {d ? (
                      <>
                        <span className="tour__day-dow">{d.dow}</span>
                        <span className="tour__day-num num">{d.num}</span>
                        <span className="tour__day-marks">
                          {d.jour ? (
                            <Link to={`/${SORTIE.slug}?date=${d.iso}#reservation`} className="tour__mark" aria-label={`Sortie en mer le ${d.iso}`}>
                              Jour
                            </Link>
                          ) : (
                            <span className="tour__mark is-off">Jour</span>
                          )}
                          {d.nuit ? (
                            <Link to={`/${NUIT.slug}?date=${d.iso}#reservation`} className="tour__mark" aria-label={`Nuit à bord le ${d.iso}`}>
                              Nuit
                            </Link>
                          ) : (
                            <span className="tour__mark is-off">Nuit</span>
                          )}
                        </span>
                      </>
                    ) : (
                      <span className="tour__day-num num" aria-hidden="true">
                        ·
                      </span>
                    )}
                  </li>
                ))}
              </ol>
              <p className="tour__days-note num">
                {daysFailed
                  ? 'Les disponibilités se vérifient sur la page de réservation.'
                  : days
                    ? 'Un jour, une nuit : cliquez la date, elle est retenue dans le formulaire.'
                    : 'Lecture des dates libres…'}
              </p>

              <div className="tour__doors">
                <Link to={`/${SORTIE.slug}`} className="tour__door" viewTransition>
                  <span className="kicker">Le jour</span>
                  <span className="tour__door-t mixed">Réserver une sortie</span>
                  <span className="tour__door-p num">Dès {sortieFrom} · 2 à 8 h · dix invités</span>
                </Link>
                <Link to={`/${NUIT.slug}`} className="tour__door" viewTransition>
                  <span className="kicker">La nuit</span>
                  <span className="tour__door-t mixed">Réserver une nuit</span>
                  <span className="tour__door-p num">Dès {nuitFrom} · pour deux · petit-déjeuner compris</span>
                </Link>
              </div>
              <p className="tour__close-small num">
                Ponton de l’Hôtel Neptune, Carnon · Acompte de 30 % pour les sorties, totalité pour les nuits ·{' '}
                <Link to="/tarifs">tous les tarifs</Link>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
