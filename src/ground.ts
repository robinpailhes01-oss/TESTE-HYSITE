/* Le sol de chaque route. Dans son propre module : root.tsx et les composants
   de page en ont besoin tous les deux, et un composant qui importe root.tsx
   ferme un cycle (root → routes → composant → root) que le bundler refuse. */
export function groundFor(pathname: string): 'day' | 'night' {
  return pathname.startsWith('/nuit-a-bord') ? 'night' : 'day'
}
