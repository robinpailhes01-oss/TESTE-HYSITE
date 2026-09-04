import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router'
import Lenis from 'lenis'
import '@fontsource/instrument-sans/400.css'
import '@fontsource/instrument-sans/500.css'
import '@fontsource/instrument-sans/600.css'
import '@fontsource/instrument-serif/400.css'
import '@fontsource/instrument-serif/400-italic.css'
import './styles.css'
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
        "Location privée d'un yacht avec skipper à Carnon (Hérault) : sorties en mer à la demi-journée et nuits à bord. Réservation sur demande, règlement à bord.",
    },
    { property: 'og:site_name', content: SITE_NAME },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: `${SITE_URL}/images/og-yacht.jpg` },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { name: 'theme-color', content: '#1A4C74' },
  ]
}

export function links() {
  return [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }]
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
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

    document.documentElement.style.scrollBehavior = 'auto'
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    })

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
      lenis.destroy()
      document.documentElement.style.scrollBehavior = ''
    }
  }, [])
}

export default function Root() {
  useSmoothScroll()

  return (
    <>
      <Nav />
      <Outlet />
      <Footer />
      <ReviewToast />
      <WhatsAppButton />
      <LeadMagnet />
    </>
  )
}
