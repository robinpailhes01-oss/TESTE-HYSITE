# harmonie-refonte — BRIEF

Refonte complète, 2026-09. **Non auto-écrit** : entretien mené en questions
fermées, réponses du client reprises telles quelles. Le DESIGN.md à la racine
du dépôt porte la stratégie de marque et les tokens ; ce brief porte la
partition du défilement.

## 1. Les réponses

1. **Vibe.** « quelques choses d'hyper qualité sur les scrolls, superposition »,
   « le rendu le plus luxe possible ». Référence donnée : godly.design — dont
   les sites mis en avant sont presque tous des produits logiciels. Ce qu'on en
   prend est donc le **niveau d'exécution** (échelle typographique, couches,
   transitions), pas le registre.
2. **Le parcours.** Non dicté cette fois : le client a délégué la structure et
   demandé des questions. Fixé ci-dessous.
3. **L'énergie.** Basse, tenue, jamais nulle : celle d'un lieu, pas d'un
   lancement.
4. **Le moment à retenir.** Choisi : **le jour et la nuit** — le site bascule
   de l'un à l'autre.
5. **Ce qu'aucun autre site ne fait.** La même bascule, parce que personne
   d'autre ne vend les deux vies du même bateau.
6. **Distance au premium-minimal.** Premium-minimal, mais éditorial : du papier
   et du cinéma, pas du blanc et du gris.
7. **Monde continu ou scènes ?** Des **chapitres** qui se recouvrent. Le monde
   continu est déjà pris par la visite de la page nuit, qui reste.
8. **Assets.** « Rien de plus que ce qui est sur le site », puis « je vais
   t'envoyer d'autres photos ». Donc : photos réelles uniquement, aucune
   génération (62 crédits restants), et une structure où les prochaines photos
   se glissent à des places déjà nommées.

**Périmètre choisi :** les trois pages du tunnel à fond (accueil, sortie,
nuit) ; les onze autres reçoivent le système (sols, typographie, nav, pied)
sans mise en scène dédiée.

## 2. La courbe émotionnelle de l'accueil

| Chapitre | Émotion | Ce qui la cause |
|---|---|---|
| 0. Page de titre | **Aplomb** — on est chez quelqu'un | Du type sur du papier, le bateau dans sa colonne, une ligne. Rien ne bouge fort |
| 1. Le jour | **Appétit** — la mer, tout de suite | Une photo pleine largeur glisse par-dessus la page de titre ; trois faits ; une porte |
| 2. La tombée du jour — **PIC** | **Suspension** — le sol se dérobe | Le papier devient nuit sous les yeux, continûment, et une ligne dit l'heure vraie du couchant ce soir |
| 3. La nuit | **Intimité** — on est à l'intérieur | La cabine ou le salon glisse par-dessus le noir ; trois faits ; une porte |
| 4. Ils ont dormi ici | **Confiance** — des voix, pas des étoiles | Trois avis réels, grands, un à la fois, sur le noir |
| 5. Le choix | **Résolution** — deux portes, tenues | Le jour / La nuit, en texte courant, sur le noir. Ça ne s'efface pas |

Aucun voisin ne partage l'émotion de son voisin. Le silence avant le pic : la
fin du chapitre 1, où la photo du jour cesse d'avancer et tient.

## 3. Le pic

> « Tu fais défiler, et la page passe du jour à la nuit — et elle te dit à
> quelle heure le soleil se couche ce soir. »

Chapitre 2. Il reçoit la plus grande course de la page.

## 4. « C'est le site où… »

> **C'est le site où on voit le jour tomber sur le bateau avant de choisir sa
> nuit.**

## 5. Silences volontaires

- Fin du chapitre 1 : la photo tient, immobile, avant que le sol ne tourne.
- Chapitre 5 : les deux portes tiennent ; il n'y a plus rien à faire défiler,
  et c'est voulu.

## 6. Grammaire, gate, signature

**Grammaire : chapitre éditorial (2.2)**, et voici pourquoi les sept autres
perdent :
- *Filmic one-shot* : pris par `harmonie-home`, et il interdit la séquence
  visible — or ici les chapitres sont le propos.
- *Monde continu* : pris par `harmonie-nuit-descente`, qui reste sur la page
  nuit.
- *Surface vivante* : il n'y a pas de produit logiciel à faire tourner.
- *Affiche typographique* : le site a des photos, et elles sont la preuve.
- *Galerie* : c'est la grammaire du rail, qui reste sur la page sortie ; pas
  celle de l'accueil, qui doit trancher entre deux offres.
- *Scène partagée* : jour/nuit en deux colonnes tenues serait la solution
  évidente — et elle ferait de la bascule un zigzag. Le passage doit se subir
  dans le temps, pas se comparer dans l'espace.
- *Liste de coupes* : l'énergie est celle d'un lieu, pas d'une marque de sport.

**Ce que le chapitre éditorial impose, et qui est tenu :** l'unité est le
chapitre ; chaque chapitre a son sol et y reste (papier, papier-2, nuit) ; la
page de titre est du type sur le papier, la photo dans sa colonne avec une
légende, pas un scrub pleine largeur ; pas de barre fixe — un **folio dans la
marge** (numéro et titre du chapitre, qui change en passant) ; la clôture est
une **plaque de colophon**, petit type, les deux portes en texte courant.

**Deux écarts, assumés et nommés :**
1. La mécanique de superposition (« sticky stack » : chaque chapitre glisse
   par-dessus le précédent, qui s'assombrit en étant recouvert) — c'est la
   demande explicite du client, et elle ne contredit pas le chapitre : c'est
   la manière dont on tourne la page.
2. Le sol du chapitre 2 est **interpolé**, ce que 2.2 interdit — sauf qu'ici
   l'interpolation *est* le contenu (le jour qui tombe), pas un dispositif de
   transition. C'est la signature, et elle n'a lieu qu'une fois.

**Signature : « la tombée du jour ».** Piloté par le défilement, publié sur
`<html data-ground>` et une variable `--dusk` (0 → 1), rendu en CSS. La ligne
du couchant lit `src/sun.ts` (algorithme NOAA, vérifié à 0 s d'écart).

**Le gate.** Dimensions : grammaire / nav / héro / forme / clôture / signature.

| Contre | Écart |
|---|---|
| `harmonie-home` (filmic, nav fixe, scrub, suite d'actes, réservation, l'heure du bord) | 6/6 |
| `harmonie-calme` (document raffiné, nav fixe, photo fixe, un seul pin, réservation, le souffle) | 6/6 |
| `harmonie-parcours` (parcours, nav fixe, pin court, pin→flow→pan→pin, réservation, la formule vous suit) | 6/6 |
| `harmonie-tunnel` (tunnel, nav fixe, pin court, accueil 3,8 écrans, la preuve, le compte y est) | 6/6 |
| `harmonie-nuit-descente` (worldflight, nav fixe, travelling sur plans, une course de 9,5 vh, réservation, on descend vraiment) | 6/6 |

Passe.

## 7. La partition de l'accueil

| Chapitre | Device | Pourquoi | Course |
|---|---|---|---|
| 0. Page de titre | `flow` + `in` (type), photo en colonne, parallaxe légère | Le titre doit se lire immobile | 1,0 |
| 1. Le jour | `stack` (glisse par-dessus 0) + `reveal` des trois faits | Tourner la page, littéralement | 1,3 |
| 2. La tombée du jour — **PIC** | `pin` + `--dusk` interpolé (sol, photo, type) | La bascule se subit dans le temps | **2,0** |
| 3. La nuit | `stack` (glisse par-dessus 2) + `reveal` | Même geste que 1, sur l'autre sol : on comprend la symétrie sans qu'on la dise | 1,3 |
| 4. Les avis | `flow`, un avis par écran, grand | La confiance ne se scrolle pas vite | 1,6 |
| 5. Le choix | `pin` court, tenu | Deux portes, et on reste devant | 1,0 |

Total ≈ **8,2 écrans**. Quatre familles (flow, stack, pin, reveal), jamais deux
fois la même d'affilée, aucun scrub, aucune vidéo.

**Pages sortie et nuit.** Même système, chacune sur son sol. La sortie garde
son rail (galerie) ; la nuit garde sa visite (monde continu). Leurs héros
deviennent des pages de titre pleine hauteur ; leurs formules quittent les
cartes pour une liste éditoriale à filets ; la réservation est restylée sur le
sol de la page.

---

## 8. Vérification et feel check — 2026-09-03

**Feel check (page parcourue à froid, un mot par chapitre, puis comparé à la
courbe voulue) :**

| Chapitre | Voulu | Ressenti | Écart |
|---|---|---|---|
| 0. Page de titre | Aplomb | Aplomb — le type tient seul, la photo attend dans sa colonne | aucun |
| 1. Le jour | Appétit | Appétit — la mer arrive d'un coup, par-dessus le papier | aucun |
| 2. La tombée du jour | Suspension | Suspension — le sol se dérobe, l'heure arrive après | aucun |
| 3. La nuit | Intimité | Intimité — la cabine recouvre le couchant éteint | aucun |
| 4. Les voix | Confiance | Confiance, un peu **lent** sur ordinateur (62 svh par voix) | mineur, gardé : c'est le silence voulu |
| 5. Le choix | Résolution | Résolution — deux lignes, tenues | aucun |

Le pic est bien la plus grande course (2,3 écrans) et le plus grand changement
visuel de la page. La fin tient, elle ne s'efface pas.

**Mesuré :**
- Harnais : 3 pages × 3 modes, **aucun scroll mort** (une fois `playwright-core`
  réinstallé — le redémarrage du conteneur l'avait emporté et les neuf runs
  échouaient en silence ; il est maintenant en dépendance de dev).
- Contraste des textes de l'accueil, sur pixels composités, texte masqué :
  **5,97 : 1 au pire sur ordinateur, 5,77 : 1 au pire sur téléphone**. Avant
  correction, le titre du jour sur la mer turquoise tombait à 3,48 : 1 : le
  voile monte plus haut et plus dense là où le texte se pose.
- Ligne du couchant : lisible (opacité > 0,5) uniquement à partir de 4,98 : 1,
  puis 6,1 → 8,5 → 13,1 quand la nuit est faite.
- Aucun débordement horizontal sur 14 pages ; console propre sur l'accueil
  dans les deux formats.

**Anti-slop, en relisant le rendu :**
- Face d'affichage : Fraunces, pas Inter/Geist. ✓
- Héro : du type sur du papier avec une photo en colonne — pas de texte
  centré sur dégradé. ✓
- Pas de grille de trois cartes à icônes, pas de carrousel d'avis, pas de
  tableau de prix surligné, pas d'ombre portée, un seul rayon (la pilule). ✓
- Accent : la dorure du logo, mesurée ; le bleu marine réflexe a disparu. ✓
- Signature : la tombée du jour est la chose la plus audacieuse de la page,
  et tout le reste est calme autour. ✓
- Le miroir : ce qui pourrait encore se lire comme « déjà vu » — les plaques
  plein écran à légende basse gauche sont un motif fréquent des sites de
  godly. Ce qui les sauve ici : elles se recouvrent au lieu de s'empiler, le
  sol tombe sous elles, et le contenu (deux vies du même bateau) est le leur.

**Non corrigé, signalé :** « NEXT YACHT » sur le tableau arrière de la photo
du héro nuit, très lisible en plein écran. Le nom d'un bateau est un
identifiant : pas d'effacement sans instruction du client.

**Antérieur, non reproduit hors harnais :** l'avertissement d'hydratation
React #418 en animations réduites sur les deux pages d'expérience.
