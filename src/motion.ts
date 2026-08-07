import { useReducedMotion } from 'motion/react'
import type { Variants } from 'motion/react'

/* Timing « marée » : lent, ample, jamais sec — cf. DESIGN.md */
export const tide: [number, number, number, number] = [0.22, 1, 0.36, 1]

export function useTideReveal(delay = 0) {
  const reduced = useReducedMotion()
  return {
    initial: reduced ? undefined : { opacity: 0, y: 36 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' } as const,
    transition: { duration: 0.9, ease: tide, delay },
  }
}

export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: tide } },
}
