import { useNavigate } from "react-router-dom";
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
  const [formData, setFormData] = useState({
    startLocation: "",
    arrivalLocation: "",
    selectedDate: new Date(),
    passengers: 1,
  });

  const navigate = useNavigate();

  // HANDLE FORM DATA

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    //console.log("Form data:", formData);

    // Après soumission, naviguer vers une autre page
    navigate("/", { searchQuery: formData });
  };

  // HANDLE STATUS
  const [isPassengersOpen, setIsPassengersOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  // REF
  const passengersRef = useRef(null); // Référence au menu déroulant
  const minusButtonRef = useRef(null);
  const minusButtonModalRef = useRef(null);
  const plusButtonRef = useRef(null);
  const plusButtonModalRef = useRef(null);

  // HANDLE DROPDOWN MENU

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

    // Accéder aux boutons via le DOM
    const minusButton = minusButtonRef.current;
    const plusButton = plusButtonRef.current;
    const minusButtonModal = minusButtonModalRef.current;
    const plusButtonModal = plusButtonModalRef.current;

    // dropdown counter desktop
    if (minusButton) {
      if (formData.passengers === 1) {
        minusButton.disabled = true;
      } else {
        minusButton.disabled = false;
      }
    }
    if (plusButton) {
      if (formData.passengers === 8) {
        plusButton.disabled = true;
      } else {
        plusButton.disabled = false;
      }
    }
    // modal counter mobile
    if (minusButtonModal) {
      if (formData.passengers === 1) {
        minusButtonModal.disabled = true;
      } else {
        minusButtonModal.disabled = false;
      }
    }

    if (plusButtonModal) {
      if (formData.passengers === 8) {
        plusButtonModal.disabled = true;
      } else {
        plusButtonModal.disabled = false;
      }
    }

    // Ajouter l'event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Nettoyer l'event listener à la fin du cycle de vie
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [formData.passengers, isPassengersOpen, isModalOpen]);

  // Fonction pour basculer le menu
  const toggleDropdown = () => {
    setIsPassengersOpen((prevState) => !prevState);
  };

  // HANDLE DATE CHANGE
  registerLocale("fr", fr);

  const handleDateChange = (date) => {
    setFormData({ ...formData, selectedDate: date });
  };

  // HANDLE COUNTER PASSENGERS
  const incrementCounter = () => {
    if (formData.passengers >= 1 && formData.passengers < 8) {
      setFormData({ ...formData, passengers: formData.passengers + 1 });
    }
  };
  const decrementCounter = () => {
    if (formData.passengers > 1 && formData.passengers <= 8) {
      setFormData({ ...formData, passengers: formData.passengers - 1 });
    }
  };

  // HANDLE MODALS

  // Ouvrir la modale
  const toggleModal = (e) => {
    if (window.innerWidth < 890) {
      const { name } = e.target;
      setIsModalOpen(!isModalOpen);
      setModalContent(name);
      console.log(name);
    }
  };

  //console.log("formData", formData);

  return (
    <>
      <div className="search-block">
        <form onSubmit={handleSubmit}>
          <div className="search-left">
            <div className="input-group">
              <label htmlFor="startLocation" className="label-hidden">
                Départ
              </label>
              <Flag size={30} />
              <input
                type="text"
                name="startLocation"
                id="startLocation"
                autoComplete="on"
                placeholder="Départ"
                value={formData.startLocation}
                onChange={handleChange}
                onFocus={toggleModal}
              />
            </div>
            <div className="input-group">
              <label htmlFor="arrivalLocation" className="label-hidden">
                Destination
              </label>
              <Flag size={30} />
              <input
                type="text"
                name="arrivalLocation"
                id="arrivalLocation"
                autoComplete="on"
                placeholder="Destination"
                value={formData.arrivalLocation}
                onChange={handleChange}
                onFocus={toggleModal}
              />
            </div>
          </div>

          <div className="search-right">
            <div className="input-group date-picker">
              <label htmlFor="end-ride" className="label-hidden">
                Date du départ
              </label>
              <span className="material-symbols-outlined">calendar_month</span>

              <DatePicker
                className="drop-btn"
                locale="fr"
                selected={formData.selectedDate}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                placeholderText="Aujourd'hui"
                minDate={new Date()} // Desable dates before today
                name="selectedDate"
                onFocus={toggleModal}
              />
            </div>

            <div className="dropdown-button" ref={passengersRef}>
              <button
                className="drop-btn"
                type="button"
                name="passengers"
                onClick={(e) => {
                  if (window.innerWidth < 890) {
                    toggleModal(e);
                  } else {
                    toggleDropdown(e);
                  }
                }}
              >
                <Users /> {formData.passengers} passager
                {formData.passengers > 1 && "s"}
              </button>
              {isPassengersOpen && (
                <div className="dropdown-menu counter-block flex-row align-center desktop">
                  <p>Nombre de passagers</p>
                  <div className="counter">
                    <button
                      type="button"
                      onClick={decrementCounter}
                      ref={minusButtonRef}
                    >
                      <Minus />
                    </button>
                    <p>{formData.passengers}</p>

                    <button
                      type="button"
                      onClick={incrementCounter}
                      ref={plusButtonRef}
                    >
                      <Plus />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <button type="submit" aria-disabled="false">
            <Search /> <span>Rechercher un trajet</span>
          </button>
        </form>
      </div>
      {/* MODAL block search > mobile */}
      <div
        className={`modal-container ${isModalOpen ? "open" : ""} flex-column`}
      >
        <div className={"close-icon"} onClick={toggleModal}>
          <span className="line line-1"></span>
          <span className="line line-2"></span>
          <span className="line line-3"></span>
        </div>
        {/* Modal start or arrival location */}
        {(modalContent === "startLocation" ||
          modalContent === "arrivalLocation") && (
          <>
            <div className="icon-container">
              <Flag size={34} />
            </div>
            {modalContent === "startLocation" ? (
              <h3>D'où partez-vous ?</h3>
            ) : (
              <h3>Où voulez-vous aller ?</h3>
            )}

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor={modalContent} className="label-hidden">
                  Départ
                </label>

                <input
                  type="text"
                  name={modalContent}
                  id={modalContent}
                  autoComplete="on"
                  placeholder={
                    modalContent === "startLocation" ? "Départ" : "Destination"
                  }
                  value={formData.modalContent}
                  onChange={handleChange}
                />
              </div>
            </form>
            <button type="button" className="btn-solid" onClick={toggleModal}>
              Valider
            </button>
          </>
        )}
        {/* Modal select date departure */}
        {modalContent === "selectedDate" && (
          <>
            <div className="icon-container">
              <span className="material-symbols-outlined">calendar_month</span>
            </div>
            <h3>À quelle date partez-vous ?</h3>

            <form onSubmit={handleSubmit}>
              <div className="input-group date-picker">
                <label htmlFor="end-ride" className="label-hidden">
                  Date du départ
                </label>

                <DatePicker
                  className="drop-btn"
                  locale="fr"
                  selected={formData.selectedDate}
                  onChange={handleDateChange}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Aujourd'hui"
                  minDate={new Date()} // Desable dates before today
                  inline
                />
              </div>
            </form>
            <button type="button" className="btn-solid" onClick={toggleModal}>
              Valider
            </button>
          </>
        )}
        {/* Modal counter passengers */}
        {modalContent === "passengers" && (
          <>
            <div className="icon-container">
              <Users size={34} />
            </div>

            <h3>Nombre de passagers ?</h3>
            <div className=" counter-block flex-row align-center">
              <div className="counter">
                <button
                  type="button"
                  onClick={decrementCounter}
                  ref={minusButtonRef}
                >
                  <Minus />
                </button>
                <p>{formData.passengers}</p>

                <button
                  type="button"
                  onClick={incrementCounter}
                  ref={plusButtonRef}
                >
                  <Plus />
                </button>
              </div>
            </div>
            <button type="button" className="btn-solid" onClick={toggleModal}>
              Valider
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default SearchBlock;
