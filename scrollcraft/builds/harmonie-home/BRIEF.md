# BRIEF — harmonie-home

Build : refonte du scroll de la page d'accueil harmonie-yacht.fr (React Router SSG, Vercel).
Interviewé : Robin (propriétaire), 2026-08-25, dans le chat. Réponses verbatim.

## Interview

1. **Vibe (3-5 mots + références)** : « L'ambiance immersion, hotel de luxe et élégance. »
   (Pas de références média données.)
2. **Le parcours du scroll, dans ses mots** : « Le client voit le bateau dans son
   integralité, ensuite faire comme s'il se balade, voit l'extérieur avec la table
   puis l'intérieur du bateau lorsque l'on propose les nuits insolites. »
3. **Courbe d'énergie** : « Ça doit rester calme et chaleureux »
4. **Ressenti stage par stage / LE moment** : « Elle doit se sentir en train de vivre
   l'expérience avant d'être venu » (pas de moment unique nommé — le pic ci-dessous
   est proposé par nous, dérivé de « l'intérieur du bateau lorsque l'on propose les
   nuits insolites »).
5. **Une chose jamais vue ailleurs** : non répondu — signature auto-proposée (voir plus bas).
6. **Distance au premium-minimal** : non répondu explicitement ; « hôtel de luxe et
   élégance » → premium-minimal chaleureux assumé (la seule famille cohérente avec la réponse 1).
7. **Monde continu ou scènes ?** : « J'aimerais bien un monde continue mais je ne sais
   pas fait ce qui semble le mieux »
8. **Assets** : « Oui essaye au mieux de partir des photos que j'ai mis a disposition »
   — 16 vraies photos dans public/images (bateau, pont, salon, nuit, petit-déjeuner).
   Clé KIE fournie pour animer.

Questions 5 et 6 non répondues : sections marquées comme auto-proposées, le reste interviewé.

## La courbe émotionnelle

1. **Quiétude** — le bateau entier sur l'eau calme au couchant, la caméra avance
   doucement sous la main (scrub). L'horloge du bord affiche 17 h 30.
2. **Curiosité** — on monte à bord : la lisse au couchant tient l'écran pendant que
   les lignes du texte arrivent l'une après l'autre (pin). 18 h 00, embarquement.
3. **Liberté** — le large : les expériences défilent latéralement, efoil, paddle,
   plateau en famille (pan). L'heure dorée.
4. **Suspension** — la nuit tombe : écran presque vide, fond très sombre, une seule
   ligne. **Silence volontaire** (à distinguer du dead scroll : cet acte est voulu
   comme quasi vide, une ligne seule au centre). 21 h 30.
5. **Intimité — LE PIC** — le salon éclairé chaud, la table dressée « Amour », la
   caméra glisse dans la pièce (scrub, le plus grand span de la page). 23 h 00.
6. **Douceur** — le réveil : un volet révèle le petit-déjeuner servi sur le pont au
   soleil du matin (reveal). 10 h 00.
7. **Confiance** — choisir sa formule : les deux expériences, les avis Google réels
   (sections flow existantes, compressées).
8. **Résolution** — réserver : une ligne, un bouton, ça tient à l'écran.

Aucun couple d'actes adjacents ne partage la même émotion.

## Le pic

Acte 5. La phrase qu'un visiteur dirait à un ami :

> « Tu scrolles, la nuit tombe sur la page, et d'un coup t'es dans le salon du yacht
> à la bougie — j'avais l'impression d'y être déjà. »

Il reçoit : le meilleur clip généré (salon), le silence de l'acte 4 juste avant,
et le plus grand span de la page (3.4vh, dwell 0.35).

## La phrase tell-someone

> « C'est le site où, en scrollant, tu vis ta soirée à bord heure par heure :
> le jour tombe pendant que tu descends la page, jusqu'au petit-déjeuner au soleil. »

## La signature (auto-proposée, seed = réponse 2 « comme s'il se balade »)

**L'heure du bord** : un petit cadran fixe, discret, en bas de l'écran pendant toute
la séquence immersive. Il affiche l'heure de la soirée (17 h 30 → 18 h 00 → 21 h 30 →
23 h 00 → 10 h 00) pilotée par le scroll, calée sur le vrai déroulé de la Nuit
Prestige (18 h embarquement, coucher de soleil, 23 h nuit à bord, 10 h petit-déjeuner
— données réelles de src/experiences.ts). Le fond de page dérive avec lui, du bleu du
soir au noir de la nuit. Codé dans la page (JS local lisant --sc-p), pas dans le moteur.
Il disparaît quand la séquence rend la main au contenu classique.

## Silences volontaires

- Acte 4 (Suspension) : écran quasi vide voulu, une ligne seule, fond nuit.

## Grammaire

Filmic one-shot (voir rapport : pourquoi les 7 autres perdent). Le registre
FINGERPRINTS.md est vide — premier build, gate trivialement passé.
