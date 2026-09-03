import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { EXPERIENCES } from '../experiences'
import { GOOGLE_REVIEWS_URL, REVIEWS } from '../reviews'
import { formatCarnonTime, sunsetAt } from '../sun'
import { groundFor } from '../ground'
import { pic, SIZES } from '../pic'
import '../histoire.css'

/* ---------------------------------------------------------------------------
   L'histoire — l'accueil comme le site d'un hôtel.

   Un récit qui se lit en défilant, dans l'ordre d'une journée à bord : une
   accroche, un message, le jour heure par heure, le couchant, la nuit, le
   réveil, trois voix, et les prix en toute fin. Rien n'est épinglé : les
   images arrivent en fondu, glissent d'un souffle, et la page tourne au noir
   quand on passe le couchant. On parle peu, on montre.

   Un seul lecteur de défilement : le parallaxe des photos (au pointeur fin
   seulement), le fil de laiton qui s'allonge le long du récit, et le sol qui
   bascule au passage du couchant.
--------------------------------------------------------------------------- */

const SORTIE = EXPERIENCES.find((e) => e.group === 'sortie')!
const NUIT = EXPERIENCES.find((e) => e.group === 'nuit')!

const VOIX = ['Alpack', 'Min Jung Hong', 'Christophe Bourgin']
  .map((n) => REVIEWS.find((r) => r.name === n))
  .filter((r): r is NonNullable<typeof r> => Boolean(r))

type ChapitreProps = {
  time: string
  line: ReactNode
  note: string
  children: ReactNode
  layout?: 'bleed' | 'inset' | 'pair' | 'portrait'
}

/* Un chapitre : l'heure sur le fil, une ligne, la photo, une légende. */
function Chapitre({ time, line, note, children, layout = 'bleed' }: ChapitreProps) {
  return (
    <section className={`hi__ch hi__ch--${layout}`}>
      <header className="hi__ch-head" data-in>
        <span className="hi__time num">{time}</span>
        <h2 className="mixed hi__line">{line}</h2>
      </header>
      <div className="hi__media">{children}</div>
      <p className="hi__note" data-in>
        {note}
      </p>
    </section>
  )
}

function Photo({
  src,
  alt,
  sizes = SIZES.full,
  priority,
  vt,
}: {
  src: string
  alt: string
  sizes?: string
  priority?: boolean
  vt?: string
}) {
  return (
    <figure className="hi__fig" data-in data-para>
      <img
        {...pic(src, sizes)}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        style={vt ? { viewTransitionName: vt } : undefined}
      />
    </figure>
  )
}

export default function Histoire() {
  const recit = useRef<HTMLDivElement>(null)
  const passage = useRef<HTMLElement>(null)
  const [sunset, setSunset] = useState<string | null>(null)

  useEffect(() => {
    const s = sunsetAt(new Date())
    if (s) setSunset(formatCarnonTime(s))
  }, [])

  useEffect(() => {
    const html = document.documentElement
    const root = recit.current
    if (!root) return
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const fine = matchMedia('(pointer: fine)').matches

    /* Les arrivées : une classe posée une fois, quand l'élément entre. */
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
    )
    document.querySelectorAll('[data-in]').forEach((el) => io.observe(el))

    /* Le parallaxe, le fil, le sol : un seul lecteur. */
    const paras = Array.from(document.querySelectorAll<HTMLElement>('[data-para]'))
    let raf = 0
    let queued = false
    const read = () => {
      queued = false
      const vh = innerHeight

      /* Le sol tourne au noir quand le milieu du couchant passe le milieu
         de l'écran, et revient au jour si l'on remonte. */
      const p = passage.current
      if (p) {
        const r = p.getBoundingClientRect()
        const g = r.top + r.height * 0.5 <= vh * 0.5 ? 'night' : 'day'
        if (html.dataset.ground !== g) html.dataset.ground = g
      }

      /* Le fil : la part du récit déjà lue. */
      const rr = root.getBoundingClientRect()
      const fil = Math.min(1, Math.max(0, (vh * 0.5 - rr.top) / rr.height))
      root.style.setProperty('--fil', fil.toFixed(4))

      /* Le parallaxe : léger, au pointeur fin seulement, sur ce qui est à
         l'écran. Six pour cent de course, pas plus : un souffle. */
      if (fine && !reduced) {
        for (const el of paras) {
          const r = el.getBoundingClientRect()
          if (r.bottom < 0 || r.top > vh) continue
          const c = (r.top + r.height / 2 - vh / 2) / vh
          el.style.setProperty('--py', `${(-c * 6).toFixed(2)}%`)
        }
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
      io.disconnect()
      removeEventListener('scroll', onScroll)
      removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
      html.dataset.ground = groundFor(location.pathname)
    }
  }, [])

  const f = (key: string, group = SORTIE) => group.formules!.find((x) => x.key === key)!

  return (
    <main className="hi">
      {/* L'accroche : une photo, une ligne. */}
      <section className="hi__hero on-photo" aria-label="Harmonie Yacht">
        <picture className="hi__hero-pic">
          <img
            {...pic('/images/soir-1-couchant.webp')}
            alt="Le soleil se couche sur la mer, vu du pont du yacht"
            fetchPriority="high"
          />
        </picture>
        <div className="hi__hero-veil" aria-hidden="true" />
        <div className="container hi__hero-copy">
          <p className="kicker">Carnon · à 15 minutes de Montpellier</p>
          <h1 className="mixed hi__h1">
            Un seul yacht.
            <br />
            <em>À vous seuls.</em>
          </h1>
        </div>
      </section>

      <div className="hi__recit" ref={recit}>
        <div className="hi__fil" aria-hidden="true">
          <span />
        </div>

        {/* Le message. */}
        <section className="hi__mot" data-in>
          <div className="container hi__mot-in">
            <p className="hi__mot-l mixed">
              Nous ne louons pas un bateau.
              <br />
              Nous vous recevons à bord.
            </p>
            <p className="hi__mot-p">
              Robin et Ludivine vous attendent au ponton. Le yacht est prêt, la table aussi. Le jour, pour
              dix invités ; la nuit, pour deux. Il ne reste rien à organiser.
            </p>
          </div>
        </section>

        {/* Le jour. */}
        <Chapitre time="9 h" line={<>Le large.</>} note="Le yacht, privatisé. Personne d’autre à bord que vous.">
          <Photo
            src="/images/sortie-bateau.jpg"
            alt="Le yacht Harmonie au mouillage sur une eau turquoise"
            vt="hero-jour"
          />
        </Chapitre>

        <Chapitre
          time="11 h"
          line={<>L’eau.</>}
          note="Paddle, plateforme flottante, masque et tuba. À bord, en libre usage."
          layout="pair"
        >
          <Photo src="/images/sortie-paddle.jpg" alt="Paddle depuis la plateforme de bain du yacht" sizes={SIZES.half} />
          <Photo src="/images/sortie-efoil-jour.jpg" alt="Efoil en pleine journée, à la demande" sizes={SIZES.half} />
        </Chapitre>

        <Chapitre
          time="13 h"
          line={<>La table.</>}
          note="Barbecue à disposition dès trois heures. Plateau sur demande."
          layout="inset"
        >
          <Photo
            src="/images/sortie-plateau-fruits-de-mer.jpg"
            alt="Plateau de fruits de mer servi à bord, en famille"
            sizes={SIZES.column}
          />
        </Chapitre>

        <Chapitre time="19 h" line={<>Les amis.</>} note="Jusqu’à dix invités. Anniversaires, EVJF, familles.">
          <Photo src="/images/sortie-amis-coucher-soleil.jpg" alt="Entre amis à la proue du yacht, face au soleil couchant" />
        </Chapitre>

        {/* Le passage : le couchant, à l'heure vraie. Le sol tourne ici. */}
        <section className="hi__passage on-photo" ref={passage} aria-label="Le couchant">
          <figure className="hi__fig hi__fig--passage" data-para>
            <img
              {...pic('/images/hero-coucher-soleil-proue.jpg')}
              alt="Le soleil se couche devant la proue du yacht"
              loading="lazy"
            />
          </figure>
          <div className="hi__passage-veil" aria-hidden="true" />
          <div className="container hi__passage-copy" data-in>
            <p className="hi__passage-l mixed num">
              {sunset ? (
                <>
                  Ce soir, le soleil se couche à <em>{sunset}</em> sur Carnon.
                </>
              ) : (
                <>Ce soir, le soleil se couche sur Carnon.</>
              )}
            </p>
            <p className="hi__passage-s">Et le bateau reste à vous.</p>
          </div>
        </section>

        {/* La nuit. */}
        <Chapitre time="21 h" line={<>La table, à deux.</>} note="Tapas Una Mas, en Nuit Prestige." layout="inset">
          <Photo src="/images/soir-3-bougies.webp" alt="La table du salon le soir, bougies et pétales, sous la lampe" sizes={SIZES.column} />
        </Chapitre>

        <Chapitre time="23 h" line={<>La cabine.</>} note="Le port s’endort autour. Le clapot contre la coque.">
          <Photo src="/images/descente-6-cabine.webp" alt="La cabine du yacht, le lit fait, en lumière de fin de journée" />
        </Chapitre>

        <Chapitre
          time="10 h"
          line={<>Le réveil.</>}
          note="Petit-déjeuner de l’Hôtel Neptune, servi jusqu’à 10 h. Checkout à midi."
          layout="pair"
        >
          <Photo src="/images/soir-4-dejeuner.webp" alt="Le petit-déjeuner sur plateau, à bord" sizes={SIZES.half} />
          <Photo src="/images/nuit-petit-dejeuner-pont.jpg" alt="Petit-déjeuner servi sur le pont au réveil, face au port" sizes={SIZES.half} />
        </Chapitre>

        {/* Les voix. */}
        <section className="hi__voix" aria-label="Avis clients">
          <div className="container">
            {VOIX.map((r) => (
              <blockquote className="hi__voice" key={r.name} data-in>
                <p>« {r.text} »</p>
                <footer>
                  {r.name} ·{' '}
                  <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer">
                    avis Google
                  </a>
                </footer>
              </blockquote>
            ))}
          </div>
        </section>

        {/* Les prix, en dernier. Une carte, comme dans une chambre. */}
        <section className="hi__tarifs" id="tarifs" aria-label="Tarifs">
          <div className="container">
            <header className="hi__tarifs-head" data-in>
              <p className="kicker">Tout compris</p>
              <h2 className="mixed">Le yacht, le capitaine, le carburant, le mouillage.</h2>
              <p className="hi__tarifs-p">
                Un acompte de 30 % en ligne, le solde à bord. Sans capitaine, avec permis et 50 heures de
                navigation : −15 %.
              </p>
            </header>

            <div className="hi__carte">
              <div className="hi__carte-col" data-in>
                <h3 className="caps hi__carte-t">Le jour</h3>
                <ul className="hi__rows">
                  {['2h', '3h', '4h', '8h'].map((k) => {
                    const x = f(k)
                    return (
                      <li key={k}>
                        <span className="hi__row-n">
                          {x.name} {x.it}
                        </span>
                        <span className="hi__row-d">{x.duration}</span>
                        <span className="hi__row-p num">{x.amount}</span>
                      </li>
                    )
                  })}
                </ul>
                <Link to={`/${SORTIE.slug}`} className="btn" viewTransition>
                  Réserver une sortie
                </Link>
              </div>
              <div className="hi__carte-col" data-in>
                <h3 className="caps hi__carte-t">La nuit</h3>
                <ul className="hi__rows">
                  {['sans-sortie', 'prestige'].map((k) => {
                    const x = f(k, NUIT)
                    return (
                      <li key={k}>
                        <span className="hi__row-n">
                          {x.name} {x.it}
                        </span>
                        <span className="hi__row-d">{x.duration}</span>
                        <span className="hi__row-p num">{x.amount}</span>
                      </li>
                    )
                  })}
                </ul>
                <Link to={`/${NUIT.slug}`} className="btn" viewTransition>
                  Réserver une nuit
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
