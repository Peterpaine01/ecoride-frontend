import { useNavigate, useLocation, useSearchParams } from "react-router-dom"
import React, { useEffect, useState, useRef } from "react"

// Handle Date
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { registerLocale } from "react-datepicker"
import fr from "date-fns/locale/fr"

// Components
import Counter from "../components/Counter"

// Images
import { Flag, Calendar, Users, Search, Plus, Minus } from "react-feather"

// Je récupère les props
const SearchBlock = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // console.log("searchParams", searchParams);

  const searchQuery = {
    departureCity: searchParams.get("departureCity"),
    destinationCity: searchParams.get("destinationCity"),
    departureDate: searchParams.get("departureDate"),
    remainingSeats: parseInt(searchParams.get("remainingSeats"), 10) || 1,
  }

  const [formData, setFormData] = useState({
    departureCity: searchQuery.departureCity || "",
    destinationCity: searchQuery.destinationCity || "",
    departureDate: searchQuery.departureDate
      ? new Date(searchQuery.departureDate)
      : new Date(),
    remainingSeats: searchQuery.remainingSeats || 1,
  })

  // HANDLE FORM DATA

  const formatDateToLocal = (date) => {
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}` // Exemple : "2025-04-22"
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const isSearchPage = location.pathname === "/recherche-trajet"

    const currentParams = new URLSearchParams(location.search)

    if (formData.departureCity?.trim()) {
      currentParams.set("departureCity", formData.departureCity)
    }
    if (formData.destinationCity?.trim()) {
      currentParams.set("destinationCity", formData.destinationCity)
    }

    const departureDate = new Date(formData.departureDate)
    if (!isNaN(departureDate)) {
      const formattedDate = formatDateToLocal(departureDate)
      currentParams.set("departureDate", formattedDate)
    }
    currentParams.set("remainingSeats", formData.remainingSeats)

    const encodedParams = new URLSearchParams()
    for (const [key, value] of currentParams.entries()) {
      encodedParams.set(key, value)
    }

    const newQuery = currentParams.toString()

    if (isSearchPage) {
      navigate(`${location.pathname}?${newQuery}`, { replace: true })
    } else {
      navigate(`/recherche-trajet?${newQuery}`)
    }
  }

  // HANDLE STATUS
  const [isPassengersOpen, setIsPassengersOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState("")

  // REF
  const passengersRef = useRef(null)

  // HANDLE DROPDOWN MENU

  const closeDropdown = () => {
    setIsPassengersOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        passengersRef.current &&
        !passengersRef.current.contains(event.target)
      ) {
        closeDropdown()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [formData.remainingSeats, isPassengersOpen, isModalOpen])

  // Fonction pour basculer le menu
  const toggleDropdown = () => {
    setIsPassengersOpen((prevState) => !prevState)
  }

  // HANDLE DATE
  registerLocale("fr", fr)

  const handleDateChange = (date) => {
    const dateObj = new Date(date)
    if (!isNaN(dateObj)) {
      setFormData({ ...formData, departureDate: dateObj })
    }
  }

  const today = new Date()

  const options = {
    weekday: "short", // Jour de la semaine abrégé
    day: "2-digit", // Jour du mois sur 2 chiffres
    month: "short", // Mois abrégé
    year: "numeric", // Année sur 4 chiffres
  }

  const displayDateMobile = new Intl.DateTimeFormat("fr-FR", options).format(
    today
  )

  const formatDepartureDate = (date) => {
    return date instanceof Date && !isNaN(date)
      ? new Intl.DateTimeFormat("fr-FR", options).format(date)
      : ""
  }

  // HANDLE MODALS

  const toggleModal = (e) => {
    if (window.innerWidth < 890) {
      const { name } = e.target
      setIsModalOpen(!isModalOpen)
      setModalContent(name)
    }
  }

  return (
    <>
      <div className="search-block">
        <form onSubmit={handleSubmit}>
          <div className="search-left">
            <div className="input-group">
              <label htmlFor="departureCity" className="label-hidden">
                Départ
              </label>
              <Flag size={30} />
              <input
                type="text"
                name="departureCity"
                id="departureCity"
                autoComplete="off"
                placeholder="Départ"
                value={formData.departureCity}
                onChange={handleChange}
                onFocus={toggleModal}
              />
            </div>
            <div className="input-group">
              <label htmlFor="destinationCity" className="label-hidden">
                Destination
              </label>
              <Flag size={30} />
              <input
                type="text"
                name="destinationCity"
                id="destinationCity"
                autoComplete="off"
                placeholder="Destination"
                value={formData.destinationCity}
                onChange={handleChange}
                onFocus={toggleModal}
              />
            </div>
            <div className="input-group date-picker mobile">
              <label htmlFor="end-ride" className="label-hidden">
                Date du départ
              </label>
              <span className="material-symbols-outlined">calendar_month</span>

              <input
                type="text"
                name="departureDate"
                id="departureDate"
                autoComplete="off"
                placeholder={displayDateMobile}
                onChange={handleDateChange}
                value={
                  formData.departureDate
                    ? formatDepartureDate(formData.departureDate)
                    : ""
                }
                onFocus={toggleModal}
              />
            </div>
          </div>

          <div className="search-right">
            <div className="input-group date-picker desktop">
              <label htmlFor="end-ride" className="label-hidden">
                Date du départ
              </label>
              <span className="material-symbols-outlined">calendar_month</span>

              <input
                type="text"
                name="departureDate"
                id="departureDate"
                autoComplete="off"
                placeholder={new Date()}
                onChange={handleDateChange}
                value={formData.departureDate || new Date()}
                onFocus={toggleModal}
                className="mobile"
              />

              <DatePicker
                className="drop-btn desktop"
                locale="fr"
                selected={formData.departureDate}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                placeholderText="Aujourd'hui"
                minDate={new Date()} // Desable dates before today
                name="departureDate"
              />
            </div>

            <div className="dropdown-button" ref={passengersRef}>
              <button
                className="drop-btn"
                type="button"
                name="remainingSeats"
                onClick={(e) => {
                  if (window.innerWidth < 890) {
                    toggleModal(e)
                  } else {
                    toggleDropdown(e)
                  }
                }}
              >
                <Users /> {formData.remainingSeats} passager
                {formData.remainingSeats > 1 && "s"}
              </button>
              {isPassengersOpen && (
                <div className="dropdown-menu counter-block flex-row align-center desktop">
                  <p>Nombre de passagers</p>

                  <Counter
                    name={"remainingSeats"}
                    value={formData.remainingSeats || 1}
                    onChange={handleChange}
                    minValue={1}
                    maxValue={8}
                  />
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
        {(modalContent === "departureCity" ||
          modalContent === "destinationCity") && (
          <>
            <div className="icon-container">
              <Flag size={34} />
            </div>
            {modalContent === "departureCity" ? (
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
                  autoComplete="off"
                  placeholder={
                    modalContent === "departureCity" ? "Départ" : "Destination"
                  }
                  value={formData[modalContent]}
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
        {modalContent === "departureDate" && (
          <>
            <div className="icon-container">
              <span className="material-symbols-outlined">calendar_month</span>
            </div>
            <h3>À quelle date partez-vous ?</h3>

            <form
              onSubmit={handleSubmit}
              className={`flex-row justify-center ${modalContent}`}
            >
              <div className="input-group date-picker">
                <label htmlFor="end-ride" className="label-hidden">
                  Date du départ
                </label>

                <DatePicker
                  className="drop-btn"
                  locale="fr"
                  selected={formData.departureDate}
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
        {modalContent === "remainingSeats" && (
          <>
            <div className="icon-container">
              <Users size={34} />
            </div>

            <h3>Nombre de passagers ?</h3>
            <div className=" counter-block flex-row align-center">
              <Counter
                name={"remainingSeats"}
                value={formData.remainingSeats || 1}
                onChange={handleChange}
                minValue={1}
                maxValue={8}
              />
            </div>
            <button type="button" className="btn-solid" onClick={toggleModal}>
              Valider
            </button>
          </>
        )}
      </div>
    </>
  )
}

export default SearchBlock
