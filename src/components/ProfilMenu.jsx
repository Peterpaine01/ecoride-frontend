import React, { useState, useRef, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import {
  User,
  ChevronRight,
  XCircle,
  Compass,
  UserPlus,
  PlusCircle,
  ChevronLeft,
} from "react-feather";

const ProfilMenu = () => {
  const { user, login, logout, isAuthenticated } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  // For testing
  const [isToken, setIsToken] = useState(true);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="profil-menu-container">
      {user ? (
        <>
          <Link className="profil-icon user-logged visible" to={"/profil"}>
            {user.photo && (
              <img src={user.photo} alt="photo profil par défaut" />
            )}
          </Link>
        </>
      ) : (
        <>
          <div
            className={`profil-icon ${isOpen ? "open" : ""} visible`}
            onClick={toggleMenu}
          >
            <User size={24} />
          </div>
          {/* Menu overlay */}
          <div
            className={`menu-overlay flex-column space-between ${
              isOpen ? "visible" : ""
            }`}
          >
            <button className="back-btn" onClick={toggleMenu}>
              <ChevronLeft size={28} />
            </button>

            <nav className="flex-column align-center ">
              <ul>
                <li>
                  <Link to="/se-connecter">Se connecter</Link>
                </li>
                <li>
                  <Link to="/creer-compte">Créer un compte</Link>
                </li>
              </ul>
            </nav>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilMenu;
