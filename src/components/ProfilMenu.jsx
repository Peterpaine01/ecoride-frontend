import React, { useState } from "react";
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
  const [isOpen, setIsOpen] = useState(false);

  // For testing
  const [isToken, setIsToken] = useState(true);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="profil-menu-container">
      {isToken ? (
        <>
          <Link className="profil-icon user-logged visible" to={"/profil"}>
            <img src="../../images/user1-photo-profil.jpg" alt="" />
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
