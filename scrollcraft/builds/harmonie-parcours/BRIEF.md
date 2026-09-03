# BRIEF — harmonie-parcours

Troisième passe. La v1 (`harmonie-home`) était trop lourde, retirée. La v2
(`harmonie-calme`) était trop sage : « plus de scroll, moins d'écriture, et
surtout en fonction du parcours clients ».

Interviewé : Robin (propriétaire), 2026-08-26.

## Interview

1. **Vibe** : inchangé — « minimaliste et élégant tel un hôtel de luxe »,
   « immersion, hôtel de luxe et élégance ».
2. **Parcours** : **c'est la consigne centrale de cette version**, et elle
   change tout : « surtout en fonction du parcours clients ». La page n'est
   plus une suite de sections de contenu, elle suit l'ordre des questions que
   le visiteur se pose réellement.
3. **Énergie** : « calme et chaleureux » (v1), mais « plus de scroll » (v3).
   Calme ne veut pas dire immobile.
4. **Ressenti / LE moment** : « se sentir en train de vivre l'expérience avant
   d'être venu ». Moment unique non nommé, proposé ci-dessous.
5. **Une chose jamais vue ailleurs** : non répondu. Signature auto-proposée.
6. **Distance au premium-minimal** : premium-minimal, confirmé.
7. **Monde continu ou scènes ?** : ni l'un ni l'autre — des **étapes de
   décision**. Voir la grammaire.
8. **Assets** : les vraies photos, avec licence de les redistribuer (« tu peux
   tester de modifier les photos etc »). Aucune génération : 0 crédit.

## Le parcours client (les questions, dans l'ordre où elles se posent)

C'est la colonne vertébrale de la page. Chaque étape répond à **une** question,
et une seule.

| # | La question du visiteur | L'étape |
|---|---|---|
| 1 | « C'est quoi ? » | Ouverture : un yacht privé, à Carnon |
| 2 | « Qu'est-ce que je peux faire ? » | Le choix : le jour, ou la nuit |
| 3 | « À quoi ressemble une journée ? » | Le jour, en images |
| 4 | « Et une nuit ? » | La nuit — **le pic** |
| 5 | « C'est adapté à mon occasion ? » | Les occasions |
| 6 | « Je peux leur faire confiance ? » | Les vrais avis |
| 7 | « Combien, et quand ? » | Réserver |

Toute section qui ne répond à aucune de ces questions sort de la page
d'accueil. Le contenu détaillé (déroulé heure par heure, spécifications,
grille tarifaire) existe déjà sur les pages dédiées et y reste.

## La courbe émotionnelle

1. **Calme** — le bateau au loin, une ligne, rien d'autre.
2. **Clarté** — deux panneaux, deux prix. La décision est posée nettement.
3. **Envie** — le jour défile latéralement : efoil, paddle, plateau, rires.
4. **Intimité — LE PIC** — la nuit : le salon à la bougie s'immobilise, puis
   le petit-déjeuner se découvre en fondu par-dessus. Le seul endroit où la
   page tient un plan longtemps.
5. **Reconnaissance** — les occasions : « ah, c'est pour mon EVJF ».
6. **Confiance** — de vrais avis Google, chiffrés.
7. **Résolution** — le formulaire, avec la bonne formule déjà cochée.

Aucun couple d'étapes adjacentes ne partage la même émotion.

## Le pic

Étape 4. La phrase qu'un visiteur dirait à un ami :

> « Il y a un moment où tu es dans le salon à la bougie, et le petit-déjeuner
> du lendemain se découvre par-dessus sans que rien ne bouge d'un coup. »

Il reçoit : les deux plus belles photos d'intérieur, le plus grand espace de
défilement de la page, et le silence de l'étape qui le précède (le rail du
jour se termine sur un plan calme).

## La phrase tell-someone

> « C'est le site où le formulaire de réservation avait déjà coché la formule
> que je regardais. »

## La signature — « La formule vous suit » (auto-proposée)

Le site mesure, étape 3 et étape 4, **laquelle des deux expériences le visiteur
a réellement regardée le plus longtemps**. À l'approche du formulaire, cette
formule est déjà sélectionnée.

Pourquoi celle-ci : la consigne est « en fonction du parcours clients ». Un
tunnel de vente qui observe le parcours et s'y adapte, c'est littéralement ça.
Et c'est de l'écriture en moins : plus besoin de demander « laquelle vous
intéresse ? », la page l'a déjà vu.

Silencieux, jamais annoncé : le visiteur constate simplement que le formulaire
savait. Le mécanisme existant du site est réutilisé (l'évènement
`preselect-group` que `BookingForm` écoute déjà), rien n'est ajouté au moteur.

## Silences volontaires

Fin de l'étape 3 : le rail se termine sur un plan large et une seule ligne, sans
photo qui suit immédiatement. C'est le souffle avant le pic, pas du scroll mort.

## Grammaire — « Parcours » (le tunnel guidé), nouvelle

La page est le **chemin de décision du client**. L'unité n'est pas la section
de contenu, c'est l'étape de la décision. Chaque étape répond à une question et
passe la suivante.

**Interdit** : tout paragraphe de prose au-delà d'une ligne ; une section qui ne
répond à aucune question du tableau ci-dessus ; le même prix affiché à deux
endroits ; un adjectif publicitaire sans un fait à côté ; plus de trois éléments
de texte par étape.

**S'appuie sur** : `pin` (ouverture et pic), `reveal` (le choix, le fondu du
pic), `pan` (le rail du jour), `flow` (occasions, avis, formulaire).

### Pourquoi pas les huit autres

- **Filmic one-shot** : déjà pris (v1), et rejeté par le client comme trop lourd.
- **Document raffiné** (v2) : déjà pris, et c'est exactement ce que « plus de
  scroll, moins d'écriture » demande de dépasser.
- **Chaptered editorial** : impose une page de titre sans média au-dessus de la
  ligne de flottaison, et vit de prose longue. L'inverse de la consigne.
- **Live surface** : il n'y a pas de produit logiciel à faire tourner.
- **Continuous world** : la plus chère et la plus fragile, pour un site déjà
  jugé trop lourd une fois.
- **Typographic poster** : le type remplace l'image. Ici l'image *est* le
  produit, et la consigne est moins d'écriture.
- **Gallery / catalog** : proche (labels factuels, peu de texte), mais une
  collection se parcourt librement — un tunnel de réservation se descend dans
  un ordre. La consigne dit « parcours », pas « catalogue ».
- **Rhythmic cutlist** : demande de l'adrénaline et interdit le `pin`. Le pic
  de cette page est un plan tenu.

## Gate d'empreinte

Contre `harmonie-home` : grammaire ✓, héro ✓ (plan épinglé sobre vs vidéo
scrubbée), forme ✓, signature ✓ → **4/6**.
Contre `harmonie-calme` : grammaire ✓, héro ✓ (épinglé et dégraissé vs héro
existant intact), forme ✓ (quatre étapes pilotées vs un seul plan tenu),
signature ✓ → **4/6**.
Partagé avec les deux : la nav existante et la clôture sur le formulaire.

## Feel check (à froid, après build)

| Étape | Voulu | Ressenti | Verdict |
|---|---|---|---|
| Ouverture | Calme | calme | ✓ |
| Le choix | Clarté | clarté | ✓ |
| Le jour | Envie | envie | ✓ |
| **La nuit** | **Intimité** | **intimité** | ✓ |
| Les occasions | Reconnaissance | administratif | ✗ |
| Les avis | Confiance | confiance | ✓ |
| Réserver | Résolution | résolution | ✓ |

**Écart réel, non maquillé** : « Les occasions » ne produit pas de la
reconnaissance, elle se lit comme un routage. C'est la seule étape sans image,
posée sur fond clair entre deux étapes fortes, et elle en paie le prix. Deux
sorties possibles : lui donner une image par occasion (mais c'est du poids que
la consigne « scroll léger » refuse), ou l'admettre comme la partie
administrative du parcours et la garder courte. Gardée courte pour l'instant,
signalée au client.

Pic : la nuit est bien le plus grand changement visuel et le plus long plan
tenu (3 hauteurs d'écran). L'étape qui la précède se termine sur une ligne
seule sans photo — le silence est authored, pas subi. La fin résout sur le
formulaire.

Deux corrections trouvées en lisant la planche, pas par le harnais :
- l'ouverture tenait 1,9 hauteur d'écran pour une poussée de 6 % — près de
  trois écrans de molette pour presque rien. Ramenée à 1,4.
- le second plan de la nuit arrivait à mi-course, laissant 40 % de course
  inerte. Avancé à 0,28.
