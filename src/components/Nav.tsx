import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'

/* Le menu suit le tunnel : les deux expériences d'abord, le reste ensuite. */
const PHOTO_HERO = new Set(['/', '/sortie-en-mer-carnon', '/nuit-a-bord-yacht-carnon'])

const LINKS: { to: string; label: string }[] = [
  { to: '/sortie-en-mer-carnon', label: 'Sorties en mer' },
  { to: '/nuit-a-bord-yacht-carnon', label: 'Nuits à bord' },
  { to: '/galerie', label: 'Galerie' },
  { to: '/tarifs', label: 'Tarifs' },
]

export default function Nav() {
  const [solid, setSolid] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const onHome = pathname === '/'
  /* En haut des pages qui ouvrent sur une photo, la nav est posée SUR la
     photo : elle prend la couleur os, pas celle du sol. Décidé depuis le
     chemin, donc identique au serveur et au client — pas de sursaut. */
  const overPhoto = PHOTO_HERO.has(pathname.replace(/\/$/, '') || '/')

  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setSolid(y > 40)
      setHidden(y > lastY && y > 160)
      lastY = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Menu ouvert : on gèle le scroll de la page */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  /* Fermer le menu quand on change de page */
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  /* On réserve sur la page de l'expérience choisie ; ailleurs, « Réserver »
     ramène au choix, c'est-à-dire à l'accueil. */
  const onExperience = /^\/(sortie-en-mer-carnon|nuit-a-bord-yacht-carnon)\/?$/.test(pathname)
  const reserveHref = onExperience ? '#reservation' : onHome ? '#tarifs' : '/#tarifs'

  return (
    <header
      className={`nav ${solid || open ? 'nav--solid' : ''} ${
        hidden && !open ? 'nav--hidden' : ''
      } ${open ? 'nav--open' : ''} ${overPhoto && !solid && !open ? 'nav--over' : ''}`}
    >
      <div className="container nav__inner">
        <nav aria-label="Navigation principale">
          <ul className="nav__links">
            {LINKS.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="nav__link" onClick={() => setOpen(false)}>
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="nav__item--mobile">
              <a href={reserveHref} className="nav__link" onClick={() => setOpen(false)}>
                Réserver
              </a>
            </li>
          </ul>
        </nav>

        <Link to="/" className="monogram" aria-label="Harmonie Yacht — retour à l’accueil">
          <img className="monogram__day" src="/images/logo-s.png" alt="Harmonie Yacht" />
          <img className="monogram__night" src="/images/logo-bone-s.png" alt="" aria-hidden="true" />
        </Link>

        <div className="nav__actions">
          <a href={reserveHref} className="btn">
            Réserver
          </a>
        </div>

        <button
          className="nav__burger"
          aria-expanded={open}
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}
