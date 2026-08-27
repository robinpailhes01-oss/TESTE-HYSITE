import Hero from '../components/Hero'
import Experiences from '../components/Experiences'
import Manifesto from '../components/Manifesto'
import Route from '../components/Route'
import Yacht from '../components/Yacht'
import Moment from '../components/Moment'
import Reviews from '../components/Reviews'
import GallerySection from '../components/GallerySection'
import Offers from '../components/Offers'
import Booking from '../components/Booking'

export default function Home() {
  return (
    <main>
      <Hero />
      <Experiences />
      <Manifesto />
      <Route />
      <Yacht />
      <Moment />
      <Reviews />
      <GallerySection />
      <Offers />
      <Booking />
    </main>
  )
}
