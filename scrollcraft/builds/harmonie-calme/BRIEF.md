# BRIEF — harmonie-calme

Deuxième passe sur la page d'accueil harmonie-yacht. La première
(`harmonie-home`) a été jugée trop lourde et retirée de la production : elle
remplaçait la page par un prologue de six actes et deux vidéos scrubbées.
Celle-ci part de la consigne inverse.

Interviewé : Robin (propriétaire), 2026-08-25. Réponses verbatim, y compris
celles reprises du premier brief quand elles n'ont pas changé.

## Interview

1. **Vibe** : « rendre le site internet encore plus design (…) minimaliste et
   élégant tel un hôtel de luxe ». (Premier brief : « L'ambiance immersion,
   hotel de luxe et élégance. ») Aucune référence média donnée.
2. **Parcours** : inchangé — le site garde sa structure actuelle. La consigne
   porte sur la manière, pas sur l'ordre : « un scroll léger simplement pour
   avoir une meilleure expérience client ».
3. **Énergie** : « Ça doit rester calme et chaleureux » (premier brief),
   confirmé et durci par « scroll léger ».
4. **Ressenti / LE moment** : « Elle doit se sentir en train de vivre
   l'expérience avant d'être venu » (premier brief). Le moment unique n'a pas
   été nommé par Robin ; proposé ci-dessous.
5. **Une chose jamais vue ailleurs** : non répondu. Signature auto-proposée.
6. **Distance au premium-minimal** : répondu cette fois, sans ambiguïté —
   « minimaliste et élégant tel un hôtel de luxe ». Premium-minimal assumé,
   c'est le seul point de la grille qui colle.
7. **Monde continu ou scènes ?** : tranché par la consigne « scroll léger » et
   par le retrait de la v1 — ni l'un ni l'autre. La page reste un document.
8. **Assets** : les vraies photos déjà en ligne. Aucune génération demandée
   cette fois, et aucune faite (0 crédit dépensé) : la v1 avait déjà montré que
   la vidéo était le poids de trop.

## La courbe émotionnelle

Elle porte sur la page entière, pas sur une séquence ajoutée.

1. **Calme** — le héro arrive sans effet d'annonce, la photo respire quand on
   s'arrête de scroller.
2. **Attention** — la promesse, texte large, beaucoup d'air autour.
3. **Désir** — les deux prestations, images révélées au rideau (existant).
4. **Suspension — LE PIC** — un seul plan tenu de toute la page : le couchant
   vu du pont s'immobilise pendant que deux phrases se relaient.
5. **Confiance** — le yacht, les vrais avis Google.
6. **Résolution** — la réservation, inchangée.

Aucun couple d'actes adjacents ne partage la même émotion.

## Le pic

Acte 4, « Le moment ». C'est le seul endroit de la page où le défilement
s'arrête. La phrase qu'un visiteur dirait à un ami :

> « À un moment la page s'arrête sur un coucher de soleil et te laisse le
> regarder. »

Il reçoit : la plus belle photo disponible, le seul plan épinglé du site, et le
plus grand espace de défilement (2,6 hauteurs d'écran contre ~0,6 pour la
bande qu'il remplace).

## La phrase tell-someone

> « C'est le site qui se met à respirer quand tu arrêtes de scroller. »

## La signature — « Le souffle » (auto-proposée)

Tout le reste du kit est piloté par le défilement. Celle-ci fait l'inverse :
**la page s'anime quand le visiteur s'arrête.**

Après ~900 ms sans défilement, la photo pleine largeur en cours entame une
dilatation très lente (1 → 1,035 sur 9 s, linéaire, imperceptible image par
image) et une légende discrète apparaît, nommant ce qu'on regarde. Au premier
mouvement de molette, tout revient en place en 1,2 s.

Un hôtel de luxe récompense le fait de s'arrêter, pas celui d'aller vite. C'est
la traduction littérale de « calme et chaleureux ». Codé dans la page, moteur
non modifié.

## Silences volontaires

Aucun écran vide dans cette version : la page reste un document, chaque écran
porte du contenu. C'est une différence assumée avec la v1.

## Grammaire

**Document raffiné** (nouvelle, nommée ici). La page reste un document : ordre
de lecture, sections, contenu existant. Le défilement ajoute de l'air, un seul
plan tenu et de la retenue — jamais un dispositif qui remplace du contenu.

**Interdit** : vidéo scrubbée plein cadre, plus d'un acte épinglé, pile de
titres épinglée à la place du contenu, compteurs de section, découpe cinétique
par caractère, suppression d'une section existante sans la remplacer par mieux.

**S'appuie sur** : `reveal` (rideau, déjà en place), `flow` + entrée,
`parallax` à taux très bas, un seul `pin`, et la signature au repos.

## Feel check (à froid, après build)

Un mot par acte, écrit avant de rouvrir ce fichier :

| Acte | Voulu | Ressenti | Verdict |
|---|---|---|---|
| Héro | Calme | calme | ✓ |
| Prestations | Désir | désir | ✓ |
| Promesse | Attention | attention | ✓ |
| Le yacht | (silence avant le pic) | sobre | ✓ |
| **Le moment** | **Suspension** | **suspension** | ✓ |
| Avis | Confiance | confiance | ✓ |
| Réservation | Résolution | résolution | ✓ |

Écart assumé : la courbe listait « promesse » avant « prestations », la page
les donne dans l'ordre inverse. C'est l'ordre existant du site, et la consigne
était de ne pas y toucher. Rien réécrit dans la courbe pour masquer l'écart.

Pic : c'est bien le plus grand changement visuel de la page et le seul endroit
où le défilement s'arrête (2,6 hauteurs d'écran, contre ~0,6 pour la bande
qu'il remplace). L'acte qui le précède (Le yacht, fond clair, fiche technique)
est plus calme que lui. La fin résout : le formulaire tient à l'écran.
