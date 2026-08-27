import Parcours from '../components/Parcours'
import Reviews from '../components/Reviews'

/* L'accueil est un aiguillage : on voit le bateau, on voit le choix, on part
   sur la page de son choix. Les avis restent en dessous pour celui qui hésite
   encore. L'immersion et la réservation vivent sur les deux pages
   d'expérience — c'est là que le client sait déjà ce qu'il veut. */
export default function Home() {
  return (
    <main>
      <Parcours />
      <Reviews />
    </main>
  )
}
