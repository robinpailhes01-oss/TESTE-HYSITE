# harmonie-rideau — BRIEF

Refonte « La carte d'invitation », 2026-09. Identité : `branding/brand.md`.
Tokens et direction : `DESIGN.md`. Ce brief porte la partition du défilement
de l'accueil et le gate.

**Statut de l'entretien :** partiellement auto-écrit. Les réponses 1, 4, 6, 7
et 8 sont celles du client, reprises telles quelles des échanges précédents
(le client a demandé « une refonte complète… ultra premium et immersif et
fluide » sans rouvrir l'entretien). Les réponses 2, 3 et 5 sont écrites ici
dans la voix de la marque, et signalées comme telles.

## 1. Les réponses

1. **Vibe.** « ultra premium et immersif et fluide », « hyper qualité sur les
   scrolls, superposition ». Référence : godly.design. Retenu : le niveau
   d'exécution, pas le registre logiciel.
2. **Le parcours** *(auto-écrit)*. Les deux vies du bateau côte à côte dès le
   premier écran ; le jour penche, puis la nuit ; une voix de chaque côté ; la
   couture se ferme du côté où en est le soleil.
3. **L'énergie** *(auto-écrit)*. Basse et tenue, celle d'un lieu ; un seul
   mouvement ample, à la fin.
4. **Le moment à retenir.** « Le jour et la nuit » (réponse du client à la
   refonte précédente, conservée : c'est le capital).
5. **Ce qu'aucun site ne fait** *(auto-écrit)*. Se fermer du côté où en est
   le soleil, à l'heure réelle, dans le vrai port.
6. **Distance au premium-minimal.** Premium-minimal, mais pas « quiet dark
   one accent » : blanc de coque, eau du port, une Didone.
7. **Monde continu ou scènes ?** Ni l'un ni l'autre cette fois : **deux
   mondes en même temps**, tenus côte à côte. Le monde continu reste sur la
   page nuit (la visite), le rail reste sur la page sortie.
8. **Assets.** « Rien de plus que ce qui est sur le site », « je vais t'envoyer
   d'autres photos ». Photos réelles uniquement, 0 génération, 0 crédit ;
   places nommées pour les prochaines photos.

## 2. La courbe émotionnelle

La scène partagée n'a pas d'actes : elle a une seule scène épinglée dont
l'argument avance. Les « temps » ci-dessous sont des fenêtres de la
progression `p` du stage.

| Temps | `p` | Émotion | Ce qui la cause |
|---|---|---|---|
| 0. L'invitation | 0 → 0,16 | **Aplomb** — les deux à la fois | Deux photos, deux titres lisibles en même temps, une couture de laiton avec le blason dessus |
| 1. Le jour penche | 0,16 → 0,40 | **Appétit** | La couture glisse à 62 %, la colonne du jour change de photo (le paddle, les amis au couchant) et pose ses trois faits |
| 2. La nuit penche | 0,40 → 0,64 | **Intimité** | La couture glisse à 38 %, la colonne de la nuit descend dans la cabine et pose ses trois faits |
| 3. Les voix | 0,64 → 0,80 | **Confiance** — silence avant le pic | 50/50, une voix réelle de chaque côté, du texte seul, rien ne bouge |
| 4. La fermeture — **PIC** | 0,80 → 1 | **Résolution** | La couture part au bord décidé par le soleil de Carnon ; la colonne qui reste prend tout l'écran avec sa porte et l'heure du couchant ; l'autre reste une porte étroite, cliquable |

Aucun temps ne partage l'émotion de son voisin. Le silence avant le pic est
le temps 3 : deux citations, rien d'autre.

## 3. Le pic

> « Tu descends, et le rideau se range tout seul du côté où en est le soleil
> à Carnon — il est 21 h, c'est la nuit qui s'ouvre. »

Temps 4. Il reçoit la plus grande course de la page (0,20 de `p`, soit 1,2
écran) et le seul mouvement ample.

## 4. « C'est le site où… »

> **C'est le site où tu tires le rideau entre le jour et la nuit, et à la
> fin il se range tout seul du côté où en est le soleil à Carnon.**

## 5. Silences volontaires

- Temps 3 (les voix) : deux citations sur les deux sols, aucune image, aucun
  mouvement de couture. C'est le silence avant la fermeture ; le harnais ne
  doit pas le lire comme du scroll mort (l'état est publié dans
  `data-sc-verify-state`).
- Après la fermeture : la scène tient, fermée. Le pied de page vient
  dessous, court.

## 6. Grammaire, gate, signature

**Grammaire : scène partagée (2.7).** Pourquoi les sept autres perdent :
- *Filmic one-shot* : pris par `harmonie-home` ; et un seul plan continu ne
  peut pas tenir deux mondes en même temps.
- *Chapitre éditorial* : pris par `harmonie-refonte`, la version précédente.
- *Surface vivante* : pas de produit logiciel à faire tourner.
- *Monde continu* : pris par `harmonie-nuit-descente`, qui reste sur la page
  nuit.
- *Affiche typographique* : les photos sont la preuve (« bateau conforme »).
- *Galerie* : c'est le rail de la page sortie, pas l'accueil qui doit trancher.
- *Liste de coupes* : l'énergie est celle d'un lieu.

**Ce que la scène partagée impose, et qui est tenu :** pas de barre — la
**couture est le chrome** (elle porte le blason, les deux étiquettes et la
progression) ; le héro établit le 50/50 avec les deux titres lisibles ; aucune
photo pleine largeur avant la résolution ; aucune copie centrée ; les deux
colonnes portent du vrai contenu jusqu'au bout ; la clôture est **la
fermeture** : la couture rejoint un bord, une colonne prend toute la largeur,
la porte est dedans. Bans respectés : pas de `pan`, pas de spotlight, pas
d'aimant (désactivé sur l'accueil), pas de drift (deux sols, un par côté).

**Le côté gagnant n'est pas arbitraire :** c'est le soleil de Carnon qui le
décide (`src/sun.ts`, NOAA) — le jour avant le couchant, la nuit après. Le
visiteur peut toujours tirer le rideau de l'autre côté.

**Signature : « le rideau ».** La couture se saisit à la souris ou au doigt
et se tire ; relâchée, elle revient en ressort où l'argument en est ; au bout
du défilement elle se range du côté du soleil ; choisir un côté emporte sa
photographie dans la page (View Transitions). Codé dans la page, piloté par
la progression du stage et le pointeur ; le moteur n'est pas chargé.

**Le gate.** Dimensions : grammaire / nav / héro / forme / clôture / signature.

| Contre | Écart |
|---|---|
| `harmonie-home` (filmic, nav fixe, scrub, suite d'actes, réservation, l'heure du bord) | 6/6 |
| `harmonie-calme` (document raffiné, nav fixe, photo fixe, un pin dans un document, réservation, le souffle) | 6/6 |
| `harmonie-parcours` (parcours, nav fixe, pin court, pin→flow→pan→pin, réservation, la formule vous suit) | 6/6 |
| `harmonie-tunnel` (tunnel, nav fixe, pin court, accueil 3,8 écrans, la preuve, le compte y est) | 6/6 |
| `harmonie-nuit-descente` (worldflight, nav fixe, travelling sur plans, une course de 9,5 vh, réservation, on descend vraiment) | 6/6 |
| `harmonie-refonte` (chapitre éditorial, ligne qui s'inverse + folio, page de titre, pile de plaques, deux portes en texte, la tombée du jour) | 6/6 |

Passe.

## 7. La partition

| Temps | Device | Pourquoi | Course (écrans) |
|---|---|---|---|
| 0. L'invitation | `pin`, couture à 50 % | Comprendre le format avant de défiler | 1,0 |
| 1. Le jour penche | couture → 62 % + `reveal` (photo, faits) | Une balance qui penche | 1,3 |
| 2. La nuit penche | couture → 38 % + `reveal` | Même geste, l'autre côté | 1,3 |
| 3. Les voix | couture → 50 %, `in` (texte) | Le silence | 0,9 |
| 4. La fermeture — **PIC** | couture → 0 ou 100 % selon le soleil, `in` (porte, heure) | La résolution | **1,5** |

Total ≈ **6 écrans** sur ordinateur, **4,6** sur téléphone (course raccourcie).
Un seul stage épinglé ; le pied de page suit. Devices : pin, reveal, in, et
le rideau (bespoke). La scène partagée n'a qu'une idée, et c'est voulu.

**Pages sortie et nuit.** Leur héro reçoit la photo par transition d'élément
partagé ; le rail (sortie) et la visite (nuit) restent ; formules, déroulé et
réservation sont restylés sous la nouvelle identité.

---

## 8. Vérification et feel check — 2026-09-03

**Feel check (page parcourue à froid sur la planche du harnais et au
défilement, un mot par temps, puis comparé à la courbe voulue) :**

| Temps | Voulu | Ressenti | Écart |
|---|---|---|---|
| 0. L'invitation | Aplomb | Aplomb : deux cartons, deux titres, le blason sur le fil | aucun |
| 1. Le jour penche | Appétit | Appétit : le couchant entre amis arrive et le jour recouvre la nuit | aucun |
| 2. La nuit penche | Intimité | Intimité : la cabine, et le jour qui se tait | aucun |
| 3. Les voix | Confiance | Confiance, et le calme voulu : deux citations, rien ne bouge | aucun |
| 4. La fermeture | Résolution | Résolution : la photo prend l'écran, la ligne dit l'heure, la porte de l'autre côté reste | aucun |

Le pic est bien la plus grande course (1,5 écran sur 6) et le plus grand
changement visuel de la page. La fin tient : la scène reste fermée, le pied de
page vient dessous.

**Mesuré :**
- Harnais scrollcraft, accueil × 3 modes (ordinateur, 390 × 844, mouvement
  réduit) : **aucun scroll mort**, état publié (`p`, `seam`, `temps`,
  `gagnant`), aucun débordement horizontal, console propre (hors appels
  Supabase bloqués par le bac à sable).
- Contraste sur pixels composités, texte masqué, 20 sondes (titres, repères,
  voix, ligne du couchant, deux formats, jour et nuit) : **tout ≥ 5,4 : 1**
  après correction. Deux corrections mesurées : le repère de la nuit à la
  fermeture sur la cabine (3,9 → 5,4 : une bande haute dans le voile) et le
  repère de la nuit sur téléphone au-dessus de la nappe blanche (2,95 → 5,5 :
  voile plus dense et plus haut).
- Pages sortie et nuit : héros en transition d'élément partagé, formules,
  déroulé, galerie et réservation vérifiés en captures, deux formats.

**Non corrigé, signalé :** « NEXT YACHT » sur le tableau arrière de la photo
du héro nuit (toujours en attente d'une décision du client).

**Ce qu'un run vert ne couvre pas :** un vrai téléphone. Le rideau au doigt
(pointer capture, `touch-action: none` sur la poignée) et le `100dvh` de la
scène sont écrits pour iOS mais n'ont été exercés que dans Chrome headless.
