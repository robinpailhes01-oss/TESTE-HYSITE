# Harmonie Yacht — Site vitrine (v2)

Site one-page pour **Harmonie Yacht** : location privée d'un yacht avec skipper —
sorties en mer à la journée et nuits insolites à quai.

Direction artistique v2 : « annuaire de régate contemporain + Méditerranée vue du ciel » —
océan bleu profond, typographie mixte (Instrument Sans + Instrument Serif italique dans les
titres), parcours en pointillés comme signature, photos réelles du bateau dans le héro et
les sections. Spec complète dans [`DESIGN.md`](./DESIGN.md).

## Stack

- [Vite](https://vitejs.dev) + React 19 + TypeScript
- [Motion](https://motion.dev) (`motion/react`) pour les animations
- Polices auto-hébergées via Fontsource : Instrument Sans + Instrument Serif
- CSS vanilla piloté par tokens (`src/styles.css`) — responsive mobile soigné

## Lancer le projet

```bash
npm install
npm run dev        # développement — http://localhost:5173
npm run build      # build de production dans dist/
npm run preview    # prévisualiser le build
```

## À personnaliser avant mise en ligne

| Quoi | Où |
|---|---|
| Tarifs (890 € / 490 € — placeholders) et inclusions | `src/components/Offers.tsx` |
| Caractéristiques du yacht (8 invités, 4 couchages, 2 cabines… — à vérifier) | `src/components/Yacht.tsx` |
| Déroulés horaires (journée / nuit) | `src/components/Route.tsx` |
| Port d'attache & disponibilité (méta du héro) | `src/components/Hero.tsx` |
| Photos | `public/images/` — `hero-bateau`, `sortie-bateau` et `calme-bateau` sont les vraies photos du bateau ; `eau`, `plage`, `champagne`, `soir`, `hero-aerial` sont des images libres de droits (Unsplash/Pexels) en attendant les vôtres |
| Email de contact | `src/components/Booking.tsx` et `Footer.tsx` |

Le formulaire de réservation ouvre le client mail du visiteur (`mailto:` vers
harmonieyacht@gmail.com) — aucun backend requis. Pour recevoir les demandes sans passer par
le client mail, brancher un service type Formspree/Basin sur le `onSubmit`.

## Héro vidéo (optionnel)

Le héro accepte facilement une vidéo à la place de la photo : déposer un `.mp4` compressé
(idéalement < 8 Mo, 1080p) dans `public/`, puis remplacer le `<img>` de
`src/components/Hero.tsx` par un `<video autoplay muted loop playsinline poster="/images/hero-bateau.jpg">`.

## Déploiement

Site 100 % statique : `npm run build` puis déployer `dist/` sur Vercel, Netlify ou tout
hébergeur statique.
