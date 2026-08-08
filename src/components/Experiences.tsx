import { motion } from 'motion/react'
import { useReveal } from '../motion'

function preselect(experience: string) {
  window.dispatchEvent(new CustomEvent('preselect-experience', { detail: experience }))
}

export default function Experiences() {
  const head = useReveal()
  const one = useReveal()
  const two = useReveal()

  return (
    <section className="section" id="prestations" style={{ background: 'var(--white)' }}>
      <div className="container">
        <motion.div className="section-head" {...head}>
          <p className="kicker">Nos prestations</p>
          <h2 className="mixed">
            La <span className="it">sortie en mer</span>, ou la <span className="it">nuit à quai</span>&nbsp;?
          </h2>
        </motion.div>

        <motion.article className="exp" {...one}>
          <div className="exp__media">
            <img
              src="/images/sortie-bateau.jpg"
              alt="Le yacht Harmonie au mouillage sur une eau turquoise, plateforme de baignade dépliée"
              loading="lazy"
            />
          </div>
          <div className="exp__body">
            <span className="exp__tag">01 — Le jour</span>
            <h3 className="mixed exp__title">
              Sorties <span className="it">en mer</span>
            </h3>
            <p className="exp__desc">
              Le yacht est à vous, le programme aussi. Cap sur les criques, mouillage dans une eau
              claire, déjeuner à bord, baignade — et le retour au port dans la lumière du soir.
            </p>
            <ul className="exp__list">
              <li>
                <span>Demi-journée ou journée entière</span>
                <span>4 h — 8 h</span>
              </li>
              <li>
                <span>Mouillage & baignade dans une crique</span>
                <span>Au choix</span>
              </li>
              <li>
                <span>Apéritif au soleil couchant</span>
                <span>Inclus</span>
              </li>
            </ul>
            <a
              href="#reservation"
              className="link-arrow"
              onClick={() => preselect('Sortie en mer')}
            >
              Réserver une sortie
            </a>
          </div>
        </motion.article>

        <motion.article className="exp exp--reverse" {...two}>
          <div className="exp__media">
            <img
              src="/images/nuit-bateau.jpg"
              alt="Le yacht Harmonie au soir tombant, reflets dorés sur l’eau"
              loading="lazy"
            />
          </div>
          <div className="exp__body">
            <span className="exp__tag">02 — La nuit</span>
            <h3 className="mixed exp__title">
              Nuits insolites <span className="it">à quai</span>
            </h3>
            <p className="exp__desc">
              À la tombée du jour, le yacht devient votre suite. Amarré au calme, il vous offre ce
              qu’aucune chambre ne peut offrir&nbsp;: le clapot de l’eau, le port qui s’endort, et
              un réveil face à la mer, petit-déjeuner servi à bord.
            </p>
            <ul className="exp__list">
              <li>
                <span>Nuit à bord, yacht amarré au port</span>
                <span>18 h — 10 h</span>
              </li>
              <li>
                <span>Champagne de bienvenue</span>
                <span>Inclus</span>
              </li>
              <li>
                <span>Petit-déjeuner servi à bord</span>
                <span>Inclus</span>
              </li>
            </ul>
            <a
              href="#reservation"
              className="link-arrow"
              onClick={() => preselect('Nuit insolite à quai')}
            >
              Réserver une nuit
            </a>
          </div>
        </motion.article>
      </div>
    </section>
  )
}
