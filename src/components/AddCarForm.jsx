import { Link } from "react-router-dom"
import React, { useEffect, useState } from "react"
import axios from "../config/axiosConfig"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft"
import { ChevronLeft } from "react-feather"

// Handle Date
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { registerLocale } from "react-datepicker"
import fr from "date-fns/locale/fr"

const AddCarForm = ({
  fetchVehicles,
  isVehiclesModalOpen,
  setIsVehiclesModalOpen,
  isModal,
}) => {
  const [formData, setFormData] = useState({
    registration_number: "",
    first_registration_date: "",
    model: "",
    color: "",
    energy_id: 0,
    brand_id: 0,
    available_seats: 0,
  })

  const [success, setSuccess] = useState(false)
  const [brandsList, setBrandsList] = useState([])
  const [energiesList, setEnergiesList] = useState([])

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get("/brands")
        setBrandsList(response.data)
      } catch (error) {
        toast.error("Erreur lors du chargement des marques")
      }
    }

    const fetchEnergies = async () => {
      try {
        const response = await axios.get("/energies")
        setEnergiesList(response.data)
      } catch (error) {
        toast.error("Erreur lors du chargement des carburants")
      }
    }

    fetchBrands()
    fetchEnergies()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formattedDate = formData.first_registration_date
      ? formData.first_registration_date.toISOString().split("T")[0]
      : ""

    // console.log("formattedDate", formattedDate)

    const payload = {
      ...formData,
      first_registration_date: formattedDate,
    }

    try {
      const response = await axios.post("/create-car", payload)
      if (isVehiclesModalOpen) {
        fetchVehicles()
      }

      toast.success("Véhicule créé avec succès ✅")
      setSuccess(true)
      setFormData({
        registration_number: "",
        first_registration_date: "",
        model: "",
        color: "",
        energy_id: 0,
        brand_id: 0,
        available_seats: 0,
      })
      if (isVehiclesModalOpen) {
        setIsVehiclesModalOpen(false)
      }
    } catch (error) {
      setSuccess(false)
      toast.error(
        error.response?.data?.error || "Erreur lors de l'ajout du véhicule'"
      )
    }
  }

  const handleDateChange = (date) => {
    const dateObj = new Date(date)
    // console.log("dateObj", dateObj)

    if (!isNaN(dateObj)) {
      setFormData({ ...formData, first_registration_date: dateObj })
    }
  }

  return (
    <div
      className={`${isVehiclesModalOpen ? "modal-overlay" : ""}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className={`${
          isVehiclesModalOpen && "flex-column modal-content relative"
        }`}
      >
        {isVehiclesModalOpen && (
          <>
            <div className="flex-row align-center">
              <button
                className="back-btn flex-row align-end"
                onClick={() => setIsVehiclesModalOpen(false)}
                aria-label="Fermer"
              >
                <ChevronLeft size={28} />
              </button>
            </div>
            <h2
              className={`${isVehiclesModalOpen ? "visible" : "hidden"} mb-40`}
            >
              Ajouter un véhicule
            </h2>
          </>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex-column justify-left align-center gap-20 "
        >
          <div className="dotted flex-column gap-20">
            <label htmlFor="registration_number">
              Numéro d'immatriculation
            </label>
            <input
              className="w-100"
              type="text"
              name="registration_number"
              id="registration_number"
              placeholder="XX-120-XX"
              value={formData.registration_number}
              onChange={handleChange}
              required
            />
            <label htmlFor="first_registration_date">
              Date de la 1re immatriculation
            </label>

            <DatePicker
              className="drop-btn w-100"
              locale="fr"
              selected={formData.first_registration_date}
              onChange={handleDateChange}
              dateFormat="dd/MM/yyyy"
              placeholderText="jj/mm/aaaa"
              name="first_registration_date"
              autoComplete="off"
            />
          </div>
          <div className="dotted flex-column gap-20">
            <label htmlFor="brand_id">Marque</label>
            <select
              className="custom-select-minimal"
              name="brand_id"
              id="brand_id"
              value={formData.brand_id}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionnez une marque</option>
              {brandsList.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.label}
                </option>
              ))}
            </select>
            <label htmlFor="model">Model</label>
            <input
              className="w-100"
              type="text"
              name="model"
              id="model"
              placeholder="Qashqai"
              value={formData.model}
              onChange={handleChange}
              required
            />
            <label htmlFor="color">Couleur</label>
            <input
              className="w-100"
              type="text"
              name="color"
              id="color"
              placeholder="vert"
              value={formData.color}
              onChange={handleChange}
              required
            />
          </div>
          <div className="dotted flex-column gap-20">
            <label htmlFor="energy_id">Carburant</label>
            <select
              className="custom-select-minimal"
              name="energy_id"
              id="energy_id"
              value={formData.energy_id}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionnez un carburant</option>
              {energiesList.map((energy) => (
                <option key={energy.id} value={energy.id}>
                  {energy.label}
                </option>
              ))}
            </select>

            <label htmlFor="available_seats">Nombre de place</label>
            <input
              className="w-100"
              type="number"
              name="available_seats"
              id="available_seats"
              placeholder="1"
              value={formData.available_seats}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-solid mt-20"
            disabled={
              (!formData.registration_number ||
                !formData.first_registration_date ||
                !formData.model ||
                !formData.color ||
                !formData.energy_id ||
                !formData.brand_id ||
                !formData.available_seats) === false
                ? false
                : true
            }
          >
            Créer le véhicule
          </button>
        </form>

        {success && !isVehiclesModalOpen && (
          <section className="flex-row justify-center">
            <Link
              to="/profil"
              className="btn-link success flex-row align-center"
            >
              <KeyboardArrowLeftIcon />

              <span>Retour au profil</span>
            </Link>
          </section>
        )}

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  )
}

export default AddCarForm
