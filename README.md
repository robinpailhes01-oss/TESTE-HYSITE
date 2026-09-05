# Harmonie Yacht — Site vitrine (v2)

Site pour **Harmonie Yacht** : location privée d'un yacht avec skipper — sorties en mer
(2 h / 3 h / 4 h, avec ou sans capitaine) et nuits insolites à quai. Réservation en ligne
avec acompte de 30 % réglé par carte via SumUp.

Direction artistique v2 : « annuaire de régate contemporain + Méditerranée vue du ciel » —
océan bleu profond, typographie mixte (Instrument Sans + Instrument Serif italique dans les
titres), parcours en pointillés comme signature, photos réelles du bateau dans le héro et
les sections. Spec complète dans [`DESIGN.md`](./DESIGN.md).

## Stack

- [Vite](https://vitejs.dev) + React 19 + TypeScript + [React Router](https://reactrouter.com)
- [Motion](https://motion.dev) (`motion/react`) pour les animations
- [SumUp Online Payments](https://developer.sumup.com/online-payments) via des fonctions
  serveur Vercel (`/api`), pour l'acompte de réservation
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
projet Vercel et d'avoir `SUMUP_API_KEY`, `SUMUP_MERCHANT_CODE` et
`SUPABASE_SERVICE_ROLE_KEY` dans `.env.local`).

## Configurer SumUp (paiement de l'acompte)

Le site encaisse un **acompte de 30 %** à la réservation, sur le compte SumUp d'Harmonie
Group ; le solde se règle directement à bord. Deux fonctions serveur gèrent ça :

- `api/create-checkout.ts` — écrit l'intention de réservation dans
  `pending_checkouts`, puis crée le checkout SumUp et renvoie l'URL de la page de paiement
  hébergée. Le montant n'est jamais accepté depuis le navigateur : il est recalculé côté
  serveur depuis `src/pricing.ts`, seule source de vérité des tarifs.
- `api/verify-checkout.ts` — au retour sur `/merci`, relit le statut du checkout chez SumUp
  avant d'afficher la confirmation.

SumUp ne transporte aucune métadonnée libre (contrairement à Stripe auparavant) : ce que le
client a choisi est écrit **avant** le paiement dans `public.pending_checkouts`, et relu par
le webhook une fois l'encaissement confirmé. Cette table est en RLS sans aucune policy :
seul le `service_role` y accède.

**Pour l'activer :**

1. Créer une clé API SumUp : [me.sumup.com](https://me.sumup.com) → profil → **Settings →
   For Developers → Toolkit → API Keys**. La clé commence par `sup_sk_`.
2. Relever le **code marchand** (`MCxxxxxx`) dans les paramètres du profil SumUp.
3. Dans le projet Vercel → **Settings → Environment Variables**, ajouter :
   - `SUMUP_API_KEY` — la clé `sup_sk_...`.
   - `SUMUP_MERCHANT_CODE` — le code marchand.
   - `SUPABASE_SERVICE_ROLE_KEY` — clé `service_role` du projet Supabase, pour écrire
     l'intention de réservation.
   Ne jamais les mettre dans le code ni dans un fichier commité — voir `.env.example`.
4. Redéployer. Tant que ces variables manquent, le bouton « Payer l'acompte et réserver »
   affiche un message d'erreur propre avec un lien mailto de secours (aucune casse visible
   pour le visiteur).

Le compte SumUp doit être **entièrement validé** et les paiements en ligne activés : ils ne
le sont pas par défaut sur un compte neuf.

## Coordination avec le tableau de bord (Supabase) — après paiement

Dès qu'un acompte est payé, `supabase-functions/sumup-webhook/index.ts` (déployée sur le
projet Supabase `harmonie-yacht`, function `sumup-webhook`) prend le relais :

1. Relit le checkout **chez SumUp** avec la clé secrète et vérifie que son statut est `PAID`
   et que le montant encaissé correspond à l'acompte attendu. C'est cette relecture, et non
   le corps du callback, qui fait foi — elle remplace la signature que Stripe fournissait.
2. Retrouve ou crée le client dans `customers`.
3. Insère la réservation dans `bookings` — **exactement la même table que le tableau de
   bord**, donc elle apparaît immédiatement, éditable comme n'importe quelle réservation
   créée manuellement.
4. Cette insertion déclenche automatiquement (triggers déjà en place, rien à faire) :
   - la création de l'événement **Google Calendar** ;
   - l'enregistrement de l'acompte encaissé dans la compta (`revenues`) ;
   - le rattachement au `lead` correspondant, marqué `booked`.
5. Envoie l'**email de confirmation** au client (montant payé, solde restant, lieu de
   rendez-vous, politique de retard) via Resend — même expéditeur que le reste du système.

Le **solde restant** (`balance_due`) se règle comme aujourd'hui, directement à bord —
c'est vous qui l'enregistrez dans le tableau de bord le jour J (`balance_payments`),
rien ne change de ce côté.

**Pour activer cette coordination :**

1. Dans **Supabase → Project Settings → Edge Functions → Secrets**, ajouter
   `SUMUP_API_KEY` — la même valeur que dans Vercel. (`SUPABASE_URL`,
   `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `RESEND_FROM` sont déjà configurés,
   partagés avec les autres fonctions du projet.)
2. Rien à déclarer côté SumUp : l'URL de callback est passée à chaque checkout
   (`return_url`), il n'y a pas d'endpoint à enregistrer dans un tableau de bord.
3. La fonction est déployée avec `verify_jwt = false` — SumUp ne peut pas présenter de JWT
   Supabase. L'appel est authentifié par la relecture du paiement, pas par un en-tête.

La fonction est idempotente (colonne `bookings.payment_ref`, unique) : si le callback est
rejoué, la deuxième tentative est ignorée sans dupliquer la réservation.

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
