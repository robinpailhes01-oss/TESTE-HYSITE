# BRIEF — harmonie-tunnel

Quatrième passe, et la première qui change l'ARCHITECTURE plutôt que la mise en
scène. Consigne du client, verbatim :

> « le tunnel de vente il faudrait que ce soit les gens voient déjà à quoi
> ressemble le bateau et immédiatement puis voir qu'ils ont [le] choix entre
> les sorties en mer ou les nuits insolites. Et en fonction de leur choix, on
> les redirige vers ce qu'ils souhaitent et à partir de là on les met en
> immersion pour leur montrer absolument tout ce dont ils vont avoir accès. »

Question posée en retour (une seule) : que garde-t-on sous le choix pour celui
qui ne clique pas tout de suite ? Réponse : **les avis clients**.

## Le tunnel

| Où | Rôle | Ce qu'on y trouve |
|---|---|---|
| **Accueil** | Aiguiller | Le bateau en entier, puis le choix jour/nuit, puis les avis. Rien d'autre. |
| **Page choisie** | Immerger | Tout ce à quoi on a accès, en photos, puis les formules, puis la réservation. |

L'accueil ne vend plus : il fait choisir. Chaque section supplémentaire y était
une occasion de ne pas choisir. Le formulaire de réservation quitte l'accueil —
on ne réserve pas avant d'avoir choisi.

## La courbe émotionnelle

**Accueil** (3,8 écrans)
1. **Reconnaissance** — le bateau, en entier, dès le premier écran.
2. **Clarté** — deux panneaux, trois faits chacun, deux boutons. À 1,15 écran.
3. **Confiance** — les vrais avis Google, pour celui qui hésite encore.

**Page d'expérience**
4. **Projection** — le héro de l'expérience choisie.
5. **Abondance — LE PIC** — le rail : tout ce qui est à bord défile
   latéralement pendant que le compteur monte jusqu'au total.
6. **Décision** — les formules, puis le formulaire.

## Le pic

Le rail d'immersion. La phrase qu'un visiteur dirait à un ami :

> « Tu scrolles et tu vois défiler tout ce que t'as à bord, avec un compteur
> qui monte jusqu'à sept. »

## La phrase tell-someone

> « C'est le site où on te fait choisir en dix secondes, et après il te montre
> absolument tout ce que tu as. »

## La signature — « Le compte y est »

Un rail de photos MONTRE les prestations. Il ne fait pas SENTIR qu'on les a
toutes vues. Un compteur discret avance avec le défilement et s'arrête sur le
total : `7 / 7 à bord`. On ne regarde pas seulement passer des photos, on
constate l'exhaustivité — ce que la consigne demandait mot pour mot
(« leur montrer absolument tout »).

Il ne compte que du réel : le nombre d'éléments effectivement présents dans le
rail, jamais un chiffre décoratif.

**Ce qui a été retiré, et pourquoi.** Une première version mesurait le temps
passé devant chaque carte de formule pour la pré-cocher dans le formulaire.
Testée : elle ne se déclenche jamais. Les formules sont côte à côte dans une
grille, donc toutes « regardées » en même temps, et le garde-fou (pas d'écart
net, pas de décision) refusait de trancher — correctement. Code supprimé plutôt
que laissé en place à ne rien faire.

## Grammaire — « Tunnel » (aiguillage puis immersion)

L'accueil et les pages d'expérience ne jouent pas le même rôle et n'obéissent
pas aux mêmes règles.

**L'accueil interdit** : tout formulaire, toute grille tarifaire, toute prose,
toute section qui n'est pas le bateau, le choix ou la preuve.
**La page d'expérience interdit** : de redemander de choisir entre le jour et
la nuit (c'est fait), et de faire réserver avant d'avoir tout montré.

## Silences volontaires

Fin du rail : une ligne seule sans photo (« Rien à prévoir, rien à porter. » /
« Et le port qui s'endort autour de vous. ») avant les formules.

## Gate d'empreinte

- vs `harmonie-home` : grammaire ✓, héro ✓, forme ✓, signature ✓ → **4/6**
- vs `harmonie-calme` : grammaire ✓, héro ✓, forme ✓, signature ✓ → **4/6**
- vs `harmonie-parcours` : grammaire ✓ (tunnel sur deux types de pages vs une
  page unique), **nav ✓** (les deux expériences remplacent les ancres),
  forme ✓ (accueil de 3,8 écrans + immersion déportée vs 7,8 écrans sur une
  page), **clôture ✓** (l'accueil ne se termine plus sur le formulaire, il se
  termine sur la preuve), signature ✓ → **5/6**

## Feel check (à froid)

| Étape | Voulu | Ressenti | Verdict |
|---|---|---|---|
| Accueil, le bateau | Reconnaissance | reconnaissance | ✓ |
| Accueil, le choix | Clarté | clarté | ✓ |
| Accueil, les avis | Confiance | confiance | ✓ |
| Page, le héro | Projection | projection | ✓ |
| **Page, le rail** | **Abondance** | **abondance** | ✓ |
| Page, les formules | Décision | décision | ✓ |

## Défauts trouvés en vérifiant, et corrigés

1. **Le rail était sans style sur les pages d'expérience.** Débordement mesuré
   à 0 px : les feuilles sont découpées par module, et la règle rangée dans
   `parcours.css` n'existait pas sur une route qui ne charge pas `Parcours`.
   Extrait dans `rail.css`, importé par le composant lui-même.
2. **Les boutons du choix passaient sous la ligne de flottaison.** Un tunnel
   dont on ne voit pas la sortie n'en est pas un.
3. **`aspect-ratio` + plafond de hauteur rétrécissait les cartes**, laissant un
   trou au milieu de la grille : la largeur se dérivait de la hauteur.
4. **Scroll mort en mouvement réduit** : le rail réservait cinq écrans sans
   bouger. La section se replie désormais en bloc normal.

Les défauts 1 et 4 ne sont visibles qu'en mesurant ; les 2 et 3 qu'en regardant
les captures. Aucun des quatre n'apparaît en lisant le code.
