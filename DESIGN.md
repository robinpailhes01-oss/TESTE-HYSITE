# Harmonie Yacht — Design Spec v2

## Référence client

Hero type « yacht club éditorial » : océan bleu profond vu du ciel, bateau en vue aérienne
au centre du titre, typographie mixte (grotesque + serif italique élégante dans la même
phrase), méta discrètes de part et d'autre (lieu / disponibilité), arc de parcours en
pointillés, CTA centré, nav minimale avec monogramme script au centre.

## Brief (inchangé sur le fond)

- **Offre** : location privatisée d'un yacht avec skipper — sorties en mer à la journée,
  nuits insolites à quai.
- **Job de la page** : demander une réservation / disponibilité.
- **Stand against** : le look marketplace nautique et le premium sombre « hôtel de nuit »
  de la v1 — la v2 assume la lumière méditerranéenne.

## Direction esthétique v2

**« Un annuaire de régate contemporain (typo mixte grotesque / serif italique) + la
Méditerranée vue du ciel (drone, eau texturée, lumière plein jour). »**

## Tokens

- **Couleur**
  - `ocean` : `#1A4C74` — bleu océan riche, fond héro & sections immersives
  - `ocean-deep` : `#123A5C` · `ocean-ink` : `#0C2B45` (footer, réservation)
  - `foam` : `#F5F8FA` — sections claires
  - `ink` : `#14314C` — texte sur clair
  - `sand` : `#EFE7D8` — accent chaud discret (fonds de détail)
  - lignes : blanc/encre à 25 % d'opacité, pointillés pour la signature
- **Type**
  - Sans : **Instrument Sans** (400/500/600) — titres et corps
  - Serif : **Instrument Serif italique** — mots-accents *dans* les titres (jamais des
    titres entiers), monogramme
  - Titres display : sans light 64–110px desktop, mots italiques en Instrument Serif
- **Espacement** : base 8 — mêmes gammes que v1
- **Radius** : 8px boutons, 14px cartes/images (la v2 est plus douce que la v1)
- **Motion** : ease `cubic-bezier(0.22,1,0.36,1)`, reveals mot à mot sur le héro,
  arc pointillé qui se dessine (dashoffset), reveals doux au scroll,
  `prefers-reduced-motion` partout

## Signature

Le **parcours en pointillés** : l'arc de course du héro, repris comme ligne de parcours
dans la timeline « À bord » (les étapes = waypoints), et en séparateurs pointillés.
Deuxième signature : la **typo mixte** sans/serif-italique dans chaque titre.

## Layout homepage

1. Héro plein écran — photo drone voilier centré, titre mixte 4 lignes par-dessus,
   méta gauche (port d'attache) / droite (disponibilité), arc pointillé, CTA centré
2. Manifeste — foam, texte large, bandeau de données
3. Expériences — diptyque Sorties en mer (proue vue du ciel) / Nuits à quai (couchant)
4. À bord — parcours jour/nuit en waypoints sur ligne pointillée, fond océan
5. Le yacht — specs + photo
6. Galerie — grille asymétrique (textures d'eau, champagne, plage)
7. Tarifs — deux formules claires
8. Réservation — formulaire mailto sur océan profond
9. Footer — ocean-ink

## Mobile (soigné explicitement)

- Nav : monogramme centré + burger, panneau plein écran océan
- Héro : titre mixte sur 4 lignes compactes, méta empilées sous le titre, arc masqué,
  CTA pleine largeur, bateau recadré `object-position` pour rester visible sous le titre
- Timeline : ligne pointillée verticale, waypoints à gauche
- Grilles : tout passe en 1 colonne, hauteurs d'images plafonnées, boutons pleine largeur
