# Harmonie Yacht — Design Spec (refonte 2026-09)

## Brief (passe stratège de marque)

- **Offre.** Un seul yacht, privatisé, avec skipper, au port de Carnon. Le jour :
  sorties de 2 à 8 h, jusqu'à 10 invités. La nuit : le bateau devient une
  suite pour deux, à quai ou en formule Prestige (sortie au couchant, tapas,
  petit-déjeuner). Tenu par ses propriétaires, Robin et Ludivine.
- **Public (psychographie).** Des couples et de petits groupes qui veulent un
  moment rare et personnel, pas une « balade en bateau ». Ils réservent depuis
  un téléphone, souvent pour une occasion (anniversaire, demande, EVJF), et ils
  comparent avec un hôtel, pas avec une autre location de bateau.
- **Le seul travail de la page.** Faire sentir qu'on est déjà à bord, puis
  réserver avec 30 % d'acompte.
- **Pour / contre.** Pour : l'intimité d'un seul bateau, accueilli par ceux qui
  le possèdent. Contre : la place de marché de location (grilles de flotte,
  tableaux de prix, photos de stock) et le « bateau à fête ».
- **UVP.** Harmonie Yacht offre aux couples et petits groupes de Carnon un yacht
  privé pour le jour ou pour la nuit, accueilli par ses propriétaires, pour que
  quelques heures sur l'eau aient le poids d'un séjour.
- **Piliers.** (1) À vous seuls. (2) Le jour et la nuit — les deux vies du même
  bateau. (3) Rien à organiser. (4) Le vrai : vraies photos, vrais avis, vraie
  heure du couchant, vraies dates libres.
- **Archétypes.** *Lover* (l'intimité, la chaleur, le soir) + *Explorer*
  (la mer, l'horizon, sortir). Le premier gouverne la nuit, le second le jour ;
  le site est leur rencontre.

## Direction esthétique

**« Papier de palace, écran de cinéma. »**

Deux références hors logiciel, tenues en tension : la brochure imprimée d'un
palace méditerranéen (papier crème, serif fin à grande taille, beaucoup d'air,
photos posées avec une légende) pour le jour ; et l'écran de cinéma (noir chaud,
image qui émerge du noir, carton-titre) pour la nuit. Le site ne choisit pas :
il passe de l'un à l'autre, et ce passage est sa signature.

Ce que ça interdit, dans l'ordre où la banalité s'installe :
- **Mise en page.** Pas de héro centré sur dégradé ; pas de grille de trois
  cartes à icônes ; pas de carrousel d'avis ; pas de tableau de prix à colonne
  centrale surlignée. Les sections ne s'empilent pas : elles **glissent les unes
  par-dessus les autres** (c'est la « superposition » demandée), et la
  précédente s'assombrit en étant recouverte.
- **Couleur.** Le bleu marine « nautique » du site actuel (`#1a4c74`) est
  exactement l'accent réflexe du secteur. Il disparaît de l'interface. La mer
  n'est présente que dans les photographies. L'accent est **la dorure du logo**
  (`#9C7435`), mesurée sur le fichier.
- **Composants.** Aucune ombre portée. Aucune carte arrondie. Les images sont à
  angles vifs, pleine largeur ou dans leur colonne avec une légende. Un seul
  élément arrondi : le bouton, en pilule.

## Tokens

### Les deux sols
Le sol est porté par `data-ground="day|night"` sur `<html>`. Les pages de jour
le posent à `day`, les pages de nuit à `night`, et l'accueil le fait basculer
au défilement.

| Rôle | Jour (`day`) | Nuit (`night`) |
|---|---|---|
| `--ground` | `#F4EFE6` papier crème chaud | `#0B0907` noir chaud |
| `--ground-2` | `#EAE3D5` | `#15100C` |
| `--ink` | `#17130F` | `#F1E9DC` os |
| `--ink-2` (70 %) | `rgba(23,19,15,.70)` | `rgba(241,233,220,.70)` |
| `--ink-3` (38 %) | `rgba(23,19,15,.38)` | `rgba(241,233,220,.38)` |
| `--rule` | `rgba(23,19,15,.14)` | `rgba(241,233,220,.14)` |
| `--accent` | `#9C7435` dorure | `#D4B27A` dorure éclaircie |

Pas de troisième sol. Pas de bleu.

### Typographie
- **Display : Fraunces** (variable, axe optique 9→144, italiques vraies). Un
  serif à caractère, qui change de dessin avec la taille : dense et lisible à
  18 px, aérien et gravé à 120 px. Graisse 300–400 pour les titres : la
  légèreté est la voix. L'italique porte les mots d'émotion, jamais des
  phrases entières.
- **Texte : Instrument Sans** (déjà en place, choisi et non par défaut).
- **Utilitaire :** Instrument Sans en petites capitales espacées (0,22 em) pour
  les repères et légendes ; chiffres tabulaires pour tout prix et toute heure.

Échelle (px) : `12 · 14 · 16 · 19 · 24 · 32 · 44 · 64 · 96 · 136`. Le tracking se
resserre en montant : −0,005 em à 16, −0,02 à 44, −0,035 à 96, −0,045 à 136.
L'interlignage descend : 1,6 en texte, 1,05 à 64, 0,96 à 136. Sur fond nuit :
un demi-cran de graisse en plus, +0,005 em de tracking, +0,04 d'interlignage.

### Espace
Base 8 : `8 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 192`. Section fluide
`clamp(72px, 12vw, 176px)`. Gouttière `clamp(20px, 5vw, 80px)`. Mesure de texte
`60ch`.

### Rayons, ombres, mouvement
- Rayon : **0** partout, sauf les boutons (pilule 999 px). Une règle, pas deux.
- Ombres : **aucune**. La profondeur vient de la superposition et du sol.
- Durées : 120 ms (retour tactile) · 240 ms (transitions) · 600–900 ms
  (révélations). Easing d'interface `cubic-bezier(0.16, 1, 0.3, 1)`. Easing des
  mouvements pilotés par le défilement : **marée**, `cubic-bezier(0.65, 0, 0.35, 1)`,
  symétrique et lente aux deux bouts — rien ne claque sur l'eau.

## Élément signature

**« La tombée du jour. »** Sur l'accueil, le sol passe du papier au noir au
milieu de la page, continûment, piloté par le défilement — on arrive en plein
jour, on finit dans la cabine. Au point de bascule, une seule ligne, vraie :
l'heure exacte du coucher du soleil à Carnon ce soir (calculée localement,
`src/sun.ts`). Personne d'autre ne peut faire ce mouvement, parce que personne
d'autre ne vend les deux.

Tout le reste est calme autour.

## Actifs

Photos réelles uniquement, pas de génération (budget épuisé, et le client
enverra d'autres photos). La marque du logo est extraite du PNG en deux
versions à fond transparent : `logo-harmonie-yacht.png` (l’original, déjà transparent, sur papier) et
`logo-bone.png` (os, sur nuit). Les noms de fichiers de photos restent stables
pour que les prochaines photos du client se glissent aux mêmes places.
