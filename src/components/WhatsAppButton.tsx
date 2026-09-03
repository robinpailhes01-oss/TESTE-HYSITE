import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { WHATSAPP_URL } from '../whatsapp'

/* ---------------------------------------------------------------------------
   WhatsApp, à la charte.

   Plus de pastille verte ni d'ombre portée posée sur la palette : une pilule
   qui est l'inverse du sol courant (noir sur papier, os sur nuit), le glyphe
   en couleur courante. Elle paraît une fois le premier écran passé — en
   position fixe dès le départ, elle chevaucherait le titre sur téléphone.

   Sur les pages d'expérience, au téléphone, elle rejoint une barre basse avec
   « Réserver » : les deux actions qui comptent, à portée de pouce, sans
   remonter la page. Sur l'accueil on ne réserve pas (on choisit d'abord) :
   la pilule reste seule.
--------------------------------------------------------------------------- */

const RESERVABLE = new Set(['/sortie-en-mer-carnon', '/nuit-a-bord-yacht-carnon'])

export function WhatsAppGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.45 1.33 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.5 0 9.96-4.46 9.96-9.96S17.54 2 12.04 2Zm5.8 14.24c-.24.68-1.4 1.3-1.93 1.36-.5.06-1.03.26-3.43-.72-2.9-1.19-4.76-4.14-4.9-4.33-.14-.19-1.17-1.56-1.17-2.98 0-1.41.74-2.11 1-2.4.26-.29.57-.36.76-.36h.55c.18 0 .42-.02.64.49.24.57.81 1.97.88 2.11.07.14.12.31.02.5-.1.19-.15.3-.29.47-.14.16-.3.36-.43.48-.14.14-.29.29-.13.57.17.29.75 1.24 1.62 2.01 1.11.99 2.05 1.3 2.34 1.44.29.14.46.12.63-.07.17-.19.72-.84.92-1.13.19-.29.38-.24.64-.14.26.1 1.66.78 1.94.93.29.14.48.21.55.33.07.12.07.68-.17 1.35Z" />
    </svg>
  )
}

export default function WhatsAppButton() {
  const [visible, setVisible] = useState(false)
  const { pathname } = useLocation()
  const reservable = RESERVABLE.has(pathname.replace(/\/$/, ''))

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setVisible(window.scrollY > window.innerHeight * 0.6))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className={`dock${visible ? ' is-visible' : ''}${reservable ? ' dock--reservable' : ''}`}>
      {reservable ? (
        <a className="btn dock__book" href="#reservation">
          Réserver
        </a>
      ) : null}
      <a
        className="wa-fab"
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Écrire sur WhatsApp — réponse en moins de 5 minutes"
      >
        <WhatsAppGlyph />
        <span className="wa-fab__label">
          WhatsApp<span className="wa-fab__sub">réponse &lt; 5 min</span>
        </span>
      </a>
    </div>
  )
}
