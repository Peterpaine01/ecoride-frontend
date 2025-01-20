import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

// Images
import LogoHD from "../assets/logo-EcoRide-white.svg";

// Je récupère les props
const Header = ({ token }) => {
  const [isProfilOpen, setIsProfilOpen] = useState(false);

  // REF
  const profilRef = useRef(null); // Référence au menu déroulant

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profilRef.current && !profilRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    // Ajouter l'event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Nettoyer l'event listener à la fin du cycle de vie
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fonction pour basculer le menu
  const toggleDropdown = () => {
    setIsProfilOpen((prevState) => !prevState);
  };

  // Fonction pour fermer le menu si l'utilisateur clique ailleurs
  const closeDropdown = () => {
    setIsProfilOpen(false);
  };

  return (
    <>
      <header>
        <div className="top-menu">
          <div className="container flex-row align-center">
            <div className="menu-left flex-row align-center">
              <Link className="logo" to="/">
                <img
                  className="logo-img"
                  loading="lazy"
                  src={LogoHD}
                  alt="logo Ecoride"
                />
              </Link>
              <nav className="flex-row">
                <Link className="btn-light" to={`/`}>
                  Accueil
                </Link>
                <Link className="btn-light" to={`/`}>
                  Contact
                </Link>
              </nav>
            </div>
            <nav className="flex-row">
              <ul className="nav-list">
                <li className="nav-item">
                  <Link className="btn-light" to={`/`}>
                    Ajouter un trajet
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="dropdown-btn"
                    to={`/`}
                    onClick={toggleDropdown}
                    ref={profilRef}
                  >
                    Profil
                  </Link>
                  {isProfilOpen && (
                    <>
                      <ul className="dropdown-menu" onClick={closeDropdown}>
                        <div className="top-dropdown">
                          <p>
                            <span>Fanny</span>, il te reste
                          </p>
                          <hr />
                          <p>200</p>
                          <p>crédits</p>
                        </div>
                        <li className="dropdown-item">Se connecter</li>
                        <li className="dropdown-item">Créer un compte</li>

                        <li className="dropdown-item">Profil</li>
                        <li className="dropdown-item">Vos trajets</li>
                        <li className="dropdown-item">Se déconnecter</li>
                      </ul>
                    </>
                  )}
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <img
          src="src/assets/iStock-481629528-extend2.png"
          alt=""
          className="cover"
        />
      </header>
      {/* burger menu */}
      {/* <div className="burger-menu">
        <input
          className="hamburger"
          type="checkbox"
          id="icon-menu-burger"
          tabIndex="0"
        />
        <label aria-label="Ouvrir menu" htmlFor="icon-menu-burger">
          <span></span>
        </label>
        <nav className="flex-parent menu-mobile">
          <Link className="btn-light" to={`/`}>
            Accueil
          </Link>
        </nav>
      </div> */}
    </>
  );
};

export default Header;
