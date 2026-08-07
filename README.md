# Harmonie Yacht — Site vitrine

Site one-page premium pour **Harmonie Yacht** : location privée d'un yacht avec skipper —
sorties en mer à la journée et nuits insolites à quai.

Direction artistique : « la retenue hôtelière d'un Aman Resort + les matériaux d'un Riva
classique (teck, laiton, laque de nuit) ». La spec complète (positionnement, tokens,
signature) est dans [`DESIGN.md`](./DESIGN.md).

## Stack

- [Vite](https://vitejs.dev) + React 19 + TypeScript
- [Motion](https://motion.dev) (`motion/react`) pour les animations « timing de marée »
- Polices auto-hébergées via Fontsource : Cormorant Garamond (display) + Jost (corps)
- CSS vanilla piloté par tokens (`src/styles.css`) — aucun framework CSS

## Lancer le projet

```bash
npm install
npm run dev        # développement — http://localhost:5173
npm run build      # build de production dans dist/
npm run preview    # prévisualiser le build
```

## À personnaliser avant mise en ligne

Ces valeurs sont des **placeholders réalistes**, à remplacer par les vraies données :

| Quoi | Où |
|---|---|
| Tarifs (890 € / 490 €) et inclusions | `src/components/Offers.tsx` |
| Caractéristiques du yacht (8 invités, 4 couchages, 2 cabines…) | `src/components/Yacht.tsx` |
| Déroulés horaires (journée / nuit) | `src/components/Timeline.tsx` |
| Citation d'invité (exemple rédactionnel) | `src/components/Quote.tsx` |
| Photos — images libres de droits Unsplash/Pexels en attendant les vraies photos du bateau | `public/images/` |
| Email de contact | `src/components/Booking.tsx` et `Footer.tsx` |

Le formulaire de réservation ouvre le client mail du visiteur (`mailto:` vers
harmonieyacht@gmail.com) — aucun backend requis. Pour recevoir les demandes sans passer
par le client mail, brancher un service type Formspree/Basin sur le `onSubmit`.

## Déploiement

Le site est 100 % statique : `npm run build` puis déployer `dist/` sur Vercel, Netlify ou
n'importe quel hébergeur statique.
