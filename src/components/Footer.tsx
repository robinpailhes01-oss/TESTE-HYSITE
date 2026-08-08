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
              <a href="#experiences">Expériences</a>
            </li>
            <li>
              <a href="#abord">À bord</a>
            </li>
            <li>
              <a href="#yacht">Le yacht</a>
            </li>
            <li>
              <a href="#tarifs">Tarifs</a>
            </li>
            <li>
              <a href="#reservation">Réserver</a>
            </li>
            <li>
              <a href="mailto:harmonieyacht@gmail.com">harmonieyacht@gmail.com</a>
            </li>
          </ul>
        </div>
        <div className="footer__legal">
          <span>© {new Date().getFullYear()} Harmonie Yacht — tous droits réservés</span>
          <span>Photographies Unsplash & Pexels</span>
        </div>
      </div>
    </footer>
  )
}
