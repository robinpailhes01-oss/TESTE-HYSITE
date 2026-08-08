import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ease } from '../motion'

type Props = {
  src: string
  alt: string
  className?: string
}

/* Révélation « rideau » : le cache monte pendant que l'image se pose (1.12 -> 1).
   Déclenchée par un IntersectionObserver dédié pour rester déterministe. */
export default function RevealImage({ src, alt, className }: Props) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          obs.disconnect()
        }
      },
      { rootMargin: '-60px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  if (reduced) {
    return (
      <div className={className}>
        <img src={src} alt={alt} loading="lazy" />
      </div>
    )
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      animate={{ clipPath: shown ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)' }}
      transition={{ duration: 1.15, ease }}
    >
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        initial={false}
        animate={{ scale: shown ? 1 : 1.12 }}
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 1.7, ease }}
      />
    </motion.div>
  )
}
