import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { GOOGLE_REVIEWS_URL, REVIEWS } from '../reviews'
import { formatCarnonTime, sunsetAt } from '../sun'
import { groundFor } from '../ground'
import '../chapitres.css'

/* ---------------------------------------------------------------------------
   L'accueil, en chapitres.

   Une page de titre sur le papier, puis des plaques plein écran qui glissent
   les unes par-dessus les autres — la précédente s'assombrit et recule en
   étant recouverte, comme une page qu'on tourne. Au milieu, la signature : le
   sol passe du papier à la nuit sous les yeux, piloté par le défilement, et
   une seule ligne dit l'heure vraie du couchant ce soir à Carnon.

   Tout ce qui bouge est calculé une fois par image dans un seul lecteur de
   défilement, publié en variables CSS (--dusk sur <html>, --cover sur chaque
   plaque), et rendu en CSS. Aucun second moteur d'animation.
--------------------------------------------------------------------------- */

/* Trois avis courts, réels, tels quels. Les plus longs restent sur la fiche
   Google : ici on lit une voix par écran, pas une grille. */
const VOIX = REVIEWS.filter((r) => r.text.length <= 250).slice(0, 3)

const FOLIO = [
  'Harmonie Yacht · Carnon',
  'Le jour',
  'La tombée du jour',
  'La nuit',
  'Ils ont embarqué',
  'À vous',
]

export default function Chapitres() {
  const chapters = useRef<(HTMLElement | null)[]>([])
  const hold = useRef<HTMLDivElement>(null)
  const stackRef = useRef<HTMLDivElement>(null)
  const [folio, setFolio] = useState(0)
  const [sunset, setSunset] = useState<string | null>(null)

  /* L'heure du couchant, calculée sur l'appareil (algorithme NOAA, src/sun.ts,
     vérifié à 0 s d'écart). Après montage seulement : elle dépend du jour où
     l'on regarde, pas du jour où la page a été construite. */
  useEffect(() => {
    const d = sunsetAt(new Date())
    if (d) setSunset(formatCarnonTime(d))
  }, [])

  useEffect(() => {
    const html = document.documentElement
    let raf = 0
    let queued = false

    const read = () => {
      queued = false
      const vh = innerHeight

      /* 1. La tombée du jour : la progression de la plaque tenue, publiée sur
            <html>. Le sol en découle en CSS ; le mode (jour/nuit) bascule à
            mi-course, ce qui retourne la nav et tout ce qui lit --ink. */
      const h = hold.current
      if (h) {
        const r = h.getBoundingClientRect()
        const travel = r.height - vh
        const p = travel > 0 ? Math.min(1, Math.max(0, -r.top / travel)) : 0
        html.style.setProperty('--dusk', p.toFixed(4))
        const g = p >= 0.5 ? 'night' : 'day'
        if (html.dataset.ground !== g) html.dataset.ground = g
      }

      /* 2. Le recouvrement et le folio. Une plaque s'assombrit à mesure que la
            suivante glisse dessus ; le folio suit la dernière section dont le
            haut a passé le milieu de l'écran — c'est celle qu'on regarde. */
      const els = chapters.current
      let active = 0
      els.forEach((el, i) => {
        if (!el) return
        const top = el.getBoundingClientRect().top
        if (top <= vh * 0.5) active = i
        if (el.dataset.plate !== undefined) {
          const next = els[i + 1]
          const cover = next
            ? Math.min(1, Math.max(0, (vh - next.getBoundingClientRect().top) / vh))
            : 0
          el.style.setProperty('--cover', cover.toFixed(3))
        }
      })
      setFolio((prev) => (prev === active ? prev : active))

      /* L'état visuel, publié pour le harnais de vérification : ce mouvement
         (plaques qui se recouvrent, sol qui tombe) ne passe par aucun de ses
         devices, il lui faut une représentation de ce qu'on voit réellement. */
      const stack = stackRef.current
      if (stack) {
        const covers = els
          .filter((el) => el && el.dataset.plate !== undefined)
          .map((el) => el!.style.getPropertyValue('--cover') || '0')
        stack.setAttribute(
          'data-sc-verify-state',
          `chapitre=${active} dusk=${html.style.getPropertyValue('--dusk') || '0'} cover=${covers.join('/')}`,
        )
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
    return () => {
      removeEventListener('scroll', onScroll)
      removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
      html.style.removeProperty('--dusk')
      /* On rend le sol à la page suivante — celui de SA route, pas « jour »
         par réflexe : ce nettoyage s'exécute après que React a posé le sol de
         la nouvelle page, et l'écraser la ferait clignoter. */
      html.dataset.ground = groundFor(location.pathname)
    }
  }, [])

  const reg = (i: number) => (el: HTMLElement | null) => {
    chapters.current[i] = el
  }

  return (
    <main className="ch">
      {/* Le folio : le numéro et le titre du chapitre, dans la marge. C'est la
          seule navigation de la page, et elle dit où l'on est. */}
      <p className="ch__folio" aria-live="polite">
        <span className="ch__folio-n">{String(folio).padStart(2, '0')}</span>
        <span className="ch__folio-sep" aria-hidden="true">
          —
        </span>
        <span className="ch__folio-t">{FOLIO[folio]}</span>
      </p>

      {/* 00 · La page de titre : du type sur le papier, la photo dans sa
          colonne avec sa légende. Rien ne bouge fort. */}
      <section className="ch__title" ref={reg(0)} aria-label="Harmonie Yacht">
        <div className="container ch__title-grid">
          <div className="ch__title-copy">
            <p className="kicker">Yacht privé avec skipper · Port de Carnon</p>
            <h1 className="ch__h1">
              Le jour <em>en mer</em>,<br />
              la nuit <em>à bord</em>.
            </h1>
            <p className="ch__lede">
              Un seul yacht, à vous seuls. Pour dix invités le temps d’une sortie, pour deux le
              temps d’une nuit.
            </p>
            <div className="ch__title-doors">
              <Link to="/sortie-en-mer-carnon" className="link-arrow">
                Les sorties
              </Link>
              <Link to="/nuit-a-bord-yacht-carnon" className="link-arrow">
                Les nuits
              </Link>
            </div>
          </div>
          <figure className="ch__title-fig">
            <img
              src="/images/hero-bateau.jpg"
              alt="Le yacht Harmonie au large de Carnon, au soleil couchant"
              fetchPriority="high"
            />
            <figcaption>Le yacht Harmonie, au large de Carnon.</figcaption>
          </figure>
        </div>
      </section>

      <div className="ch__stack" ref={stackRef} data-sc-act="pin" data-sc-span="4.3" data-sc-stage>
        {/* 01 · Le jour. Glisse par-dessus la page de titre. */}
        <div className="ch__hold">
          <section className="ch__plate on-photo" ref={reg(1)} data-plate aria-label="Le jour">
            <div className="ch__plate-in">
              <picture>
                <source media="(max-width: 700px)" srcSet="/images/sortie-paddle.jpg" />
                <img
                  src="/images/sortie-bateau.jpg"
                  alt="Le yacht au mouillage sur une eau turquoise"
                  loading="lazy"
                />
              </picture>
              <div className="ch__veil" aria-hidden="true" />
              <div className="ch__cap">
                <p className="kicker">01 — Le jour</p>
                <h2 className="ch__h2">Sorties en mer</h2>
                <p className="ch__facts">
                  <span>2 h à 8 h</span>
                  <span>jusqu’à 10 invités</span>
                  <span>dès 380 €</span>
                </p>
                <Link to="/sortie-en-mer-carnon" className="btn btn--light">
                  Découvrir les sorties
                </Link>
              </div>
            </div>
          </section>
        </div>

        {/* 02 · La tombée du jour — le pic. La plaque est tenue deux écrans ;
            pendant sa course le sol devient nuit et la ligne du couchant
            paraît. */}
        <div className="ch__hold ch__hold--dusk" ref={hold}>
          <section
            className="ch__plate ch__plate--dusk on-photo"
            ref={reg(2)}
            data-plate
            aria-label="La tombée du jour"
          >
            <div className="ch__plate-in">
              <picture>
                <source media="(max-width: 700px)" srcSet="/images/sortie-coucher-soleil-poupe.jpg" />
                <img
                  src="/images/soir-1-couchant.webp"
                  alt="Le soleil se couche sur la mer, vu du pont arrière"
                  loading="lazy"
                />
              </picture>
              <div className="ch__dusk-veil" aria-hidden="true" />
              <div className="ch__dusk-line">
                <hr className="ch__dusk-rule" />
                <p className="ch__dusk-p">
                  {sunset ? (
                    <>
                      Ce soir, à Carnon, le soleil se couche à <strong>{sunset}</strong>.
                    </>
                  ) : (
                    <>Ce soir, à Carnon, le soleil se couche sur le port.</>
                  )}
                </p>
                <p className="ch__dusk-s">Et le bateau reste à vous.</p>
              </div>
            </div>
          </section>
        </div>

        {/* 03 · La nuit. Glisse par-dessus le couchant, sur le sol nuit. */}
        <div className="ch__hold">
          <section className="ch__plate on-photo" ref={reg(3)} data-plate aria-label="La nuit">
            <div className="ch__plate-in">
              <picture>
                <source media="(max-width: 700px)" srcSet="/images/descente-6-cabine-p.webp" />
                <img
                  src="/images/descente-6-cabine.webp"
                  alt="La cabine du yacht, le lit fait, en lumière de fin de journée"
                  loading="lazy"
                />
              </picture>
              <div className="ch__veil" aria-hidden="true" />
              <div className="ch__cap">
                <p className="kicker">03 — La nuit</p>
                <h2 className="ch__h2">Nuits à bord</h2>
                <p className="ch__facts">
                  <span>18 h → 12 h</span>
                  <span>à deux</span>
                  <span>dès 250 €</span>
                </p>
                <Link to="/nuit-a-bord-yacht-carnon" className="btn btn--light">
                  Découvrir les nuits
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* 04 · Les voix. Trois avis réels, grands, un par écran, sur la nuit. */}
      <section className="ch__voix" ref={reg(4)} id="avis" aria-label="Avis clients">
        <div className="container">
          {VOIX.map((r) => (
            <blockquote className="ch__voice" key={r.name}>
              <p className="ch__voice-t">« {r.text} »</p>
              <footer className="ch__voice-f">
                <span>{r.name}</span>
                <span className="ch__voice-sep" aria-hidden="true">
                  ·
                </span>
                <span>{r.when}</span>
                <span className="ch__voice-sep" aria-hidden="true">
                  ·
                </span>
                <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer">
                  avis Google
                </a>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* 05 · Le choix. Deux portes en texte courant, tenues. Pas de
          formulaire ici : on ne réserve pas avant d'avoir choisi. */}
      <section className="ch__choix" ref={reg(5)} id="choix" aria-label="Choisir">
        <div className="container">
          <p className="kicker">À vous</p>
          <nav className="ch__doors" aria-label="Choisir une expérience">
            <Link to="/sortie-en-mer-carnon" className="ch__door">
              <span className="ch__door-k">Le jour</span>
              <span className="ch__door-t">
                Sorties <em>en mer</em>
              </span>
            </Link>
            <Link to="/nuit-a-bord-yacht-carnon" className="ch__door">
              <span className="ch__door-k">La nuit</span>
              <span className="ch__door-t">
                Nuits <em>à bord</em>
              </span>
            </Link>
          </nav>
        </div>
      </section>
    </main>
  )
}
