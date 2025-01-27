import { Link } from "react-router-dom";
import React, { useState } from "react";

// Images
import LogoHD from "../assets/logo-EcoRide-secondary.svg";
import {
  Search,
  PlusCircle,
  Compass,
  Instagram,
  Facebook,
  Linkedin,
} from "react-feather";

// Je récupère les props
const Footer = () => {
  // For testing
  const [isToken, setIsToken] = useState(true);

  return (
    <>
      <footer>
        {/* MOBILE */}
        <div className="container mobile">
          <Link
            to="/"
            className={`btn-footer flex-column align-center ${
              isToken && "user-logged"
            }`}
            type="button"
          >
            <Search size={22} />
            <span>Rechercher</span>
          </Link>
          <Link
            to="/publier-trajet"
            className={`btn-footer flex-column align-center ${
              isToken && "user-logged"
            }`}
            type="button"
          >
            <PlusCircle size={22} />
            <span>Publier un trajet</span>
          </Link>
          {isToken && (
            <Link
              to="/vos-trajets"
              className="btn-footer flex-column align-center user-logged"
            >
              <Compass size={22} />
              <span>Vos Trajets</span>
            </Link>
          )}
        </div>
        {/* DESKTOP */}
        <div className="container desktop">
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
                  <Link to="/comment-fonctionne-ecoride">
                    Comment ça marche ?
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/qui-sommes-nous">Qui sommes-nous ?</Link>
                </li>
                <li className="nav-item">
                  <Link to="/mentions-legales">Mentions légales</Link>
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
        <div className="container-fluid desktop">
          <p className="copyright">© Développement par Flocon dev</p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
