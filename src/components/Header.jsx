import React, { useState, useRef, useEffect, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import Cookies from "js-cookie"

import { Link } from "react-router-dom"
import {
  User,
  ChevronRight,
  XCircle,
  Compass,
  UserPlus,
  PlusCircle,
} from "react-feather"

// Images
import LogoHD from "../assets/logo-EcoRide-white-vert.png"

// Component
import SearchBlock from "./Search"
import BurgerMenu from "./BurgerMenu"
import ProfilMenu from "./ProfilMenu"

// Je récupère les props
const Header = () => {
  const { user, login, logout, isAuthenticated } = useContext(AuthContext)
  const [isProfilOpen, setIsProfilOpen] = useState(false)

  // REF
  const profilRef = useRef(null)

  console.log("user >", user)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profilRef.current && !profilRef.current.contains(event.target)) {
        closeDropdown()
      }
    }

    // Ajouter l'event listener
    document.addEventListener("mousedown", handleClickOutside)

    // Nettoyer l'event listener à la fin du cycle de vie
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Fonction pour basculer le menu
  const toggleDropdown = () => {
    setIsProfilOpen((prevState) => !prevState)
  }

  // Fonction pour fermer le menu si l'utilisateur clique ailleurs
  const closeDropdown = () => {
    setIsProfilOpen(false)
  }

  if (user && user.accountStatus === "pending") {
    // alert("Pensez à aciver votre compte. Rendez-vous sur votre boite mail.");
    console.log(
      "Compte inactif. Pensez à aciver votre compte. Rendez-vous sur votre boite mail."
    )
  }
  // console.log("cookie token", Cookies.get("token"));
  // console.log("user", user);

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
                    <Link to={`/recherche-trajet`}>Rechercher un trajet</Link>
                  </li>
                  <li className="nav-item">
                    <Link to={`/contact`}>Contact</Link>
                  </li>
                </ul>
              </nav>
            </div>
            <nav className="flex-row">
              <ul className="nav-list">
                {user &&
                  user.account_type === "webmaster" &&
                  user.role === "administrator" && (
                    <li className="nav-item">
                      <Link to={`/espace-admin`}>Espace admin</Link>
                    </li>
                  )}
                {user &&
                  user.account_type === "webmaster" &&
                  user.role === "moderator" && (
                    <li className="nav-item">
                      <Link to={`/espace-webmaster`}>Espace webmaster</Link>
                    </li>
                  )}
                {user && user.accountStatus === "active" && user.is_driver && (
                  <li className="nav-item">
                    <Link className="add-btn" to={`/publier-trajet`}>
                      <PlusCircle size={31} /> Publier un trajet
                    </Link>
                  </li>
                )}

                <li className="nav-item" ref={profilRef}>
                  <button
                    className={`dropdown-btn ${
                      user && user.accountStatus === "active"
                        ? "user-logged"
                        : ""
                    }`}
                    onClick={toggleDropdown}
                  >
                    {user && user.photo ? (
                      <img src={user.photo} alt="photo profil" />
                    ) : (
                      <User />
                    )}
                  </button>

                  {isProfilOpen && (
                    <>
                      <div className="dropdown-menu">
                        {user ? (
                          <>
                            {user.accountStatus === "active" && (
                              <>
                                <div className="top-dropdown">
                                  <p className="text-small">
                                    <span className="text-emphase">
                                      {user.username}
                                    </span>
                                    , il te reste
                                  </p>
                                  <hr />
                                  <p className="text-big">{user.credits}</p>
                                  <p className="text-tiny">crédits</p>
                                </div>

                                <Link
                                  className="dropdown-item flex-row align-center space-between"
                                  to={"/profil"}
                                >
                                  <span className="flex-row align-center">
                                    <User /> Profil
                                  </span>
                                  <ChevronRight size={16} color="red" />
                                </Link>
                                <Link
                                  className="dropdown-item flex-row align-center space-between"
                                  to={"/vos-trajets"}
                                >
                                  <span className="flex-row align-center">
                                    <Compass /> Vos trajets
                                  </span>

                                  <ChevronRight size={16} color="red" />
                                </Link>
                              </>
                            )}

                            <Link
                              className="dropdown-item flex-row align-center space-between"
                              onClick={logout}
                              to={"/se-connecter"}
                            >
                              <span className="flex-row align-center">
                                <XCircle /> Se déconnecter
                              </span>

                              <ChevronRight size={16} color="red" />
                            </Link>
                          </>
                        ) : (
                          <>
                            <Link
                              className="dropdown-item flex-row align-center space-between"
                              to={"/se-connecter"}
                            >
                              <span className="flex-row align-center">
                                <User /> Se connecter
                              </span>
                              <ChevronRight size={16} color="red" />
                            </Link>
                            <Link
                              className="dropdown-item flex-row align-center space-between"
                              to={"/creer-compte"}
                            >
                              <span className="flex-row align-center">
                                <UserPlus /> Créer un compte
                              </span>

                              <ChevronRight size={16} color="red" />
                            </Link>
                          </>
                        )}
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
            <ProfilMenu />
          </div>
        </div>
      </header>
    </>
  )
}

export default Header
