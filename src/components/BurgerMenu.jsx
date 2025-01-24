import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin } from "react-feather";

const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="burger-menu-container">
      {/* Bouton burger */}
      <div
        className={`burger-icon ${isOpen ? "open" : ""}`}
        onClick={toggleMenu}
      >
        <span className="line line-1"></span>
        <span className="line line-2"></span>
        <span className="line line-3"></span>
      </div>

      {/* Menu overlay */}
      <div
        className={`menu-overlay flex-column space-between ${
          isOpen ? "visible" : ""
        }`}
      >
        <nav className="flex-column align-center ">
          <ul>
            <li>
              <Link to="/">Rechercher un trajet</Link>
            </li>
            <li>
              <Link to="/">Comment ça marche ?</Link>
            </li>
            <li>
              <Link to="/">Qui sommes-nous ?</Link>
            </li>
            <li>
              <Link to="/">Contact</Link>
            </li>
          </ul>
        </nav>

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
        <div className="menu-footer">
          <Link to="/">Mentions légales</Link>
        </div>
      </div>
    </div>
  );
};

export default BurgerMenu;
