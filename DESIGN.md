# Harmonie Yacht — Design Spec

## Brief (brand strategist pass)

- **Offre** : location privatisée d'un yacht avec skipper — sorties en mer à la journée, et nuits insolites à quai (le yacht comme suite flottante d'hôtel 5 étoiles).
- **UVP** : Harmonie Yacht offre aux couples et petits groupes en quête de moments d'exception le privilège d'un yacht privé — en mer le jour, en suite flottante la nuit — avec le soin d'une maison d'hôtes 5 étoiles.
- **Audience (psychographie)** : gens qui offrent des moments, pas des objets — anniversaires, demandes, escapades. Ils ont connu les beaux hôtels ; ce qu'ils cherchent maintenant, c'est le rare et le privé. Ils se méfient du « jet-ski loisirs » et des marketplaces de bateaux.
- **Job unique de la page** : demander une réservation / disponibilité.
- **Champ concurrentiel** : Click&Boat / SamBoat (look marketplace, cartes produits, bleu tech) ; hôtels 5 étoiles (le standard de service à égaler).
- **Stand against** : le look marketplace nautique, le bleu marine réflexe, l'iconographie « loisirs nautiques ».
- **Archétypes** : **Lover + Ruler** — sensorialité (matières, lumière, moments) tenue par une autorité calme (protocole, précision, service).

## Direction esthétique

**« La retenue hôtelière d'un Aman Resort + les matériaux d'un Riva classique (teck, laiton, laque de nuit). »**

Le site emprunte à l'hôtellerie de très haut niveau sa hiérarchie silencieuse (serif éditorial, marges généreuses, petites capitales espacées) et au yachting classique ses matières : laque sombre presque noire-verte, laiton chaud, ivoire de voilerie. Aucun bleu « nautique ». Le mouvement suit un timing de marée : lent, ample, jamais sec.

## Tokens

- **Couleur**
  - `surface` (laque de nuit) : `#101B1D` — fond dominant, vert-noir profond
  - `surface-raised` : `#162427`
  - `ivory` : `#F1EBDF` — sections claires, texte sur sombre
  - `ivory-muted` : `rgba(241,235,223,.62)`
  - `brass` : `#C29A5E` — accent unique, réservé signature + CTA
  - `ink` : `#1A2224` — texte sur ivoire
- **Type**
  - Display : **Cormorant Garamond** (serif, light/medium, italiques pour le mot-accent)
  - Corps : **Jost** (géométrique humaniste, proche des lettrages de coque)
  - Utilitaire : petites capitales Jost, letter-spacing 0.2em (kickers, données)
  - Échelle : 12 / 14 / 16 / 20 / 25 / 31 / 39 / 49 / 61 / 76
- **Espacement** : base 8px — 8/16/24/32/48/64/96/128/192
- **Radius** : 2px max (structurel) — le luxe ici est anguleux et calme, pas de pilules sauf CTA (plein, pas arrondi excessif)
- **Ombres** : aucune — bordures hairline `1px rgba(194,154,94,.25)` et lumière des images
- **Motion** : 120ms micro / 400ms standard / 900–1200ms reveals « marée », easing `cubic-bezier(0.22, 1, 0.36, 1)` ; `prefers-reduced-motion` respecté partout

## Signature

**La ligne d'horizon en laiton** : un trait hairline doré qui structure tout le site — il souligne le hero au niveau de l'horizon réel de la photo, sert de séparateur de sections, et porte la timeline « votre journée à bord ». Les reveals montent depuis cette ligne comme une marée.

## Layout (une page, narration au scroll)

1. Hero plein écran — photo yacht à l'ancre à l'heure dorée, titre serif avec mot-accent italique laiton, ligne d'horizon
2. Manifeste éditorial — texte serif large, chiffres du yacht en données petites capitales
3. Les deux expériences — diptyque asymétrique Sorties en mer / Nuits à quai (pas de cartes-icônes)
4. Déroulé — timeline horizontale sur la ligne d'horizon (embarquement → mouillage → retour / soir → nuit → petit-déjeuner)
5. Galerie éditoriale — grille asymétrique
6. Une seule citation d'invité (pas de carrousel)
7. Réservation — formulaire minimal (mailto harmonieyacht@gmail.com), tarifs « à partir de » éditables
8. Footer laque de nuit
