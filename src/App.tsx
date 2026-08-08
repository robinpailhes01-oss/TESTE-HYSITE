import { useEffect } from 'react'
import Lenis from 'lenis'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Manifesto from './components/Manifesto'
import Experiences from './components/Experiences'
import Route from './components/Route'
import Yacht from './components/Yacht'
import Band from './components/Band'
import Offers from './components/Offers'
import Booking from './components/Booking'
import Footer from './components/Footer'

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

    /* Les ancres passent par Lenis pour garder l'inertie */
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

export default function App() {
  useSmoothScroll()

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Experiences />
        <Manifesto />
        <Route />
        <Yacht />
        <Band />
        <Offers />
        <Booking />
      </main>
      <Footer />
    </>
  )
}
