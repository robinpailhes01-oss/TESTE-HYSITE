import { Link } from 'react-router'
import { GOOGLE_REVIEWS_URL } from '../reviews'
import { WHATSAPP_URL } from '../whatsapp'
import { INSTAGRAM_URL } from '../seo'

export default function Footer() {
  return (
    <footer className="footer on-ocean">
      <div className="container">
        <div className="footer__inner">
          <a href="#" className="monogram" aria-label="Harmonie Yacht — retour en haut">
            Hy
          </a>
          <ul className="footer__nav">
            <li>
              <a href="#prestations">Prestations</a>
            </li>
            <li>
              <a href="#abord">À bord</a>
            </li>
            <li>
              <a href="#galerie">Galerie</a>
            </li>
            <li>
              <a href="#avis">Avis</a>
            </li>
            <li>
              <a href="#tarifs">Tarifs</a>
            </li>
            <li>
              <a href="#reservation">Réserver</a>
            </li>
            <li>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </li>
            <li>
              <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer">
                Avis Google
              </a>
            </li>
            <li>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </li>
            <li>
              <a href="mailto:harmonieyacht@gmail.com">harmonieyacht@gmail.com</a>
            </li>
          </ul>
        </div>
        <div className="footer__legal">
          <span>© {new Date().getFullYear()} Harmonie Group — tous droits réservés</span>
          <span>Port de Carnon, Hérault — à côté de l’Hôtel Neptune</span>
          <span>Photographies Unsplash & Pexels</span>
        </div>
        <div className="footer__legal">
          <Link to="/mentions-legales">Mentions légales</Link>
          <Link to="/cgv">Conditions générales de vente</Link>
          <Link to="/confidentialite">Confidentialité</Link>
        </div>
      </div>
    </footer>
  )
}
