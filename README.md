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

## Coordination avec le tableau de bord (Supabase) — après paiement

Dès qu'un acompte est payé, `supabase-functions/stripe-webhook/index.ts` (déployée sur le
projet Supabase `harmonie-yacht`, function `stripe-webhook`) prend le relais :

1. Retrouve ou crée le client dans `customers`.
2. Insère la réservation dans `bookings` — **exactement la même table que le tableau de
   bord**, donc elle apparaît immédiatement, éditable comme n'importe quelle réservation
   créée manuellement.
3. Cette insertion déclenche automatiquement (triggers déjà en place, rien à faire) :
   - la création de l'événement **Google Calendar** ;
   - l'enregistrement de l'acompte encaissé dans la compta (`revenues`) ;
   - le rattachement au `lead` correspondant, marqué `booked`.
4. Envoie l'**email de confirmation** au client (montant payé, solde restant, lieu de
   rendez-vous, politique de retard) via Resend — même expéditeur que le reste du système.

Le **solde restant** (`balance_due`) se règle comme aujourd'hui, directement à bord —
c'est vous qui l'enregistrez dans le tableau de bord le jour J (`balance_payments`),
rien ne change de ce côté.

**Pour activer cette coordination :**

1. Dans **Stripe → Developers → Webhooks → Add endpoint**, renseigner :
   - URL : `https://szdfpjyytwedhochvzfd.supabase.co/functions/v1/stripe-webhook`
   - Événement à écouter : `checkout.session.completed`
   - Copier le secret de signature généré (`whsec_...`).
2. Dans **Supabase → Project Settings → Edge Functions → Secrets**, ajouter :
   - `STRIPE_SECRET_KEY` — la même valeur que dans Vercel.
   - `STRIPE_WEBHOOK_SECRET` — le `whsec_...` de l'étape 1.
   - (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `RESEND_FROM` sont déjà
     configurés — partagés avec les autres fonctions du projet.)
3. Tester en mode test Stripe (carte `4242 4242 4242 4242`) avant de passer en clé live.

La fonction est idempotente (colonne `bookings.stripe_session_id`, unique) : si Stripe
renvoie deux fois le même événement, la deuxième tentative est ignorée sans dupliquer la
réservation.

## À personnaliser avant mise en ligne

| Quoi | Où |
|---|---|
| Tarifs des sorties (2h/3h/4h, avec/sans capitaine) et de la nuit à quai | `src/pricing.ts` (source unique — recalculée côté serveur) et `src/experiences.ts` (copie affichée) |
| Taux de l'acompte (30 % par défaut) | `DEPOSIT_RATE` dans `src/pricing.ts` |
| Caractéristiques du yacht (8 invités, 4 couchages, 2 cabines… — à vérifier) | `src/components/Yacht.tsx` |
| Déroulés horaires (sortie / nuit) | `src/experiences.ts` |
| Port d'attache & disponibilité (méta du héro) | `src/components/Hero.tsx` |
| Lien vers les avis Google | `src/experiences.ts` (`GOOGLE_REVIEWS_URL`) |
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
