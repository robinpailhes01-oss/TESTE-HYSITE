import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLocation } from 'react-router'
import Lenis from 'lenis'
import '@fontsource/instrument-sans/400.css'
import '@fontsource/instrument-sans/500.css'
import '@fontsource/instrument-sans/600.css'
/* Jost, variable : une géométrique fine, façon Futura, le registre des
   chantiers navals. Retenue par le client contre la Didone, jugée trop
   « mode » ; voir branding/brand.md. Droit et italique. */
import '@fontsource-variable/jost/wght.css'
import '@fontsource-variable/jost/wght-italic.css'
import './styles.css'
import './calme.css'
import './craft.css'
import { useBreath } from './breath'
import { setLenis } from './lenisRef'
/* Le sol de chaque page, posé sur <html> au rendu — donc pré-rendu dans le HTML
   statique : la page nuit arrive noire, sans flash de papier. */
import { groundFor } from './ground'
import { useMagnet } from './magnet'
import { srcSet } from './pic'
import Nav from './components/Nav'
import Footer from './components/Footer'
import ReviewToast from './components/ReviewToast'
import WhatsAppButton from './components/WhatsAppButton'
import LeadMagnet from './components/LeadMagnet'

export const SITE_URL = 'https://harmonie-yacht.fr'
export const SITE_NAME = 'Harmonie Yacht'

/* Titre/description par défaut — chaque route les remplace via son propre
   export `meta()`. Sert de filet si une page oublie d'en déclarer un. */
export function meta() {
  return [
    { title: `${SITE_NAME} — Location privée d'un yacht avec skipper à Carnon` },
    {
      name: 'description',
      content:
        "Location privée d'un yacht avec skipper à Carnon (Hérault) : sorties en mer à la demi-journée et nuits à bord. Réservation en ligne, acompte de 30 %.",
    },
    { property: 'og:site_name', content: SITE_NAME },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: `${SITE_URL}/images/og-yacht.jpg` },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { name: 'theme-color', content: '#F3F1EB' },
  ]
}

export function links() {
  return [
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
    /* La photo d'accroche est le plus grand élément peint : on la demande
       avant même que le CSS l'ait découverte. */
    {
      rel: 'preload',
      as: 'image',
      imageSrcSet: srcSet('/images/soir-1-couchant.webp'),
      imageSizes: '100vw',
    },
  ]
}

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  return (
    <html lang="fr" data-ground={groundFor(pathname)}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

/* Défilement inertiel « butter-smooth » — désactivé si reduced-motion */
function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    /* Au doigt, le défilement natif est déjà inertiel : Lenis n'y ajoute
       qu'une boucle par image, et la scène de l'accueil en a déjà une. */
    if (window.matchMedia('(pointer: coarse)').matches) return

    document.documentElement.style.scrollBehavior = 'auto'
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    })
    /* Partagée : un geste direct doit pouvoir lui dire « la cible c'est ici,
       maintenant », sinon il continue d'animer vers l'ancienne. */
    setLenis(lenis)

    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    /* Les ancres locales passent par Lenis pour garder l'inertie */
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null
      if (!link) return
      const hash = link.getAttribute('href')
      if (!hash || hash === '#') {
        e.preventDefault()
        lenis.scrollTo(0, { duration: 1.4 })
        return
      }
      const target = document.querySelector(hash)
      if (!target) return
      e.preventDefault()
      lenis.scrollTo(target as HTMLElement, { offset: -72, duration: 1.4 })
    }
    document.addEventListener('click', onClick)

    return () => {
      document.removeEventListener('click', onClick)
      cancelAnimationFrame(raf)
      setLenis(null)
      lenis.destroy()
      document.documentElement.style.scrollBehavior = ''
    }
  }, [])
}

export default function Root() {
  useSmoothScroll()
  useBreath()
  useMagnet()
  const { pathname } = useLocation()

  /* Signal de disponibilité lu par le harnais de captures (scrollcraft) : il
     attend cette classe avant de commencer à échantillonner, pour ne pas
     photographier la page avant que le défilement soit câblé. */
  useEffect(() => {
    document.documentElement.classList.add('sc-ready')
  }, [])

  return (
    <>
      <Nav />
      {/* Clé sur le chemin : chaque page arrive par le même fondu court. */}
      <div className="page-in" key={pathname}>
        <Outlet />
      </div>
      <Footer />
      <ReviewToast />
      <WhatsAppButton />
      <LeadMagnet />
    </>
  )
}
