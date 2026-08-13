# Harmonie Yacht — Site vitrine (v2)

Site pour **Harmonie Yacht** : location privée d'un yacht avec skipper — sorties en mer
(2 h / 3 h / 4 h, avec ou sans capitaine) et nuits insolites à quai. Réservation en ligne
avec acompte de 30 % réglé par carte via Stripe.

Direction artistique v2 : « annuaire de régate contemporain + Méditerranée vue du ciel » —
océan bleu profond, typographie mixte (Instrument Sans + Instrument Serif italique dans les
titres), parcours en pointillés comme signature, photos réelles du bateau dans le héro et
les sections. Spec complète dans [`DESIGN.md`](./DESIGN.md).

## Stack

- [Vite](https://vitejs.dev) + React 19 + TypeScript + [React Router](https://reactrouter.com)
- [Motion](https://motion.dev) (`motion/react`) pour les animations
- [Stripe Checkout](https://stripe.com/docs/payments/checkout) via des fonctions serveur
  Vercel (`/api`), pour l'acompte de réservation
- Polices auto-hébergées via Fontsource : Instrument Sans + Instrument Serif
- CSS vanilla piloté par tokens (`src/styles.css`) — responsive mobile soigné

## Lancer le projet

```bash
npm install
npm run dev        # développement — http://localhost:5173 (front seul, /api indisponible)
npm run build      # build de production dans dist/
npm run preview    # prévisualiser le build (front seul, idem)
```

Pour tester le paiement en local avec les fonctions `/api`, utiliser la
[Vercel CLI](https://vercel.com/docs/cli) : `vercel dev` (nécessite d'être connecté au
projet Vercel et d'avoir `STRIPE_SECRET_KEY` dans `.env.local`).

## Configurer Stripe (paiement de l'acompte)

Le site encaisse un **acompte de 30 %** à la réservation ; le solde se règle directement
(à bord ou par virement). Deux fonctions serveur gèrent ça :

- `api/create-checkout-session.ts` — crée la session de paiement Stripe Checkout à partir
  d'un `priceId` (le montant n'est jamais accepté depuis le navigateur : il est recalculé
  côté serveur depuis `src/pricing.ts`, seule source de vérité des tarifs).
- `api/verify-session.ts` — revérifie côté serveur, au retour de Stripe, que le paiement a
  bien abouti avant d'afficher la confirmation sur `/merci`.

**Pour l'activer :**

1. Récupérer la clé secrète sur [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)
   (`sk_test_...` pour tester, `sk_live_...` en production).
2. Dans le projet Vercel → **Settings → Environment Variables**, ajouter
   `STRIPE_SECRET_KEY` avec cette valeur. Ne jamais la mettre dans le code ni dans un
   fichier commité — voir `.env.example`.
3. Redéployer. Le bouton « Payer l'acompte et réserver » devient fonctionnel ; tant que la
   clé n'est pas configurée, il affiche un message d'erreur propre avec un lien mailto de
   secours (aucune casse visible pour le visiteur).

Aucun produit/prix n'a besoin d'être créé dans le dashboard Stripe : les sessions sont
générées à la volée (`price_data`) à partir du catalogue `src/pricing.ts`. Chaque
réservation apparaît dans Stripe avec en métadonnées : formule, nom, email, date souhaitée,
nombre d'invités et message.

## À personnaliser avant mise en ligne

| Quoi | Où |
|---|---|
| Tarifs des sorties (2h/3h/4h, avec/sans capitaine) et de la nuit à quai | `src/pricing.ts` (source unique — recalculée côté serveur) et `src/experiences.ts` (copie affichée) |
| Taux de l'acompte (30 % par défaut) | `DEPOSIT_RATE` dans `src/pricing.ts` |
| Caractéristiques du yacht (8 invités, 4 couchages, 2 cabines… — à vérifier) | `src/components/Yacht.tsx` |
| Déroulés horaires (sortie / nuit) | `src/experiences.ts` |
| Port d'attache & disponibilité (méta du héro) | `src/components/Hero.tsx` |
| Avis clients (actuellement des exemples rédigés) | `src/experiences.ts` (`REVIEWS`) |
| Notifications pop-up (preuve sociale) | `src/components/SocialToast.tsx` |
| Photos | `public/images/` — `hero-bateau`, `sortie-bateau`, `nuit-bateau` et `calme-bateau` sont les vraies photos du bateau ; le reste est libre de droits (Unsplash/Pexels) en attendant vos photos |
| Email de contact | `src/components/Booking.tsx`, `Footer.tsx`, `api/*.ts` |

## Héro vidéo (optionnel)

Le héro accepte facilement une vidéo à la place de la photo : déposer un `.mp4` compressé
(idéalement < 8 Mo, 1080p) dans `public/`, puis remplacer le `<img>` de
`src/components/Hero.tsx` par un `<video autoplay muted loop playsinline poster="/images/hero-bateau.jpg">`.

## Déploiement

Projet Vite + fonctions serveur : déployer sur **Vercel** (détection automatique du
dossier `/api`). `vercel.json` redirige toutes les routes non-`/api` vers `index.html`
pour le routage côté client (React Router).
