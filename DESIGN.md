# Harmonie Yacht — Design Spec (refonte « La carte d'invitation », 2026-09)

L'identité est figée dans `branding/brand.md` (et présentée dans
`branding/brand-book.html`). Ce fichier traduit cette identité en décisions de
site : le brief d'entrée, la direction, les tokens, la signature, le mobile.

## Intake

- **Pain.** « J'ai peur que le bateau ne soit pas celui des photos, qu'on soit
  dix inconnus à bord, et qu'un supplément arrive à la fin. » (vocabulaire des
  avis de places de marché : « bateau conforme »). Et pour la nuit : « est-ce
  que quelqu'un nous accueille, est-ce qu'il y a un petit-déjeuner ? »
- **Person.** Un couple ou un petit groupe de Montpellier, une date en tête
  (anniversaire, demande, EVJF), un téléphone à la main, qui compare avec un
  hôtel plutôt qu'avec un autre bateau.
- **Promise.** Un seul yacht, à vous seuls, tenu par ses deux propriétaires,
  le jour (2 h à 8 h, jusqu'à 10 invités, dès 380 €) ou la nuit (18 h → 12 h,
  à deux, dès 250 €), tout compris.
- **Le seul travail de la page d'accueil.** Choisir entre le jour et la nuit.
  On réserve sur la page choisie (acompte de 30 %).
- **Preuve réelle.** Vingt avis Google, tous à cinq étoiles, texte inchangé ;
  les prénoms des hôtes dans huit d'entre eux ; l'heure exacte du couchant à
  Carnon ce soir (calcul NOAA local) ; les vraies dates libres (Supabase).
- **Références (mécanismes, pas pages).** godly.website (demande du client) :
  ce qu'on prend, c'est le niveau d'exécution des couches et des transitions ;
  ce qu'on refuse, c'est le registre logiciel (barres, cartes, dégradés).
  Concurrents à écarter : Samboat (grille de fiches), Captain Méditerranée et
  Infinity Yacht (navy, blanc, doré, sans bold).
- **Actifs : Tier B.** Des photos réelles du client, de qualité et de style
  inégaux (960 à 2200 px, phone et reflex). Traitement unificateur : aucun
  filtre, angles vifs, légendes en petites capitales, et chaque photo à une
  place nommée pour que les suivantes s'y glissent. Aucune génération.
- **Copie.** Écrite ici dans le ton de `brand.md`, faits tirés de
  `src/experiences.ts`, à valider par le client. Français natif.
- **Contraintes.** React Router v8 en prérendu statique sur Vercel ; Supabase
  et Stripe en place ; la branche de préversion uniquement, la production ne
  bouge pas sans instruction.

## Direction

**« La carte d'invitation »** : le bristol d'un yacht-club (blanc de coque,
un fil de laiton, des capitales espacées, une heure et une date) tenu avec
**la couture** des sites de godly qui font glisser deux mondes l'un contre
l'autre. Le site est de la couleur du bateau ; les photographies portent toute
la couleur.

| Entrée stratégique | → Décision de design |
|---|---|
| Pilier « à vous seuls » | Un seul bateau à l'écran, jamais de grille de fiches, jamais de « comparez » |
| Pilier « le jour et la nuit » | La scène partagée : les deux côte à côte dès le premier écran, résolue par le défilement |
| Pilier « on vous reçoit » | Les prénoms, les partenaires nommés, le message de confirmation signé |
| Pilier « exact » | Chiffres tabulaires, heures et prix écrits, l'heure du couchant réelle, dates libres réelles |
| Peur « bateau conforme » | Photos réelles uniquement, le bateau en entier une fois par page |
| Contre le secteur (navy, sans bold) | Blanc de coque et eau du port, géométrique fine, laiton sous 10 % |
| Le logo (blason géométrique, capitales espacées) | Jost en affichage, fine et construite au compas ; capitales espacées pour les mots-marque |

Ce que ça interdit : le bleu dans l'interface ; les ombres ; tout rayon
d'angle (boutons compris) ; les cartes à icône ; le carrousel d'avis ; le
tableau de prix surligné ; les adjectifs (inoubliable, insolite, unique,
premium, luxe) jusque dans les balises meta.

## Tokens

Deux sols sur `<html data-ground="day|night">` ; le jour et la nuit
coexistent sur l'accueil dans deux colonnes qui portent chacune leur sol.

| Rôle | Jour | Nuit |
|---|---|---|
| `--ground` | Voile `#F3F1EB` | Eau du port `#0A0E12` |
| `--ground-2` | Écume `#E8E5DD` | Fond de cale `#141A20` |
| `--ink` | Encre de bord `#12151A` | Os `#EFEBE2` |
| `--ink-2` / `--ink-3` / `--rule` | 70 % / 40 % / 14 % de l'encre | idem |
| `--accent` (texte) | Laiton profond `#7A5A24` (5,6 : 1) | Laiton de nuit `#D6B67C` (9,9 : 1) |
| `--accent-surface` | Laiton `#9C7435` | Laiton de nuit `#D6B67C` |

- **Affichage : Jost** (variable, graisse 300 en titres, 340 sur la nuit,
  italiques vraies), retenue par le client contre la Didone. **Texte :
  Instrument Sans** 400/500/600.
- Échelle : `11,5 · 13,5 · 16 · 19 · 24 · 32 · 44 · 64 · 96 · 144`. Tracking
  −0,015 em à 44, −0,025 à 96, −0,03 à 144 ; +0,22 em sur les repères en
  capitales. Interlignage 0,92 à 144, 1,6 en texte. Chiffres tabulaires sur
  toute heure et tout prix.
- Espace base 8 ; section `clamp(72px, 12vw, 176px)` ; gouttière
  `clamp(20px, 5vw, 80px)` ; mesure 60 ch.
- **Rayon 0 partout**, boutons compris (un filet, des capitales espacées).
  **Aucune ombre.** Profondeur par superposition et par les deux sols.
- Durées 120 / 240 / 700 ms ; `--ease cubic-bezier(0.16,1,0.3,1)` ;
  `--tide cubic-bezier(0.65,0,0.35,1)` pour ce que le défilement pilote.

## Élément signature

**« Le rideau. »** L'accueil tient le jour et la nuit côte à côte, séparés
par une couture de laiton qui porte le blason. La couture se saisit (souris
ou doigt) et se tire ; relâchée, elle revient où l'argument en est. Au bout
du défilement, elle se range d'elle-même du côté où en est le soleil à
Carnon : le jour avant le couchant, la nuit après, et une ligne dit l'heure
exacte. Choisir un côté emporte sa photographie dans la page choisie (View
Transitions). Tout le reste est calme.

## Mobile

Une passe, pas un redimensionnement. La couture devient horizontale (le jour
en haut, la nuit en bas), les deux titres restent lisibles sur le premier
écran, la couture se tire au doigt. La course épinglée est raccourcie (4,6
écrans contre 6), pas d'effet au pointeur, `100svh` sur la scène (stable
quand la barre de Safari se replie), pas de travelling sur les photos, pas
de Lenis au doigt, la poignée du rideau limitée au blason pour laisser le
pouce faire défiler, cibles tactiles ≥ 44 px. Le rail de la page sortie et la visite de la page nuit
gardent leurs versions portrait.

## Ce qui change par rapport à la refonte précédente (« Papier de palace »)

Le crème et le brun laissent place au blanc de coque et à l'eau du port ;
Fraunces laisse place à Jost, géométrique fine choisie par le client ; la pilule devient un
filet à angles vifs ; la pile de plaques qui se recouvrent devient la scène
partagée ; la tombée du jour au défilement devient la fermeture au soleil,
qui lit l'heure réelle au lieu de la simuler.
