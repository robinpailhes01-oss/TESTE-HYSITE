/* ---------------------------------------------------------------------------
   Avis clients — copiés depuis la fiche Google d'Harmonie Yacht (vrais avis,
   texte inchangé à part la ponctuation). Ajoutez-en au fur et à mesure :
   rien n'oblige à tous les afficher, mais chaque entrée peut nourrir aussi
   bien la section « Avis » que la notification qui apparaît près de la
   réservation.
--------------------------------------------------------------------------- */

export const GOOGLE_REVIEWS_URL = 'https://share.google/siKxvFXOcmnevziOp'

export type Review = {
  name: string
  initials: string
  stars: number
  text: string
  when: string // tel qu'affiché par Google ("Il y a 2 jours", "Visité en août"…)
}

export const REVIEWS: Review[] = [
  {
    name: 'Ani Ka',
    initials: 'A',
    stars: 5,
    text: 'Une excursion incroyable du début à la fin ! Le coucher de soleil était juste magnifique, l’ambiance au top et l’organisation parfaite. L’équipe était adorable, professionnelle et vraiment aux petits soins.',
    when: 'Visité en août',
  },
  {
    name: 'juliette dur',
    initials: 'J',
    stars: 5,
    text: 'On a passé un super moment sur le yacht avec les enfants ! Les 2 heures sont passées super vite, surtout avec le coucher de soleil, c’était vraiment magnifique. On reviendra avec plaisir pour un après-midi barbecue cette fois-ci.',
    when: 'Visité en août',
  },
  {
    name: 'Christophe Bourgin',
    initials: 'C',
    stars: 5,
    text: 'Capitaine au top et super ambiance, à faire quand vous venez dans le coin pour une sortie bateau.',
    when: 'Visité en août',
  },
  {
    name: 'A G',
    initials: 'A',
    stars: 5,
    text: 'Merci à Imad et Robin pour l’expérience unique ! C’était incroyable, on a pu voir l’éclipse en plein milieu de la mer.',
    when: 'Il y a 2 jours',
  },
  {
    name: 'Thomas Pace',
    initials: 'T',
    stars: 5,
    text: 'Expérience incroyable pour l’éclipse. Un hôte super sympathique. À refaire, je recommande.',
    when: 'Il y a 2 jours',
  },
  {
    name: 'Nathalie',
    initials: 'N',
    stars: 5,
    text: 'Nous avons passé un super moment à bord du yacht pour fêter un anniversaire entre amis. Sortie de 2h au coucher du soleil, c’était magnifique ! Nous avons pu sauter du bateau, profiter du paddle mis à disposition. Le yacht était très propre et bien entretenu, l’équipe très gentille, serviable et aux petits soins. Une très belle expérience, merci pour votre accueil et votre gentillesse !',
    when: 'Il y a 3 jours',
  },
  {
    name: 'Soni Denaux',
    initials: 'S',
    stars: 5,
    text: 'Superbe balade, merci à notre capitaine Robin pour son professionnalisme et sa gentillesse, je recommande vivement !',
    when: 'Il y a 2 semaines',
  },
  {
    name: 'Louise Moulin',
    initials: 'L',
    stars: 5,
    text: 'Super matinée passée sur le bateau avec Robin, je recommande.',
    when: 'Il y a 2 semaines',
  },
  {
    name: 'Alpack',
    initials: 'A',
    stars: 5,
    text: 'Une prestation véritablement premium ! Robin a été parfait du début à la fin. Je recommande !',
    when: 'Il y a 2 semaines',
  },
  {
    name: 'Ines Harichane',
    initials: 'I',
    stars: 5,
    text: 'Super après-midi, merci encore à tout l’équipage ! BBQ, la musique, l’équipe nous a mis à l’aise, je recommande.',
    when: 'Il y a 4 semaines',
  },
  {
    name: 'Amélie le rolland',
    initials: 'A',
    stars: 5,
    text: 'Balade en famille parfaite, Robin était au petit soin. Ce n’était pas la première fois qu’on avait réservé ce yacht, nous recommencerons encore à l’occasion, merci pour tout, à très vite.',
    when: 'Il y a 6 semaines',
  },
  {
    name: 'Padely Club',
    initials: 'P',
    stars: 5,
    text: 'Une journée au top pour un EVJF ! Un immense merci à l’équipe pour son accueil, sa gentillesse et son professionnalisme, aux petits soins du début à la fin. Je recommande sans hésiter !',
    when: 'Il y a 6 semaines',
  },
  {
    name: 'Bob Dylan',
    initials: 'B',
    stars: 5,
    text: 'Une journée au top, le bateau est top, très fonctionnel ! Robin et Lulu sont aux petits soins. Je recommande à 100 %.',
    when: 'Il y a 5 semaines',
  },
  {
    name: 'Tchaka Guimonwara',
    initials: 'T',
    stars: 5,
    text: 'Personnel très sympa et très accueillant. Je le recommande. Merci beaucoup, c’était incroyable.',
    when: 'Il y a 5 semaines',
  },
  {
    name: 'Min Jung Hong',
    initials: 'M',
    stars: 5,
    text: 'Réservé pour un samedi fin d’après-midi pour fêter mon anniv avec un groupe de 8 copains. Le yacht est magnifique, l’équipe à bord a été adorable et très gentille. Je recommande les yeux fermés !',
    when: 'Il y a 5 semaines',
  },
  {
    name: 'Jess Ous',
    initials: 'J',
    stars: 5,
    text: 'Une expérience inoubliable à bord du Yacht Harmonie ! La sortie en mer était magique, avec des paysages magnifiques et un coucher de soleil à couper le souffle. Le petit-déjeuner était particulièrement généreux et délicieux. Nous avons beaucoup apprécié la qualité de l’accueil, la disponibilité et la gentillesse de Robin et Ludivine.',
    when: 'Il y a 11 semaines',
  },
  {
    name: 'Sofia Capuozzi',
    initials: 'S',
    stars: 5,
    text: 'Une expérience juste magnifique, je me suis sentie en vacances à seulement 15 minutes de Montpellier. Sortie en mer entre amis qui offre une vraie déconnexion et des souvenirs inoubliables, sans parler de l’accueil des propriétaires qui ont été aux petits soins ! Je recommande à 100 % le Harmonie Yacht.',
    when: 'Il y a 11 semaines',
  },
  {
    name: 'Jimmy Sparfel',
    initials: 'J',
    stars: 5,
    text: 'Expérience en mer incroyable, on est sortis entre potes, accueil au top. Nous avons réservé 4h avec un barbecue. Je recommande à 100 %.',
    when: 'Il y a 11 semaines',
  },
  {
    name: 'Antoanela Boroi',
    initials: 'A',
    stars: 5,
    text: 'L’expérience était exceptionnelle du début à la fin. L’équipage à bord était très sympathique, accueillant et toujours disponible pour rendre la sortie encore plus agréable.',
    when: 'Il y a 10 semaines',
  },
  {
    name: 'EveB',
    initials: 'E',
    stars: 5,
    text: 'Super expérience à faire en groupe d’amis ! Le capitaine est très gentil, vous passerez forcément un bon moment. Je recommande.',
    when: 'Il y a 9 semaines',
  },
]
