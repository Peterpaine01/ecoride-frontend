import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  User,
  ChevronRight,
  XCircle,
  Compass,
  UserPlus,
  PlusCircle,
} from "react-feather";

// Images
import LogoHD from "../assets/logo-EcoRide-white-vert.png";

// Component
import SearchBlock from "./Search";
import BurgerMenu from "./BurgerMenu";

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
        <div className="top-menu desktop">
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
                <ul className="nav-list">
                  <li className="nav-item">
                    <Link to={`/`}>Rechercher un trajet</Link>
                  </li>
                  <li className="nav-item">
                    <Link to={`/`}>Contact</Link>
                  </li>
                </ul>
              </nav>
            </div>
            <nav className="flex-row">
              <ul className="nav-list">
                <li className="nav-item">
                  <Link className="add-btn" to={`/publier-trajet`}>
                    <PlusCircle size={31} /> Publier un trajet
                  </Link>
                </li>
                <li className="nav-item" ref={profilRef}>
                  <Link
                    className="dropdown-btn"
                    to={`/`}
                    onClick={toggleDropdown}
                  >
                    <User size={24} color="red" />
                  </Link>
                  {isProfilOpen && (
                    <>
                      <div className="dropdown-menu">
                        <div className="top-dropdown">
                          <p className="text-small">
                            <span className="text-emphase">Fanny</span>, il te
                            reste
                          </p>
                          <hr />
                          <p className="text-big">200</p>
                          <p className="text-tiny">crédits</p>
                        </div>
                        <Link className="dropdown-item flex-row align-center space-between">
                          <span className="flex-row align-center">
                            <User /> Se connecter
                          </span>
                          <ChevronRight size={16} color="red" />
                        </Link>
                        <Link className="dropdown-item flex-row align-center space-between">
                          <span className="flex-row align-center">
                            <UserPlus /> Créer un compte
                          </span>

                          <ChevronRight size={16} color="red" />
                        </Link>

                        <Link className="dropdown-item flex-row align-center space-between">
                          <span className="flex-row align-center">
                            <User /> Profil
                          </span>
                          <ChevronRight size={16} color="red" />
                        </Link>
                        <Link className="dropdown-item flex-row align-center space-between">
                          <span className="flex-row align-center">
                            <Compass /> Vos trajets
                          </span>

                          <ChevronRight size={16} color="red" />
                        </Link>
                        <Link className="dropdown-item flex-row align-center space-between">
                          <span className="flex-row align-center">
                            <XCircle /> Se déconnecter
                          </span>

                          <ChevronRight size={16} color="red" />
                        </Link>
                      </div>
                    </>
                  )}
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <div className="top-menu mobile">
          <div className="container flex-row align-center">
            <BurgerMenu />
            <Link className="logo" to="/">
              <img
                className="logo-img"
                loading="lazy"
                src={LogoHD}
                alt="logo Ecoride"
              />
            </Link>
            <div className="nav-item" ref={profilRef}>
              <Link className="dropdown-btn" to={`/`} onClick={toggleDropdown}>
                <User size={24} />
              </Link>
              {isProfilOpen && (
                <>
                  <Link className="dropdown-item flex-row align-center space-between">
                    <span className="flex-row align-center">
                      <User /> Se connecter
                    </span>
                    <ChevronRight size={16} />
                  </Link>
                  <Link className="dropdown-item flex-row align-center space-between">
                    <span className="flex-row align-center">
                      <UserPlus /> Créer un compte
                    </span>

                    <ChevronRight size={16} />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="cover">
          <img src="src/assets/iStock-481629528-extend2.png" alt="" />
        </div>

        <SearchBlock />
      </header>
    </>
  );
};

export default Header;
