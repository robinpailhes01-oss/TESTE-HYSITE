import { useEffect, useState } from 'react'

const LINKS = [
  { href: '#prestations', label: 'Prestations' },
  { href: '#abord', label: 'À bord' },
  { href: '#yacht', label: 'Le yacht' },
  { href: '#tarifs', label: 'Tarifs' },
]

export default function Nav() {
  const [solid, setSolid] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setSolid(y > 40)
      /* La nav s'efface quand on descend, revient dès qu'on remonte */
      setHidden(y > lastY && y > 160)
      lastY = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
              <li key={l.href}>
                <a href={l.href} className="nav__link" onClick={() => setOpen(false)}>
                  {l.label}
                </a>
              </li>
            ))}
            <li className="nav__item--mobile">
              <a href="#reservation" className="nav__link" onClick={() => setOpen(false)}>
                Réserver
              </a>
            </li>
          </ul>
        </nav>

        <a href="#" className="monogram" aria-label="Harmonie Yacht — retour en haut">
          Hy
        </a>

        <div className="nav__actions">
          <a href="#reservation" className="btn btn--light">
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
