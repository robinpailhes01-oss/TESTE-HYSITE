# harmonie-histoire — BRIEF

Troisième accueil de la refonte « La carte d'invitation », 2026-09. Identité :
`branding/brand.md`. Tokens : `DESIGN.md`.

**Statut de l'entretien :** les réponses viennent du client, dans ses mots,
après avoir vu la scène partagée (« le rideau ») sur son téléphone :

> « Je n'aime pas le site en une seule page qui scroll partout. Je veux
> raconter une histoire, avec un hook, un message pour nos voyageurs et leur
> faire voyager par nos différentes prestations au scroll léger mais fluide
> et clair. Digne d'un hôtel de luxe, on parle peu mais on montre. De manière
> à la fin quand il voit le prix ils disent ce n'est pas cher tellement la
> qualité du site est exceptionnelle. »

## 1. Les réponses

1. **Vibe.** « Digne d'un hôtel de luxe, on parle peu mais on montre. »
2. **Le parcours** (dans ses mots). Un hook, un message pour les voyageurs,
   le voyage par les prestations, le prix à la fin.
3. **L'énergie.** « Scroll léger mais fluide et clair. » Basse, continue,
   sans épinglage.
4. **Le moment à retenir.** Le prix, qui arrive après tout le reste et paraît
   bas.
5. **Ce qu'aucun site ne fait.** Ne pas dire le prix avant d'avoir fait le
   voyage ; et le dire alors comme une carte posée dans une chambre.
6. **Distance au premium-minimal.** Hôtel de luxe : premium-minimal
   éditorial, air, photos, peu de mots.
7. **Monde continu ou scènes ?** Ni l'un ni l'autre : un récit en flux, des
   chapitres qui se lisent en défilant, rien d'épinglé.
8. **Assets.** Les photos du site, réelles, sans génération.

## 2. La courbe émotionnelle

| Chapitre | Émotion | Ce qui la cause |
|---|---|---|
| 0. L'accroche | **Désir** | Le couchant vu du pont, plein écran, une ligne : « Un seul yacht. À vous seuls. » |
| 1. Le message | **Confiance** | Sur Voile, deux phrases : on ne loue pas un bateau, on vous reçoit ; Robin et Ludivine attendent au ponton |
| 2. Le jour, 9 h → 19 h | **Appétit** | Quatre chapitres, une heure, une ligne, une photo, une légende : le large, l'eau, la table, les amis |
| 3. Le passage | **Suspension** | Le couchant à l'heure vraie de ce soir, et le sol qui tourne au noir en le passant |
| 4. La nuit, 21 h → 10 h | **Intimité** | La table à deux, la cabine, le réveil |
| 5. Les voix | **Assurance** | Trois avis courts, réels, sur le noir |
| 6. Les prix — **PIC** | **Soulagement** | Une carte de tarifs, tout compris, deux portes |

Aucun voisin ne partage l'émotion de son voisin. Le silence avant le pic : les
voix, du texte seul.

## 3. Le pic

> « J'ai fait toute la journée et la nuit avec eux, et à la fin la carte dit
> 250 € la nuit. »

Chapitre 6. C'est la demande explicite du client : que le prix arrive en
dernier et paraisse bas au regard de ce qu'on vient de voir.

## 4. « C'est le site où… »

> **C'est le site où tu vis la journée heure par heure, le jour tombe sous
> tes yeux à l'heure vraie, et le prix n'arrive qu'à la fin.**

## 5. Silences volontaires

- Le message (chapitre 1) : du texte sur Voile, aucune image.
- Les voix (chapitre 5) : du texte sur la nuit, aucune image.

## 6. Grammaire, gate, signature

**Grammaire : récit d'hôtel** (nommée ici) : un document en flux, un chapitre
par heure de la journée à bord, une photo par chapitre, une ligne, une
légende, rien d'épinglé ; le sol change une fois, au passage du couchant.
Pourquoi les autres perdent : le client a refusé la page épinglée (scène
partagée, filmic, monde continu) ; le chapitre éditorial (2.2) est proche mais
il est pris par `harmonie-refonte` avec sa pile de plaques, son folio et sa
page de titre en type, tous absents ici.

**Signature : « le fil et l'heure ».** Un fil de laiton descend le long du
récit et s'allonge avec la lecture ; chaque chapitre y accroche son heure
(9 h, 11 h, 13 h, 19 h, le couchant à l'heure vraie, 21 h, 23 h, 10 h). Le
prix est au bout du fil.

**Le gate.**

| Contre | Écart |
|---|---|
| `harmonie-home` (filmic, nav fixe, scrub, suite d'actes, réservation, l'heure du bord) | 5/6 (l'heure comme signature est voisine) |
| `harmonie-calme` (document raffiné, nav fixe, photo fixe, un pin, réservation, le souffle) | 4/6 (nav et photo fixe partagées) |
| `harmonie-parcours` (parcours, nav fixe, pin court, pin→flow→pan→pin, réservation, la formule vous suit) | 5/6 |
| `harmonie-tunnel` (tunnel, nav fixe, pin court, accueil 3,8 écrans, la preuve, le compte y est) | 5/6 |
| `harmonie-nuit-descente` (worldflight, nav fixe, travelling, une course de 9,5 vh, réservation, on descend vraiment) | 5/6 |
| `harmonie-refonte` (chapitre éditorial, ligne + folio, page de titre, pile de plaques, deux portes en texte, la tombée du jour) | 5/6 |
| `harmonie-rideau` (scène partagée, couture, 50/50, un stage de 6 vh, la fermeture, le rideau) | 6/6 |

Passe.

## 7. La partition

| Chapitre | Device | Course (écrans) |
|---|---|---|
| 0. L'accroche | photo plein écran, `in` | 1,0 |
| 1. Le message | `flow` + `in` | 0,9 |
| 2. Le jour | 4 chapitres `flow` + `in` + parallaxe léger (6 %, pointeur fin) | 4,2 |
| 3. Le passage | photo plein écran, `in`, bascule du sol | 1,2 |
| 4. La nuit | 3 chapitres `flow` + `in` + parallaxe | 3,0 |
| 5. Les voix | `flow` + `in` | 1,0 |
| 6. Les prix | `flow` + `in` | 1,2 |

Total ≈ **12,5 écrans** sur ordinateur, **12,2** sur téléphone. Aucun pin.

## 8. Vérification — 2026-09-03

- Captures ordinateur (13 écrans), téléphone (13) et mouvement réduit : aucun
  débordement horizontal, console propre, le sol tourne au noir au passage du
  couchant (écran 7 sur ordinateur, 6 sur téléphone) et revient au jour si
  l'on remonte.
- Téléphone : pas de parallaxe, pas de fil, pas de Lenis ; seules les
  arrivées en fondu restent.

**Non vérifié :** un vrai téléphone.
