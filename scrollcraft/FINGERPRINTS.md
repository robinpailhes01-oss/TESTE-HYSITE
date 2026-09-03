# Fingerprints

Every site you build with **scrollcraft** gets one row here, appended after it
ships. The registry exists so your next build can prove it is a different page
rather than a re-skin of one you already made.

This file is **yours**. It starts empty on purpose: the gate is about not
repeating *yourself*, so it has nothing to say until you have built something.

The rules and the gate live in the skill's
`references/uniqueness.md`. Short version:

**A new build must differ from EVERY row below on at least 4 of the 6
dimensions.** Four against each row individually, not four on average across the
table. If a planned build fails, change the plan. Never edit a row to make room
for it.

The six dimensions are: **grammar**, **nav treatment**, **hero device**,
**act-sequence shape**, **close pattern**, **signature move**.

Dimension 6 is free, because a signature move is unique by definition. So the
gate really asks for three more out of the remaining five, and a build that
changes only grammar and world will fail it.

---

## The registry

| Build | Grammar | Nav treatment | Hero device | Act-sequence shape | Close pattern | Signature move | World | Port |
|---|---|---|---|---|---|---|---|---|

*(empty: your first build has nothing to clear, so build whatever the interview
points at. From the second onwards, this table is the constraint.)*

---

## What is taken

Add a bullet here whenever a build claims something a later build should avoid
reusing: a grammar, a nav treatment, a close pattern, a signature move, an
act-count-and-length band. The shared columns are what the next build inherits
as a constraint, so writing them down is the whole point.

Nothing is taken yet.

---

## Appending a row

After shipping, add one line to the table and one bullet to **What is taken** if
the build claimed something new. Fill every column. Say what the build shares
with existing rows.

Rows are append-only. A build that has been superseded stays in the table,
because the space it occupies is still occupied.

---

## Worked example

The skill's author kept a registry of twelve builds across eight page grammars.
If you want to see what a filled-in table looks like, and which shapes tend to
collide, read `EXAMPLES.md` in the scrollcraft repository. Treat it as
illustration only: those rows are somebody else's builds and they do **not**
constrain yours.

## harmonie-home — 2026-08-25
| Dimension | Valeur |
|---|---|
| Grammaire | Filmic one-shot (prologue immersif de 6 actes, puis sections de conversion en flow) |
| Nav | Nav fixe existante du site (transparente puis solide), inchangée |
| Héro | scrub 16:9/9:16 généré depuis une vraie photo (approche du yacht au couchant), copy lead greet |
| Forme de séquence | scrub 2.6 → pin 2.6 (lignes relais centrées) → pan 3.2 (rail photos) → flow silence → scrub 3.6 (PIC salon) → flow reveal matin ; ~13v h avant le contenu classique |
| Clôture | Section réservation existante (formulaire + CTA), tenue à l'écran |
| Signature | « L'heure du bord » : cadran fixe dont l'heure (17 h 30 → 23 h → 10 h) avance avec le scroll, calée sur le vrai déroulé de la Nuit Prestige |
| Monde | Photographique — vraies photos client animées via kling (image-to-video), aucune image générée de zéro |
| Port | React Router SSG (site de prod), moteur monté au chargement |

## harmonie-calme — 2026-08-25
| Dimension | Valeur |
|---|---|
| Grammaire | **Document raffiné** (nommée ici) : la page reste un document, le défilement ajoute de l'air, un seul plan tenu, de la retenue |
| Nav | Nav fixe existante du site, inchangée *(partagé avec harmonie-home)* |
| Héro | Photo fixe existante + parallaxe + respiration au repos (aucune vidéo) |
| Forme de séquence | **Un seul acte épinglé** (2,6 vh) inséré dans un document par ailleurs en flux — pas de suite d'actes |
| Clôture | Section réservation existante *(partagé avec harmonie-home)* |
| Signature | **« Le souffle »** : la page s'anime quand le visiteur s'ARRÊTE (dilatation 9 s + légende), l'inverse du kit |
| Monde | Photographique — vraies photos client, zéro génération, 0 crédit |
| Port | React Router SSG, CSS piloté par --sc-p publié à la main (moteur non chargé) |

Écarte harmonie-home sur 4 dimensions / 6 (grammaire, héro, forme, signature).
Partage : nav et clôture.

## harmonie-parcours — 2026-08-26
| Dimension | Valeur |
|---|---|
| Grammaire | **Parcours** (le tunnel guidé, nommée ici) : l'unité est l'étape de décision, une question par étape |
| Nav | Nav fixe existante du site *(partagé avec les deux autres)* |
| Héro | Plan épinglé court (1,4 vh), trois éléments de texte, poussée lente — pas de vidéo, pas de héro-document intact |
| Forme de séquence | pin 1,4 → flow (choix) → pan 3,4 (rail du jour) → pin 3,0 (pic) → flow ; ~7,8 vh épinglés dans un document |
| Clôture | Section réservation existante, atteinte comme fin du chemin *(partagé)* |
| Signature | **« La formule vous suit »** : le temps passé sur chaque expérience pré-coche la bonne formule dans le formulaire |
| Monde | Photographique — vraies photos client, 0 génération, 0 crédit |
| Port | React Router SSG, rendu piloté par --sc-p en CSS (moteur non chargé) |

Écarte `harmonie-home` sur 4/6 (grammaire, héro, forme, signature).
Écarte `harmonie-calme` sur 4/6 (grammaire, héro, forme, signature).
Partagé avec les deux : nav et clôture.

## harmonie-tunnel — 2026-08-26
| Dimension | Valeur |
|---|---|
| Grammaire | **Tunnel** (aiguillage puis immersion, nommée ici) : l'accueil route, la page choisie immerge — deux jeux de règles distincts |
| Nav | Les deux expériences en tête de menu ; « Réserver » mène au CHOIX sur l'accueil, au formulaire ailleurs |
| Héro | Plan épinglé court (1,15 vh) : le bateau en entier, trois éléments de texte, le choix juste dessous |
| Forme de séquence | Accueil 3,8 écrans (pin 1,15 → flow choix → avis) ; immersion déportée sur les pages d'expérience (rail pan de ~4,9 vh) |
| Clôture | **L'accueil se termine sur la preuve, pas sur le formulaire** — on ne réserve pas avant d'avoir choisi |
| Signature | **« Le compte y est »** : le compteur du rail monte jusqu'au total des prestations (7/7 à bord) |
| Monde | Photographique — vraies photos client, 0 génération, 0 crédit |
| Port | React Router SSG, rendu piloté par --sc-p en CSS (moteur non chargé) |

Écarte harmonie-home 4/6, harmonie-calme 4/6, harmonie-parcours 5/6.
Seul partage avec tout le reste : le monde photographique et le port.

## harmonie-nuit-descente — 2026-08-30
| Dimension | Valeur |
|---|---|
| Grammaire | **Worldflight** (un monde continu traversé par le défilement) — le seul cas où le chaînage est autorisé : le brief est littéralement « du haut des escaliers jusqu'à la chambre » |
| Nav | Nav fixe existante *(partagé)* — la section, elle, se traverse sans repère de page |
| Héro | **Travelling sur plans fixes** (échelle + hauteur de regard interpolées, fondus courts) : aucune vidéo, aucun scrub |
| Forme de séquence | **Une seule course épinglée de 7 vh** contenant cinq plans chaînés (1,1 / 1,4 / 1,0 / **2,2** / 1,3) — pas une suite d'actes épinglés séparés |
| Clôture | Section réservation existante *(partagé)* ; la section, elle, se clôt en s'immobilisant dans la cabine |
| Signature | **« On descend vraiment »** : le compteur des marches restantes (4 → 1) décroît avec le défilement puis s'efface une fois en bas |
| Monde | Photographique — trois vraies photos client, épurées et relevées en lumière de fin de journée via seedream image-to-image (10 plans générés : 5 paysage, 5 portrait) |
| Port | React Router SSG, rendu piloté par --sc-p en CSS (moteur non chargé) |

Écarte `harmonie-home` 5/6, `harmonie-calme` 5/6, `harmonie-parcours` 5/6,
`harmonie-tunnel` 6/6. Seul partage récurrent : la nav et la clôture, qui
appartiennent à la page hôte et non à la section.

**Pris par ce build, à ne pas rejouer :** la grammaire worldflight, le
travelling sur plans fixes comme substitut au scrub vidéo, la course unique de
7 vh à cinq plans chaînés, et le compteur de marches.

## harmonie-refonte — 2026-09-03
| Dimension | Valeur |
|---|---|
| Grammaire | **Chapitre éditorial** (2.2), avec deux écarts nommés : la mécanique de superposition (chaque plaque glisse par-dessus la précédente, qui recule et s'assombrit) et UN sol interpolé — la tombée du jour — parce que l'interpolation y est le contenu, pas une transition |
| Nav | **Une ligne qui s'inverse avec le sol** (transparente, puis matière du sol courant) + un **folio** fixe dans la marge (numéro et titre du chapitre) — plus une barre fixe indifférente à la page |
| Héro | **Page de titre** : du type (Fraunces, 136 px) sur le papier, la photo du bateau dans sa colonne avec sa légende ; pas de scrub, pas de voile plein cadre |
| Forme de séquence | Titre 1,0 → pile de plaques collantes (jour 1,0 · tombée du jour **2,3** · nuit 1,0) → voix 1,6 → choix 1,0 ; ~8,9 vh |
| Clôture | **Deux portes en texte courant** (Le jour / La nuit, en Fraunces à 96 px, avec un filet), tenues sur la nuit — pas de formulaire sur l'accueil |
| Signature | **« La tombée du jour »** : le sol passe du papier (#F4EFE6) au noir chaud (#0B0907) continûment au défilement, la nav se retourne à mi-course, et une ligne dit l'heure réelle du couchant à Carnon ce soir (NOAA, src/sun.ts) |
| Monde | Photographique, réel uniquement (0 génération, 0 crédit) — direction « Papier de palace, écran de cinéma », Fraunces + Instrument Sans, accent = la dorure mesurée sur le logo (#9C7435) |
| Port | React Router SSG, sol posé sur <html data-ground> au rendu (pré-rendu sans flash), --dusk et --cover publiés par un seul lecteur de défilement, tout le rendu en CSS |

Écarte `harmonie-home`, `harmonie-calme`, `harmonie-parcours`, `harmonie-tunnel`
et `harmonie-nuit-descente` sur **6/6** chacun. Aucun partage.

**Pris par ce build, à ne pas rejouer :** la pile de plaques qui se recouvrent,
la page de titre sur papier, le folio, le sol interpolé jour → nuit, les portes
en texte courant, et l'heure du couchant comme ligne de bascule.

## harmonie-rideau — 2026-09-03
| Dimension | Valeur |
|---|---|
| Grammaire | **Scène partagée** (2.7) : le jour et la nuit tenus côte à côte pendant toute la page, résolus par le défilement |
| Nav | **Pas de barre : la couture est le chrome** (blason, deux étiquettes, progression tracée le long du fil, heure du couchant) ; un seul mot « Menu » en différence, à toutes les largeurs |
| Héro | **50/50, deux titres lisibles en même temps**, chaque photo dans son cadre sur son sol (Voile / Eau du port), aucune photo pleine largeur avant la résolution |
| Forme de séquence | **Un seul stage épinglé de 6 vh** (4,6 sur téléphone) : 50/50 → le jour penche (62 %) → la nuit penche (38 %) → 50/50 (voix) → fermeture ; le texte d'un côté ne parle que quand la couture est de son côté |
| Clôture | **La fermeture** : la couture rejoint le bord décidé par le soleil de Carnon, le côté qui reste prend tout l'écran (le cadre s'ouvre jusqu'aux bords), l'autre reste une porte de 72 px ; la scène tient, le pied de page suit |
| Signature | **« Le rideau »** : la couture se saisit à la souris, au doigt ou au clavier et se tire, revient en ressort, penche vers le pointeur, et se range du côté où en est le soleil à l'heure réelle (NOAA) ; choisir un côté emporte sa photo dans la page (View Transitions) |
| Monde | Photographique, réel uniquement (0 génération, 0 crédit) — identité « La carte d'invitation » : Voile et Eau du port, Bodoni Moda dictée par le logo, laiton sous 10 %, rayon 0, aucune ombre |
| Port | React Router SSG, deux sols sur deux sous-arbres (`.ground-day` / `.ground-night`), `--p` et `--seam` publiés par un seul lecteur, photo mise à l'échelle dans son cadre par transform (mesures JS), tout le rendu en CSS |

Écarte `harmonie-home`, `harmonie-calme`, `harmonie-parcours`, `harmonie-tunnel`,
`harmonie-nuit-descente` et `harmonie-refonte` sur **6/6** chacun. Aucun partage.

**Pris par ce build, à ne pas rejouer :** la scène partagée, la couture comme
chrome, le 50/50 à deux titres, la fermeture décidée par le soleil, la porte
étroite du côté perdant, et la couture qu'on tire.

## harmonie-histoire — 2026-09-03
| Dimension | Valeur |
|---|---|
| Grammaire | **Récit d'hôtel** (nommée ici) : un document en flux, un chapitre par heure de la journée à bord, rien d'épinglé, le sol change une fois au couchant |
| Nav | Nav fixe existante du site *(partagé)* |
| Héro | Photo plein écran (le couchant vu du pont) et une ligne, rien d'autre |
| Forme de séquence | accroche 1,0 → message 0,9 → 4 chapitres du jour 4,2 → passage 1,2 → 3 chapitres de nuit 3,0 → voix 1,0 → prix 1,2 ; ~12,5 vh, aucun pin |
| Clôture | **La carte des tarifs**, tout compris, deux portes (sortie / nuit), sur la nuit |
| Signature | **« Le fil et l'heure »** : un fil de laiton qui s'allonge avec la lecture, une heure accrochée à chaque chapitre, le couchant à l'heure vraie, le prix au bout du fil |
| Monde | Photographique, réel uniquement ; identité « La carte d'invitation » en Jost |
| Port | React Router SSG, un seul lecteur de défilement (fil, sol, parallaxe 6 % au pointeur fin), arrivées par IntersectionObserver |

Écarte `harmonie-rideau` 6/6, les autres 4 à 5/6 (nav partagée ; photo fixe
en héro voisine de `harmonie-calme` ; l'heure voisine de `harmonie-home`).

**Pris par ce build :** le récit heure par heure, la carte des tarifs en
clôture, le fil de laiton.
