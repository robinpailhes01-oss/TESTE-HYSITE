import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const LINKS = [
  { hash: '#prestations', label: 'Prestations' },
  { hash: '#abord', label: 'À bord' },
  { hash: '#galerie', label: 'Galerie' },
  { hash: '#avis', label: 'Avis' },
  { hash: '#tarifs', label: 'Tarifs' },
]

export default function Nav() {
  const [solid, setSolid] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const onHome = pathname === '/'

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

  const href = (hash: string) => (onHome ? hash : `/${hash}`)

  return (
    <header
      className={`nav ${solid || open ? 'nav--solid' : ''} ${
        hidden && !open ? 'nav--hidden' : ''
      } ${open ? 'nav--open' : ''}`}
    >
      <div className="container nav__inner">
        <nav aria-label="Navigation principale">
          <ul className="nav__links">
            {LINKS.map((l) => (
              <li key={l.hash}>
                <a href={href(l.hash)} className="nav__link" onClick={() => setOpen(false)}>
                  {l.label}
                </a>
              </li>
            ))}
            <li className="nav__item--mobile">
              <a href={href('#reservation')} className="nav__link" onClick={() => setOpen(false)}>
                Réserver
              </a>
            </li>
          </ul>
        </nav>

        {onHome ? (
          <a href="#" className="monogram" aria-label="Harmonie Yacht — retour en haut">
            Hy
          </a>
        ) : (
          <Link to="/" className="monogram" aria-label="Harmonie Yacht — retour à l’accueil">
            Hy
          </Link>
        )}

        <div className="nav__actions">
          <a href={href('#reservation')} className="btn btn--light">
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
