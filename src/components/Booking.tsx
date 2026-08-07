import { useState } from 'react'
import type { FormEvent } from 'react'
import { motion } from 'motion/react'
import { useTideReveal } from '../motion'

const CONTACT_EMAIL = 'harmonieyacht@gmail.com'

export default function Booking() {
  const intro = useTideReveal()
  const form = useTideReveal(0.15)
  const [sent, setSent] = useState(false)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const name = String(data.get('name') ?? '')
    const email = String(data.get('email') ?? '')
    const experience = String(data.get('experience') ?? '')
    const date = String(data.get('date') ?? '')
    const message = String(data.get('message') ?? '')

    const subject = encodeURIComponent(`Demande de réservation — ${experience}`)
    const body = encodeURIComponent(
      `Nom : ${name}\nEmail : ${email}\nExpérience : ${experience}\nDate souhaitée : ${date}\n\n${message}`,
    )
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
    setSent(true)
  }

  return (
    <section className="section" id="reservation">
      <div className="container booking">
        <motion.div className="booking__intro" {...intro}>
          <p className="kicker">Réservation</p>
          <h2 className="display booking__title">
            Dites-nous <em>la date</em>, nous préparons le reste
          </h2>
          <p className="booking__text">
            Racontez-nous l’occasion — un anniversaire, une demande, une simple envie de large.
            Nous revenons vers vous sous 24&nbsp;heures avec une proposition sur mesure.
          </p>
          <div className="booking__direct">
            <span className="kicker" style={{ letterSpacing: '0.2em' }}>
              Directement
            </span>
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </div>
        </motion.div>

        <motion.form className="form" onSubmit={handleSubmit} {...form}>
          <div className="field">
            <label htmlFor="name">Nom</label>
            <input id="name" name="name" type="text" autoComplete="name" required />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" autoComplete="email" required />
          </div>
          <div className="field">
            <label htmlFor="experience">Expérience</label>
            <select id="experience" name="experience" defaultValue="Sortie en mer" required>
              <option>Sortie en mer</option>
              <option>Nuit insolite à quai</option>
              <option>Les deux — jour & nuit</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="date">Date souhaitée</label>
            <input id="date" name="date" type="date" required />
          </div>
          <div className="field field--full">
            <label htmlFor="message">Votre occasion, vos envies</label>
            <textarea id="message" name="message" placeholder="Un anniversaire à fêter, une surprise à organiser…" />
          </div>
          <div className="form__footer">
            <button type="submit" className="btn btn--brass">
              Envoyer la demande
            </button>
            <span className="form__hint" role="status">
              {sent ? 'Votre messagerie s’est ouverte — envoyez, on s’occupe du reste.' : 'Réponse sous 24 h'}
            </span>
          </div>
        </motion.form>
      </div>
    </section>
  )
}
