import Nav from './components/Nav'
import Hero from './components/Hero'
import Manifesto from './components/Manifesto'
import Experiences from './components/Experiences'
import Route from './components/Route'
import Yacht from './components/Yacht'
import Gallery from './components/Gallery'
import Offers from './components/Offers'
import Booking from './components/Booking'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Manifesto />
        <Experiences />
        <Route />
        <Yacht />
        <Gallery />
        <Offers />
        <Booking />
      </main>
      <Footer />
    </>
  )
}
