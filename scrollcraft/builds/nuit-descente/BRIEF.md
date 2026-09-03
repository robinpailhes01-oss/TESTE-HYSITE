# harmonie-nuit-descente — BRIEF

Page concernée : `/nuit-a-bord-yacht-carnon` du site Harmonie Yacht.
Entretien mené le 2026-08-30. **Non auto-écrit** : les réponses ci-dessous sont
celles du client, en ses mots quand elles sont écrites, en choix explicite quand
elles ont été posées en questions fermées.

---

## 1. Les huit réponses

**1. Vibe, en trois à cinq mots + références.**
« L'ambiance immersion, hôtel de luxe et élégance. » « Ça doit rester calme et
chaleureux. » « minimaliste et élégant tel un hôtel de luxe ».

**2. Le parcours du scroll, section par section, dans ses mots.**
> « faire un scroll en immersion en partant du haut des escaliers jusqu'à
> arriver dans la chambre. »

C'est la totalité de la demande de parcours, et elle est littérale : un seul
trajet, un seul sens, du haut vers le bas.

**3. La courbe d'énergie.**
Basse tout du long, mais pas plate : elle se resserre. On commence large et
lumineux (on voit tout), on se resserre dans le passage (on ne voit plus qu'une
porte), on se rouvre dans la cabine (on est arrivé). L'intensité vient du
rétrécissement, pas du volume.

**4. Ce qu'on doit ressentir, étape par étape, et LE moment à retenir.**
Voir la courbe émotionnelle ci-dessous. Le moment retenu, choisi explicitement :
**le passage de la porte de la cabine.**

**5. Une chose que ce site fait et qu'aucun autre ne fait.**
Choisi explicitement : **« on descend vraiment »** — le scroll ne fait pas
défiler des photos, il fait descendre l'escalier, et le nombre de marches
restantes le dit.

**6. Distance au premium-minimal.**
Premium-minimal assumé, hérité de la consigne constante du client sur ce site :
« minimaliste et élégant tel un hôtel de luxe », « moins d'écriture ».

**7. Un monde continu, ou des scènes distinctes ?**
**Un monde continu.** Répondu dans la demande elle-même : « en partant du haut
des escaliers **jusqu'à** arriver dans la chambre ». C'est le seul cas où ce
skill autorise le chaînage : le brief est littéralement un trajet continu.

**8. Quels assets existent déjà ?**
Trois photos réelles de l'intérieur, prises par le client, fournies dans cette
conversation. Elles couvrent exactement les trois points du trajet :

| Photo | Point du trajet | Ce qu'on y voit |
|---|---|---|
| `src/03-orig.jpg` | Haut des escaliers | Vue plongeante : marches, carré, table ovale, coin cuisine, et la cabine au fond par la porte ouverte |
| `src/02-orig.jpg` | Le couloir, au niveau du sol | Le passage, la penderie, et la porte ouverte sur le lit saumon |
| `src/01-orig.jpg` | La cabine | Le lit rond, les hublots, les bois, les rangements |

Consigne de traitement, dans ses mots :
> « sur les images tu peux les modifier. Juste garde bien les couleurs, et
> caetera, mais tu peux les améliorer pour avoir les pièces un peu plus épurées
> et enlever tous les détails. »

Lumière choisie explicitement : **fin de journée dorée**, qui baisse à mesure
qu'on descend. Les photos sont en plein jour ; la page vend des nuits.

---

## 2. La courbe émotionnelle

Écrite avant les actes. Une ligne par acte : l'émotion, puis ce qui la cause à
l'écran.

| Acte | Émotion | Ce qui la cause |
|---|---|---|
| 1. Le seuil du haut | **Curiosité** — « qu'est-ce qu'il y a en bas ? » | On est au-dessus de tout, on voit l'escalier plonger, et au fond une porte ouverte qu'on ne peut pas encore lire |
| 2. La descente | **Engagement** — on s'enfonce | Le plan avance, la lumière tiédit, les marches restantes diminuent |
| 3. Le carré | **Détente** — c'est plus grand que prévu | Le cadre s'ouvre : le cuir, la table, l'espace. Un temps où rien ne se resserre |
| 4. Le passage — **PIC** | **Intimité** — on entre chez soi | Le couloir se referme sur une seule porte, elle grandit jusqu'à occuper l'écran, le lit apparaît derrière |
| 5. La cabine | **Repos** — on est arrivé | Le plan s'immobilise. Une seule ligne de texte. Plus rien ne bouge |

Aucun acte n'a la même émotion que son voisin. L'acte 3 est volontairement le
plus calme : c'est le silence avant le pic, et il est **authored**, pas du
scroll mort — le cadre respire au lieu d'avancer, et la vérification doit le
lire comme tel.

## 3. Le pic

La phrase qu'un visiteur dirait à un ami :

> « Tu descends l'escalier du bateau, et à la fin la porte de la cabine s'ouvre
> sur toi. »

Il vit dans l'acte 4. Il reçoit la plus grande course de scroll de la section,
et l'acte 3 est plus calme que lui.

## 4. La phrase « c'est le site où… »

> **C'est le site où on descend soi-même dans le bateau avant de le réserver.**

Une expérience, pas un dispositif.

## 5. Silences volontaires

- **Acte 3 (le carré)** : le plan ne recule ni n'avance, il respire. Une seule
  ligne de texte, très espacée. Ce n'est pas du scroll mort : la lumière et
  l'échelle continuent d'évoluer, mesurables.
- **Acte 5 (la cabine)** : le plan tient, immobile, le temps qu'on s'installe.
  C'est la résolution, pas un fondu vers rien.

---

## 6. Grammaire, gate, signature

**Grammaire : worldflight** (un monde continu traversé par le scroll).
Pourquoi les sept autres perdent :
- *Filmic one-shot* : c'est ce qu'a fait `harmonie-home`, et le rejouer
  reproduirait sa forme.
- *Document raffiné*, *parcours*, *tunnel* : déjà pris par les trois autres
  builds de ce même site.
- *Chapitres imprimés*, *surface vivante*, *grille éditoriale* : toutes
  supposent des unités séparées. Le brief dit littéralement l'inverse — un seul
  trajet, sans coupure.

**Signature : « on descend vraiment ».** Un compteur de marches restantes,
discret, qui décroît avec le scroll et disparaît une fois en bas. Codé dans la
page, piloté par `--sc-p`, le moteur n'est pas touché.

**Le gate (4 dimensions sur 6 contre chaque ligne existante) :**

| Contre | grammaire | nav | héro | forme | clôture | signature | Écart |
|---|---|---|---|---|---|---|---|
| `harmonie-home` | ✓ | ✓ | ✓ | ✓ | = | ✓ | **5/6** |
| `harmonie-calme` | ✓ | ✓ | ✓ | ✓ | = | ✓ | **5/6** |
| `harmonie-parcours` | ✓ | ✓ | ✓ | ✓ | = | ✓ | **5/6** |
| `harmonie-tunnel` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **6/6** |

Passe. Le seul partage récurrent est la clôture (la section de réservation
existante de la page), qui n'appartient pas à cette section.

---

## 7. La partition

| Acte | Device | Pourquoi celui-ci | Course |
|---|---|---|---|
| 1. Le seuil du haut | `pin` + travelling avant sur plan fixe | Le trajet doit commencer immobile pour qu'on comprenne d'où on part | 1,1 |
| 2. La descente | `dolly` (échelle + fondu enchaîné) | Une descente est un déplacement, pas une coupe | 1,4 |
| 3. Le carré | `hold` (respiration, pas d'avance) | Le silence avant le pic. Un acte qui avance ici volerait au pic sa progression | 1,0 |
| 4. Le passage — **PIC** | `dolly` serré + cadre qui se referme | Le rétrécissement EST l'émotion : on ne peut pas le raconter, il faut le subir | **2,2** |
| 5. La cabine | `settle` (le plan s'arrête) | Arriver, c'est cesser d'avancer | 1,3 |

Total ≈ **7 hauteurs d'écran** pour la section. Familles de devices : 4
distinctes (pin, dolly, hold, settle), jamais deux fois la même d'affilée, aucun
`scrub` vidéo.

**Pourquoi aucune vidéo.** Le device évident pour une descente serait un clip
scrubbé. Il est écarté pour une raison mesurée, pas par goût : ce site est
majoritairement consulté au téléphone, et un build antérieur de ce même projet a
passé quatre tours de vérification au vert pendant que le clip restait figé sur
l'appareil réel. Des plans fixes déplacés en CSS n'ont pas de décodeur à
satisfaire, pas de politique d'autoplay, pas de Low Power Mode. La descente est
construite en travellings sur images fixes, avec des plans intermédiaires générés
pour que les fondus ne se voient pas.

---

## 8. Révision du 2026-08-30 — « des images en plein écran avec une petite écriture »

Demande du client, textuellement :
> « à chaque fois il y a des images en pleines écran avec une petite écriture,
> de manière à présenter les pièces »

Ce que ça change, et pourquoi c'est plus juste que la version précédente : les
grandes phrases italiques faisaient du texte le sujet et de l'image son fond.
Le client veut l'inverse — montrer les pièces. Donc :

- **Six pièces au lieu de cinq.** Ajout du coin cuisine, une vraie pièce
  visible sur les photos d'origine et qui manquait à la visite.
- **Une légende par pièce, petite**, toujours au même endroit : le nom en
  capitales espacées (11 px), puis un fait sur une ligne (15 → 19 px). Tous les
  faits viennent des données réelles de la formule ou de ce qui est visible sur
  la photo. Rien n'est écrit pour faire joli.
- **La courbe émotionnelle ne change pas** : l'acte du seuil reste le pic et
  garde la plus grande course d'un seul plan (0,24 de la section contre 0,15
  pour le plus long des autres).

Deux défauts trouvés en mesurant, aucun visible en lisant le code :
- en rétrécissant le texte j'ai fait tomber son contraste à **2 : 1** sur les
  cadrages portrait (seuil requis : 4,5 : 1). Ma première correction — un voile
  local sous la légende — se lisait comme un bandeau à bord franc en travers de
  l'image. Remplacée par un dégradé de bas de cadre sur toute la largeur, donc
  sans aucun bord : mesuré à **8,57 : 1 au pire sur ordinateur, 9 : 1 au pire
  sur téléphone**.
- le bouton WhatsApp flottant **coupait la fin de la légende** sur téléphone.
  La légende s'arrête maintenant avant lui.

---

## 9. Révision du 2026-08-30 (2) — la visite virtuelle plein écran

> « quand on arrive sur les nuits, chaque image et le haut de page doit être en
> pleine écran. Ça fait comme une visite virtuel, les photos change au scroll »

- **Le héro passe en plein écran** (100 svh au lieu de 68). La visite commence
  donc dès l'arrivée : une image coupée aux deux tiers annonce un document,
  pas un lieu.
- **La visite passe de six à dix plans** et couvre toute la nuit dans l'ordre
  réel : les six pièces, puis la sortie au couchant, la table dressée, le salon
  le soir, le petit-déjeuner.
- **Le rail de photos disparaît de la page nuit.** Une vignette de 200 px dans
  un rail est l'exact contraire de « chaque image en plein écran ». Ses six
  éléments sont repris par la visite (quatre en plein écran, deux déjà couverts
  par le héro et la cabine).

Quatre photos du client ont été reprises en 16:9 haute résolution : les
originales font 960 px de large, donc en plein écran sur ordinateur elles
étaient floues. Le contenu est intact — même scène, mêmes objets, même lumière.
La photo du réveil sur le pont n'a pas été touchée : une personne y figure, et
on ne régénère pas le visage de quelqu'un.

Trois défauts trouvés en mesurant :
- **les dix légendes se chevauchaient deux à deux.** En comprimant les fenêtres
  pour passer de six à dix plans, je n'avais pas recalculé les intervalles :
  chaque fondu mordait sur le suivant, donc deux légendes se lisaient au même
  endroit. Recalculé pour 0,040 d'écart et un fondu de 0,014, soit 0,012 de
  silence net. Vérifié sur 201 positions : **zéro** superposition.
- **le harnais déclarait toute la visite « scroll mort »** — à raison de son
  point de vue : le mouvement de cette section ne passe par aucun de ses
  devices, et le rail qui lui servait de repère avait disparu de la page. La
  section publie désormais son état visuel réel (`data-sc-verify-state`), ce
  que le harnais prévoit explicitement pour les scènes sur mesure. Les trois
  modes repassent au vert, et la vérification voit vraiment les plans défiler.
- contraste des légendes revérifié sur les dix : **6,05 : 1 au pire sur
  ordinateur, 8,94 : 1 au pire sur téléphone**.

**Pas corrigé, et signalé au client :** le tableau arrière du bateau porte
« NEXT YACHT » sur la photo du héro. À 68 % de l'écran on ne le lisait pas ; en
plein écran c'est la première chose qu'on lit, juste au-dessus du titre
« Nuits insolites ». Le nom d'un bateau est un identifiant : je ne l'efface pas
sans instruction.

**Non reproduit et non corrigé :** un avertissement d'hydratation React (#418)
apparaît en mode animations réduites sous le harnais. Il se produit aussi sur
`/sortie-en-mer-carnon`, qui n'a pas de visite, et pas sur l'accueil : il est
antérieur à ce travail. Une première piste (la branche `useReducedMotion` du
héro) s'est révélée fausse et a été annulée, parce que la retirer supprimait un
vrai comportement d'accessibilité.
