---
target: accueil de la prévisualisation (Tour.tsx et compagnons)
total_score: 19
max_score: 32
na_heuristics: 7,10
p0_count: 2
p1_count: 3
target_identity: "file:/home/user/TESTE-HYSITE/src/components/Tour.tsx"
target_fingerprint: "sha256:0c9092aea3eeebb7f425e48278ca9951b38397ddb623b03f355fcc9ddd683b7f"
target_path: /home/user/TESTE-HYSITE/src/components/Tour.tsx
timestamp: 2026-09-12T08-06-16Z
slug: src-components-tour-tsx
---
# Critique impeccable — accueil « Le tour du propriétaire » (prévisualisation)

Method: dual-agent (A : revue de design · B : détecteur et navigateur). Cible : src/components/Tour.tsx et ses compagnons (WhatsAppNudge, LeadMagnet, WhatsAppButton, ReviewToast), page Sortie en second plan.

## Score de santé du design

| # | Heuristique | Note | Problème clé |
|---|---|---|---|
| 1 | Visibilité de l'état du système | 1 | Clic sur une date de l'accueil → page Sortie en haut, sans confirmation ; « Les dates » (ordinateur) → écran noir |
| 2 | Correspondance avec le monde réel | 4 | « Checkout à midi » |
| 3 | Contrôle et liberté | 2 | Rail qui coupe son amorce ; bulle sans disparition automatique ; glissé horizontal accidentel |
| 4 | Cohérence et standards | 3 | Deux calendriers différents ; pop-up et toast d'un autre vocabulaire |
| 5 | Prévention des erreurs | 2 | Date sans heure : erreur loin du champ, recouverte par le toast sur téléphone |
| 6 | Reconnaissance plutôt que rappel | 3 | Ordre des stations ≠ ordre de la visite |
| 7 | Flexibilité et efficacité | n/a | Surface de persuasion |
| 8 | Esthétique et minimalisme | 2 | Quatre compagnons recouvrent la page |
| 9 | Récupération des erreurs | 2 | Message mal placé, invisible sur téléphone |
| 10 | Aide et documentation | n/a | Surface de persuasion |
| Total | | 19/32 | Acceptable (59 %) |

## Verdict de spécificité
Authored pour ce produit (couchant à l'heure vraie, plan du bord, stations horodatées, portes finales). Réserves : clip du héro à l'apparence générée sur un poster de midi ; compagnons dans le registre logiciel refusé par la charte.
Scan : 6 alertes CLI « broken-image » toutes fausses (src via pic()). Navigateur : 80 signalements accueil / 14 page Sortie ; réels : texte fonctionnel trop petit (calendrier 10 px / 8 px mobile, étiquettes du plan 10,5 px), capitales sur 8 blocs, repères au-dessus de 4 titres. Faux positifs : palette crème (Voile), police surutilisée (deux familles), halo #ffba00 (aucun élément), raster délavé (affiche de secours), contraste héro Sortie (fond lu au lieu de la photo).

## Problèmes prioritaires
- [P0] La date cliquée sur l'accueil atterrit en haut de la page Sortie (scrollY 0, formulaire à 8 445 px). Fix : défiler au formulaire, ligne « Dimanche 13 septembre est retenu. Il reste l'heure de départ. », ouvrir le choix d'heure. /impeccable harden
- [P0] La bulle de Ludivine recouvre chaque acte (repère du héro, titre de la descente, avis, H1 mobile, calendrier du formulaire). Fix : accueil → seulement en clôture ou sur retour arrière ; pages d'expérience → seulement la variante date ; disparition auto 12 s ; jamais au-dessus d'un calendrier ni d'un bouton de paiement. /impeccable quieter
- [P1] « Les dates » (ordinateur, Lenis) atterrit sur un écran noir (progression 0) ; 800 px de noir entre le réveil et les dates. Fix : viser la fin de l'acte et relire le moteur ; raccourcir le tracé du plan. /impeccable layout
- [P1] Le rail « Le jour » coupe son texte d'amorce. Fix : amorce collante à gauche (ordinateur), au-dessus du rail (téléphone). /impeccable adapt
- [P1] Calendrier de clôture non tactile : 42 boutons 39×16 px police 8 px (téléphone), 46×20 px (ordinateur). Fix : liste de 7 jours en lignes de 56 px au téléphone ; marques 32 px / 11,5 px sur ordinateur ; masquer le logo en clôture mobile. /impeccable adapt
- [P2] Clip du héro et compagnons contre la charte (poster midi / clip crépuscule ; pop-up avant le formulaire ; toast à étoiles ; « 24 heures » vs « 5 minutes »). /impeccable polish

## Personas
Jordan : jargon des stations, prix tard, « Payer » muet sans heure. Casey : H1 sous la bulle, glissé accidentel, 42 boutons minuscules, bulle sur le calendrier, toast sur la case CGV. Riley : écran noir, ?date= en haut, relais bulle → pop-up → toast, « à partir du 1er septembre » périmé, « Ultra Premium ». Couple de Montpellier : chambre à 62 %, petit-déjeuner à 78 %, prix à 100 %, pop-up en arrivant sur la page Nuit.

## Observations mineures
« Les dates » et logo invisibles sur l'eau sombre ; points du plan sur les photos du rail ; logo qui chevauche les débuts d'acte ; avis « premium »/« inoubliable » ; « Checkout à midi » ; mois absent du calendrier ; pas de focus-visible distinct ; Instrument Sans 600 déclarée non chargée ; fantôme du bandeau à 5 % ; message pré-rempli trop long ; tracé du plan à 18 % en mouvement réduit.

## Questions
Pourquoi le seul choix de la page n'arrive-t-il qu'à 12 000 px ? Le bateau qui tourne est-il celui des photos ? Combien de voix a Ludivine ?
