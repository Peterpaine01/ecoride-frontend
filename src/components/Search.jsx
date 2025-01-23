import { Link } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";

// Handle Date
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import fr from "date-fns/locale/fr";

// Images
import LogoHD from "../assets/logo-EcoRide-secondary.svg";
import { Flag, Calendar, Users, Search, Plus, Minus } from "react-feather";

// Je récupère les props
const SearchBlock = () => {
  // Handle form values
  const [startLocation, setStartLocation] = useState();
  const [arrivalLocation, setArrivalLocation] = useState();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [passengers, setPassengers] = useState(1);

  // Handle dropdown status
  const [isPassengersOpen, setIsPassengersOpen] = useState(false);

  // REF
  const passengersRef = useRef(null); // Référence au menu déroulant

  const closeDropdown = () => {
    setIsPassengersOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        passengersRef.current &&
        !passengersRef.current.contains(event.target)
      ) {
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
    setIsPassengersOpen((prevState) => !prevState);
  };

  // Fonction pour fermer le menu si l'utilisateur clique ailleurs

  registerLocale("fr", fr);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Handle counter passenger
  const incrementCounter = () => {
    if (passengers >= 1 && passengers < 8) {
      setPassengers(passengers + 1);
    }
  };
  const decrementCounter = () => {
    if (passengers > 1 && passengers <= 8) {
      setPassengers(passengers - 1);
    }
  };

  return (
    <>
      <div className="search-block">
        <form>
          <div className="search-left">
            <div className="input-group">
              <label htmlFor="start-ride" className="label-hidden">
                Départ
              </label>
              <Flag />
              <input
                type="text"
                name="start-ride"
                id="start-ride"
                autoComplete="on"
                placeholder="Départ"
                value={startLocation}
              />
            </div>
            <div className="input-group">
              <label htmlFor="end-ride" className="label-hidden">
                Destination
              </label>
              <Flag />
              <input
                type="text"
                name="end-ride"
                id="end-ride"
                autoComplete="on"
                placeholder="Destination"
                value={arrivalLocation}
              />
            </div>
          </div>

          <div className="search-right">
            <div className="input-group date-picker">
              <label htmlFor="end-ride" className="label-hidden">
                Date du départ
              </label>

              <Calendar size={28} />
              <DatePicker
                className="drop-btn"
                locale="fr"
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                placeholderText="Aujourd'hui"
              />
            </div>

            <div className="dropdown-button" ref={passengersRef}>
              <button
                className="drop-btn"
                type="button"
                onClick={toggleDropdown}
              >
                <Users /> {passengers} passager{passengers > 1 && "s"}
              </button>
              {isPassengersOpen && (
                <div className="dropdown-menu counter-block flex-row align-center">
                  <p>Nombre de passagers</p>
                  <div className="counter">
                    <button type="button" onClick={decrementCounter}>
                      <Minus />
                    </button>
                    <p>{passengers}</p>

                    <button type="button" onClick={incrementCounter}>
                      <Plus />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <button type="submit" aria-disabled="false">
            <Search />
          </button>
        </form>
      </div>
    </>
  );
};

export default SearchBlock;
