import { useReducedMotion } from 'motion/react'
import type { Variants } from 'motion/react'

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

export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
}
