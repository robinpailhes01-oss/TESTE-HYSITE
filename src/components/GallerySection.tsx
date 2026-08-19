import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ease, useReveal } from '../motion'

const SHOTS = [
  { src: '/images/hero-bateau.jpg', alt: 'Le yacht au soleil couchant', cls: 'gal__a' },
  { src: '/images/sortie-bateau.jpg', alt: 'Au mouillage, eau turquoise', cls: 'gal__b' },
  { src: '/images/nuit-petit-dejeuner-pont.jpg', alt: 'Petit-déjeuner sur le pont au réveil, face au port de Carnon', cls: 'gal__c' },
  { src: '/images/nuit-bateau.jpg', alt: 'Le soir tombe sur le yacht', cls: 'gal__d' },
  { src: '/images/sortie-carre.jpg', alt: 'Vu depuis l’eau', cls: 'gal__e' },
  { src: '/images/sortie-coucher-soleil-poupe.jpg', alt: 'Coucher de soleil depuis le pont, face à Carnon', cls: 'gal__f' },
]

export default function GallerySection() {
  const head = useReveal()
  const grid = useReveal(0.1)
  const [open, setOpen] = useState<number | null>(null)

  const prev = useCallback(
    () => setOpen((i) => (i === null ? null : (i + SHOTS.length - 1) % SHOTS.length)),
    [],
  )
  const next = useCallback(() => setOpen((i) => (i === null ? null : (i + 1) % SHOTS.length)), [])

  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null)
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, prev, next])

  return (
    <section className="section" id="galerie">
      <div className="container">
        <motion.div className="section-head" {...head}>
          <p className="kicker">Galerie</p>
          <h2 className="mixed">
            À bord, <span className="it">en images</span>
          </h2>
        </motion.div>

        <motion.div className="gal" {...grid}>
          {SHOTS.map((s, i) => (
            <button
              type="button"
              className={`gal__item ${s.cls}`}
              key={s.src}
              onClick={() => setOpen(i)}
              aria-label={`Agrandir : ${s.alt}`}
            >
              <img src={s.src} alt={s.alt} loading="lazy" />
            </button>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {open !== null ? (
          <motion.div
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label="Galerie photo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease }}
            onClick={() => setOpen(null)}
          >
            <motion.img
              key={SHOTS[open].src}
              src={SHOTS[open].src}
              alt={SHOTS[open].alt}
              initial={{ opacity: 0, scale: 0.965 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, ease }}
              onClick={(e) => e.stopPropagation()}
            />
            <p className="lightbox__caption">{SHOTS[open].alt}</p>
            <button
              className="lightbox__btn lightbox__close"
              aria-label="Fermer"
              onClick={() => setOpen(null)}
            >
              ×
            </button>
            <button
              className="lightbox__btn lightbox__prev"
              aria-label="Photo précédente"
              onClick={(e) => {
                e.stopPropagation()
                prev()
              }}
            >
              ←
            </button>
            <button
              className="lightbox__btn lightbox__next"
              aria-label="Photo suivante"
              onClick={(e) => {
                e.stopPropagation()
                next()
              }}
            >
              →
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  )
}
