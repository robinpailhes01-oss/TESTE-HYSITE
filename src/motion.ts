import { useReducedMotion } from 'motion/react'
import type { Variants } from 'motion/react'

/* Easing « marée » : lent, assuré, jamais de rebond */
export const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

export function useReveal(delay = 0) {
  const reduced = useReducedMotion()
  return {
    initial: reduced ? undefined : { opacity: 0, y: 32 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' } as const,
    transition: { duration: 0.8, ease, delay },
  }
}

/* Révélation « mise au point » : flou -> net, pour les textes clés */
export function useFocusReveal(delay = 0) {
  const reduced = useReducedMotion()
  return {
    initial: reduced ? undefined : { opacity: 0, filter: 'blur(10px)', y: 18 },
    whileInView: { opacity: 1, filter: 'blur(0px)', y: 0 },
    viewport: { once: true, margin: '-100px' } as const,
    transition: { duration: 1.1, ease, delay },
  }
}

export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
}

/* Révélation mot à mot depuis un masque (héro) */
export const wordContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.35 } },
}

export const wordUp: Variants = {
  hidden: { y: '120%' },
  show: { y: '0%', transition: { duration: 1.1, ease } },
}
