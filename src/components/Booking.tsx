import { motion } from 'motion/react'
import { useReveal } from '../motion'
import BookingForm from './BookingForm'

const CONTACT_EMAIL = 'harmonieyacht@gmail.com'

export default function Booking() {
  const intro = useReveal()
  const form = useReveal(0.12)

  return (
    <section className="section on-ocean-deep on-ocean" id="reservation">
      <div className="container booking">
        <motion.div className="booking__intro" {...intro}>
          <p className="kicker">Réservation</p>
          <h2 className="mixed booking__title">
            Dites-nous la date, <span className="it">nous préparons le reste</span>
          </h2>
          <p className="booking__text">
            Racontez-nous l’occasion — un anniversaire, une demande, une simple envie de large.
            Nous revenons vers vous sous 24&nbsp;heures avec une proposition sur mesure.
          </p>
          <div className="booking__direct">
            <span className="kicker">Directement</span>
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </div>
        </motion.div>

        <motion.div className="booking__form" {...form}>
          <BookingForm />
        </motion.div>
      </div>
    </section>
  )
}
