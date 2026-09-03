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
            <img className="monogram__day" src="/images/logo-s.png" alt="Harmonie Yacht" />
            <img className="monogram__night" src="/images/logo-bone-s.png" alt="" aria-hidden="true" />
          </a>
          <ul className="footer__nav">
            <li>
              <Link to="/sortie-en-mer-carnon">Sorties en mer</Link>
            </li>
            <li>
              <Link to="/nuit-a-bord-yacht-carnon">Nuits à bord</Link>
            </li>
            <li>
              <Link to="/galerie">Galerie</Link>
            </li>
            <li>
              <a href="/#avis">Avis</a>
            </li>
            <li>
              <Link to="/tarifs">Tarifs</Link>
            </li>
            <li>
              {/* On ne réserve pas depuis l'accueil : il faut d'abord choisir
                  entre la sortie et la nuit. */}
              <a href="/#tarifs">Réserver</a>
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
          <span>© {new Date().getFullYear()} Harmonie Group · tous droits réservés</span>
          <span>Port de Carnon, Hérault · à côté de l’Hôtel Neptune</span>
        </div>
        <div className="footer__legal">
          <span>Nos partenaires : Hôtel Neptune · Champagne Maison Perla · Una Mas</span>
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
