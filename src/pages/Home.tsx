import Parcours from '../components/Parcours'
import Reviews from '../components/Reviews'
import Booking from '../components/Booking'

/* La page d'accueil suit le parcours du client : une étape par question qu'il
   se pose, dans l'ordre où il se la pose (cf. Parcours.tsx), puis la preuve
   (les vrais avis) et la réservation.

   Le détail — déroulé heure par heure, spécifications du bateau, grille
   tarifaire complète, galerie — vit sur les pages dédiées, qui restent les
   cibles SEO. Une page de décision n'a pas à le répéter. */
export default function Home() {
  return (
    <main>
      <Parcours />
      <Reviews />
      <Booking />
    </main>
  )
}
