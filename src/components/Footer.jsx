import { Link } from "react-router-dom";

// Images
import LogoHD from "../assets/logo-EcoRide-secondary.svg";
import { Facebook, Instagram, Linkedin } from "react-feather";

// Je récupère les props
const Footer = () => {
  return (
    <>
      <footer className="desktop">
        <div className="container">
          <div className="block-menu">
            <div className="footer-logo">
              <img
                className="logo-img"
                loading="lazy"
                src={LogoHD}
                alt="logo Ecoride"
              />
            </div>
            <nav>
              <ul className="nav-list">
                <li className="nav-item">
                  <Link to="/">Comment ça marche ?</Link>
                </li>
                <li className="nav-item">
                  <Link to="/">Qui sommes-nous ?</Link>
                </li>
                <li className="nav-item">
                  <Link to="/">Mentions légales</Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="block-social">
            <div className="social-wrapper">
              <p>Nous suivre</p>
              <div className="social-icons flex-row align-center">
                <Link to="/">
                  <Instagram size={45} />
                </Link>
                <Link to="/">
                  <Facebook size={45} />
                </Link>
                <Link to="/">
                  <Linkedin size={45} />
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid">
          <p className="copyright">© Développement par Flocon dev</p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
