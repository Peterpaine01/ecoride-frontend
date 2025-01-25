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

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="profil-menu-container">
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
              <Link to="/">Se connecter</Link>
            </li>
            <li>
              <Link to="/">Créer un compte</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default ProfilMenu;
