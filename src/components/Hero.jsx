import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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
import ProfilMenu from "./ProfilMenu";

// Je récupère les props
const Hero = () => {
  const [isProfilOpen, setIsProfilOpen] = useState(false);

  // REF
  const profilRef = useRef(null);

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
      <div className="container-fluid hero">
        <div className="cover">
          <img
            className="desktop"
            src="https://res.cloudinary.com/djxejhaxr/image/upload/cover_qysjoz.jpg"
            alt=""
          />
          <img
            className="mobile"
            src="https://res.cloudinary.com/djxejhaxr/image/upload/hero-MOBILE_yt2oco.jpg"
            alt=""
          />
        </div>

        <SearchBlock />
      </div>
    </>
  );
};

export default Hero;
