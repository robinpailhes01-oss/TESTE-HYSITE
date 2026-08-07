import Nav from './components/Nav'
import Hero from './components/Hero'
import Manifesto from './components/Manifesto'
import Experiences from './components/Experiences'
import Timeline from './components/Timeline'
import Yacht from './components/Yacht'
import Gallery from './components/Gallery'
import Quote from './components/Quote'
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
        <Timeline />
        <Yacht />
        <Gallery />
        <Quote />
        <Offers />
        <Booking />
      </main>
      <Footer />
    </>
  )
}
