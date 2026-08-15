import type { Config } from '@react-router/dev/config'
import { PUBLIC_PATHS } from './seo-paths.mjs'

/* Mode SSG : chaque page est pré-rendue en HTML statique au build (pas de
   serveur SSR à faire tourner) — c'est ce qui fait apparaître le contenu
   réel (tarifs, descriptions) dans la réponse brute que lisent Google et
   les robots d'IA, exigence n°1 du cahier des charges SEO/GEO.

   Les anciennes adresses (site Lovable + versions précédentes de ce site)
   sont redirigées en 301 au niveau de vercel.json (edge, avant même
   d'atteindre l'app) — voir ce fichier pour la liste. */
export default {
  appDirectory: 'src',
  ssr: false,
  async prerender() {
    return [...PUBLIC_PATHS, '/merci']
  },
} satisfies Config
