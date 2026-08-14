import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ease } from '../motion'

type Props = {
  src: string
  alt: string
  className?: string
}

/* Révélation « rideau » : le cache monte pendant que l'image se pose (1.12 -> 1).
   Déclenchée par un IntersectionObserver dédié pour rester déterministe.

   Important : l'observateur surveille un div NU (sans clip-path), pas
   l'élément animé lui-même. Un clip-path quasi nul (inset(100%), l'état
   masqué initial) fait tomber le ratio d'intersection Chromium à 0 même
   quand l'élément est bien à l'écran — observer l'élément qu'on masque
   soi-même crée un blocage : jamais visible, donc jamais détecté comme
   visible, donc jamais révélé. */
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
    <div ref={ref} className={className}>
      <motion.div
        initial={false}
        animate={{ clipPath: shown ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)' }}
        transition={{ duration: 1.15, ease }}
        style={{ width: '100%', height: '100%' }}
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
    </div>
  )
}
