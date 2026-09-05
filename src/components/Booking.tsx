import { motion } from 'motion/react'
import { useReveal } from '../motion'
import BookingForm from './BookingForm'
import { WHATSAPP_URL } from '../whatsapp'

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
            Choisissez votre formule et votre date, réglez l’acompte de 30&nbsp;% en ligne — votre
            place est bloquée immédiatement. Nous revenons vers vous sous 24&nbsp;heures pour
            finaliser les détails.
          </p>
          <div className="booking__direct">
            <span className="kicker">Directement</span>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              WhatsApp — réponse en moins de 5 min
            </a>
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
