import { useEffect, type RefObject } from 'react'
import { getLenis } from './lenisRef'

/* ---------------------------------------------------------------------------
   Le rail devient physique : on peut le saisir, le lancer, le rattraper.

   Jusqu'ici le rail n'avançait qu'au défilement vertical. C'est un objet
   horizontal : la première chose qu'un doigt tente dessus, c'est de le
   pousser. Ne rien faire à ce geste, c'est laisser le visiteur devant une
   image qui ne répond pas.

   Un seul principe de mise en œuvre, et il évite tous les désaccords : le
   geste ne déplace pas le rail, il déplace le DÉFILEMENT DE LA PAGE. Le rail
   reste piloté par --sc-p, qui reste piloté par la position de la page. Une
   seule source de vérité, donc jamais de rattrapage ni de saut au relâchement.

   Correspondance : le rail parcourt `overflow` pixels pendant que la page en
   parcourt `travel`. Pour que le doigt tienne exactement le rail (1:1), un
   déplacement de dx pixels demande donc -dx * travel / overflow de défilement.

   Le reste vient des règles d'Apple :
     · la course lancée s'arrête là où le doigt l'aurait posée
       (projection d'inertie, d = 0,998) ;
     · elle y arrive par un ressort, pas par une durée fixe ;
     · un nouvel appui la reprend là où elle est — pas là où elle allait ;
     · au-delà des extrémités, le geste devient élastique au lieu de buter.
--------------------------------------------------------------------------- */

/* Constante de projection d'inertie d'Apple : à quelle distance s'arrête un
   lancer à v px/s. 0,998 par image, soit un facteur ~0,5 s de vitesse. */
const DECELERATION = 0.998
/* Constante d'élasticité d'Apple, celle du rebond en bout de liste. */
const BAND_C = 0.55
/* Le geste ne prend la main qu'après cette distance : en dessous, c'est un
   appui, pas un glissement — et sur mobile c'est peut-être un défilement. */
const THRESHOLD = 10
/* Période du ressort d'atterrissage. 0,42 s : assez vif pour paraître
   mécanique, assez long pour qu'on voie le rail décélérer. */
const SPRING_T = 0.42

function project(velocity: number) {
  return (velocity / 1000) * (DECELERATION / (1 - DECELERATION))
}

/* Élastique : le dépassement affiché tend vers une limite au lieu de suivre
   le doigt. dim donne l'échelle — plus l'écran est grand, plus on tolère. */
function band(overshoot: number, dim: number) {
  return (overshoot * dim * BAND_C) / (dim + BAND_C * Math.abs(overshoot))
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

export function useDragRail(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const section = ref.current
    if (!section) return
    /* En animations réduites, le rail est déjà une zone de défilement
       horizontale native : le navigateur fait mieux que nous, on s'efface. */
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const stage = section.querySelector<HTMLElement>('.rail__stage')
    if (!stage) return
    const track = stage.querySelector<HTMLElement>('.rail__track')
    if (!track) return

    let raf = 0
    let tracking = false
    let engaged = false
    let pointer = -1
    let startX = 0
    let startY = 0
    let startScroll = 0
    let ratio = 1
    let top = 0
    let bottom = 0
    let samples: { x: number; t: number }[] = []

    /* On écrit la position par Lenis quand il est là : sinon il continuerait
       d'animer vers son ancienne cible pendant que le doigt tire ailleurs.
       Passer par lui, c'est lui dire « la cible, c'est ici, maintenant ». */
    const setScroll = (y: number) => {
      const lenis = getLenis()
      if (lenis) lenis.scrollTo(y, { immediate: true, force: true })
      else scrollTo(0, y)
    }

    const stopSpring = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = 0
    }

    /* Mesuré au moment du geste, jamais mis en cache : entre deux gestes il y
       a pu y avoir un redimensionnement, une image chargée, une police
       remplacée. */
    const measure = () => {
      const overflow = track.scrollWidth - stage.clientWidth
      const travel = section.offsetHeight - innerHeight
      if (overflow <= 8 || travel <= 8) return false
      ratio = travel / overflow
      top = scrollY + section.getBoundingClientRect().top
      bottom = top + travel
      return true
    }

    const apply = (x: number) => {
      const raw = startScroll + (startX - x) * ratio
      let y = raw
      if (raw < top) y = top + band(raw - top, innerHeight)
      else if (raw > bottom) y = bottom + band(raw - bottom, innerHeight)
      setScroll(y)
    }

    /* Ressort critique (ζ = 1) pour l'atterrissage d'un lancer, légèrement
       rebondissant (ζ = 0,8) pour le retour d'élastique — c'est la matière
       qui se détend, elle a le droit de dépasser un peu. */
    const spring = (from: number, v0: number, to: number, zeta: number) => {
      let y = from
      let vel = v0
      let last = performance.now()
      const k = (2 * Math.PI / SPRING_T) ** 2
      const c = (4 * Math.PI * zeta) / SPRING_T

      const step = (now: number) => {
        const dt = Math.min(0.032, (now - last) / 1000)
        last = now
        /* Sous-pas fixes : un ressort raide intégré sur une image sautée
           diverge, et une page qui part au plafond n'est pas un détail. */
        const n = Math.max(1, Math.ceil(dt / 0.008))
        const h = dt / n
        for (let i = 0; i < n; i++) {
          vel += (-k * (y - to) - c * vel) * h
          y += vel * h
        }
        if (Math.abs(y - to) < 0.5 && Math.abs(vel) < 25) {
          setScroll(to)
          raf = 0
          return
        }
        setScroll(y)
        raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    }

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      /* Interruptibilité : un nouvel appui arrête la course là où elle est
         VISIBLEMENT, pas là où elle se dirigeait. On fige donc le défilement
         sur sa valeur affichée avant toute autre chose. */
      stopSpring()
      setScroll(scrollY)
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
        /* Tant qu'on n'a pas tranché, on ne prend rien : un glissement plutôt
           vertical appartient à la page, et la lui voler donnerait une page
           qui refuse de descendre. */
        if (Math.abs(dy) > THRESHOLD && Math.abs(dy) >= Math.abs(dx)) {
          tracking = false
          return
        }
        if (Math.abs(dx) < THRESHOLD) return
        engaged = true
        stage.setPointerCapture(pointer)
        stage.dataset.drag = 'true'
        /* On repart du seuil, sinon le rail saute des 10 px consommés à
           décider. Le doigt et le rail se retrouvent exactement ici. */
        startX = e.clientX
        startScroll = scrollY
      }

      e.preventDefault()
      samples.push({ x: e.clientX, t: performance.now() })
      if (samples.length > 12) samples.shift()
      apply(e.clientX)
    }

    const onUp = (e: PointerEvent) => {
      if (!tracking || e.pointerId !== pointer) return
      tracking = false
      if (!engaged) return
      engaged = false
      if (stage.hasPointerCapture(pointer)) stage.releasePointerCapture(pointer)
      delete stage.dataset.drag

      /* Vitesse sur la fin du geste seulement : un doigt qui a traîné puis
         lancé doit être lu sur le lancer, pas sur la moyenne. */
      const now = performance.now()
      const recent = samples.filter((s) => now - s.t <= 90)
      let vx = 0
      if (recent.length >= 2) {
        const a = recent[0]
        const b = recent[recent.length - 1]
        const dt = (b.t - a.t) / 1000
        if (dt > 0.001) vx = (b.x - a.x) / dt
      }

      const current = scrollY
      const velocity = -vx * ratio

      if (current < top - 0.5 || current > bottom + 0.5) {
        /* On est dans l'élastique : il se détend jusqu'à l'extrémité. */
        spring(current, velocity, clamp(current, top, bottom), 0.8)
        return
      }
      const target = clamp(current + project(velocity), top, bottom)
      if (Math.abs(target - current) < 1 && Math.abs(velocity) < 40) return
      spring(current, velocity, target, 1)
    }

    const onCancel = (e: PointerEvent) => {
      if (e.pointerId !== pointer) return
      tracking = false
      if (!engaged) return
      engaged = false
      delete stage.dataset.drag
      const current = scrollY
      if (current < top - 0.5 || current > bottom + 0.5) {
        spring(current, 0, clamp(current, top, bottom), 0.8)
      }
    }

    /* Toute autre intention reprend la main immédiatement : molette, touche,
       nouveau contact. Une animation qu'on ne peut pas interrompre est une
       animation qui a raison contre son lecteur. */
    const yield_ = () => stopSpring()

    stage.addEventListener('pointerdown', onDown)
    stage.addEventListener('pointermove', onMove, { passive: false })
    stage.addEventListener('pointerup', onUp)
    stage.addEventListener('pointercancel', onCancel)
    addEventListener('wheel', yield_, { passive: true })
    addEventListener('keydown', yield_)

    return () => {
      stopSpring()
      stage.removeEventListener('pointerdown', onDown)
      stage.removeEventListener('pointermove', onMove)
      stage.removeEventListener('pointerup', onUp)
      stage.removeEventListener('pointercancel', onCancel)
      removeEventListener('wheel', yield_)
      removeEventListener('keydown', yield_)
      delete stage.dataset.drag
    }
  }, [ref])
}
