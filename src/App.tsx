import { useEffect } from 'react'
import { Route as RouterRoute, Routes } from 'react-router-dom'
import Lenis from 'lenis'
import Nav from './components/Nav'
import Footer from './components/Footer'
import SocialToast from './components/SocialToast'
import Home from './pages/Home'
import ExperiencePage from './pages/ExperiencePage'

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

export default function App() {
  useSmoothScroll()

  return (
    <>
      <Nav />
      <Routes>
        <RouterRoute path="/" element={<Home />} />
        <RouterRoute path="/:slug" element={<ExperiencePage />} />
      </Routes>
      <Footer />
      <SocialToast />
    </>
  )
}
