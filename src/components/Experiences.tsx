import { motion } from 'motion/react'
import { useTideReveal } from '../motion'

export default function Experiences() {
  const head = useTideReveal()
  const one = useTideReveal()
  const two = useTideReveal()

  return (
    <section className="section" id="experiences">
      <div className="container">
        <motion.div className="section-head" {...head}>
          <p className="kicker">Les expériences</p>
          <h2 className="display" style={{ fontSize: 'clamp(34px, 4vw, 56px)' }}>
            Deux manières d’habiter <em>la mer</em>
          </h2>
        </motion.div>

        <motion.article className="exp" {...one}>
          <div className="exp__media">
            <img src="/images/mer.jpg" alt="Yacht blanc au mouillage sur une eau turquoise, le long d’une côte boisée" loading="lazy" />
          </div>
          <div className="exp__body">
            <span className="exp__numeral">I</span>
            <h3 className="display exp__title">Sorties en mer</h3>
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
            <a href="#reservation" className="link-arrow">
              Composer votre sortie
            </a>
          </div>
        </motion.article>

        <motion.article className="exp exp--reverse" {...two}>
          <div className="exp__media">
            <img src="/images/vague.jpg" alt="Mer sombre au soleil couchant, lumière chaude sur l’eau" loading="lazy" />
          </div>
          <div className="exp__body">
            <span className="exp__numeral">II</span>
            <h3 className="display exp__title">Nuits insolites à quai</h3>
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
            <a href="#reservation" className="link-arrow">
              Réserver votre nuit
            </a>
          </div>
        </motion.article>
      </div>
    </section>
  )
}
