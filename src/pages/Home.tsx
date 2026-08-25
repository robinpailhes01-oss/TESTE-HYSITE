import Immersion from '../components/Immersion'
import Manifesto from '../components/Manifesto'
import Experiences from '../components/Experiences'
import Yacht from '../components/Yacht'
import Reviews from '../components/Reviews'
import GallerySection from '../components/GallerySection'
import Offers from '../components/Offers'
import Booking from '../components/Booking'

/* La séquence immersive (Immersion) raconte la soirée à bord heure par heure —
   elle remplace l'ancien trio Hero / Route / Band. Le contenu de conversion
   (prestations, avis, tarifs, réservation) reprend la main juste après. */
export default function Home() {
  return (
    <main>
      <Immersion />
      <Manifesto />
      <Experiences />
      <Yacht />
      <Reviews />
      <GallerySection />
      <Offers />
      <Booking />
    </main>
  )
}
