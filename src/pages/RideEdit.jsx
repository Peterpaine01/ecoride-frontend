import { useNavigate, useParams, useLocation } from "react-router-dom"
import { useEffect, useState, useContext } from "react"
import axios from "../config/axiosConfig"
import { AuthContext } from "../context/AuthContext"

import { registerLocale } from "react-datepicker"
import fr from "date-fns/locale/fr"

import { usePreviousLocation } from "../context/PreviousLocationContext"
import {
  getCoordinates,
  reverseGeocode,
  calculateRoute,
} from "../utils/geolocation"
import { displayDuration } from "../utils/dateTimeHandler"

// Components
import Header from "../components/Header"
import Cover from "../components/Cover"
import Footer from "../components/Footer"
import AddressForm from "../components/AddressForm"

import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { MapContainer, TileLayer, Polyline } from "react-leaflet"
import "leaflet/dist/leaflet.css"

import MapMarker from "../components/MapMarker"

const RideEdit = () => {
  const { id } = useParams()

  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState(null)
  const [geolocErrors, setGeolocErrors] = useState(null)
  const [map, setMap] = useState(null)
  const [routeCoords, setRouteCoords] = useState([])
  const [geolocFailed, setGeolocFailed] = useState(false)
  const [vehicles, setVehicles] = useState([])
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")

  const navigate = useNavigate()

  const { user } = useContext(AuthContext)

  const [formData, setFormData] = useState({
    departureAddress: { street: "", city: "", zip: "", coords: null },
    destinationAddress: { street: "", city: "", zip: "", coords: null },
    departureDate: "",
    duration: 0,
    availableSeats: 1,
    creditsPerPassenger: 0,
    description: "",
    car: {
      carId: 0,
    },
  })

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const response = await axios.get(`/ride/${id}`)
        const ride = response.data

        setFormData({
          departureAddress: {
            street: ride.departureAddress.street,
            city: ride.departureAddress.city,
            zip: ride.departureAddress.zip,
            coords: ride.departureAddress.coords,
          },
          destinationAddress: {
            street: ride.destinationAddress.street,
            city: ride.destinationAddress.city,
            zip: ride.destinationAddress.zip,
            coords: ride.destinationAddress.coords,
          },
          departureDate: ride.departureDate,
          duration: ride.duration,
          availableSeats: ride.availableSeats,
          creditsPerPassenger: ride.creditsPerPassenger,
          description: ride.description,
          car: {
            carId: ride.car.id,
          },
        })

        if (ride?.departureDate) {
          const localDate = new Date(ride.departureDate)
          setSelectedDate(localDate.toISOString().slice(0, 10))
          setSelectedTime(localDate.toTimeString().slice(0, 5))
        }

        setLoading(false)
      } catch (err) {
        console.error(err)
        setErrors("Impossible de charger le trajet.")
        setLoading(false)
      }
    }

    fetchRide()
  }, [id])

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const result = await calculateRoute(
          formData.departureAddress.coords,
          formData.destinationAddress.coords
        )

        setRouteCoords(result.routeCoords)
      } catch (err) {
        console.error(err)
        console.log("Erreur lors du calcul de l’itinéraire")
      }
    }
    if (
      formData.departureAddress.coords &&
      formData.destinationAddress.coords
    ) {
      fetchRoute()
    }
  }, [formData.departureAddress, formData.destinationAddress])

  useEffect(() => {
    if (map && routeCoords.length > 0) {
      const bounds =
        routeCoords.length === 1
          ? map.getBounds().extend(routeCoords[0]) // fallback pour un seul point
          : routeCoords
      map.fitBounds(bounds, { padding: [20, 20] })
    }
  }, [map, routeCoords])

  useEffect(() => {
    if (!user || !user.account_id) {
      console.error("Utilisateur non authentifié ou account_id manquant.")
      return
    }

    const fetchVehicles = async () => {
      try {
        const response = await axios.get(`/user-cars/${user.account_id}`)
        // console.log("data cars : ", response.data[0])

        setVehicles(response.data)
      } catch (error) {
        console.error("Error fetching cars :", error)
      }
    }

    fetchVehicles()
  }, [user])

  // DATE
  registerLocale("fr", fr)
  const formatTimeToFrench = (isoDate) => {
    const date = new Date(isoDate)

    const options = { hour: "2-digit", minute: "2-digit" }
    return date.toLocaleTimeString("fr-FR", options)
  }

  const handleDateChange = (date) => {
    setFormData({ ...formData, departureDate: date })
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => {
      if (name === "departureTime") {
        const [hour, minute] = value.split(":")
        let currentDate = prev.departureDate

        if (!currentDate) {
          const today = new Date().toISOString().split("T")[0]
          currentDate = `${today}T00:00`
        }

        if (!(typeof currentDate === "string")) {
          currentDate = new Date(currentDate).toISOString()
        }

        const datePart = currentDate.split("T")[0]
        const updatedDate = `${datePart}T${hour}:${minute}`
        return {
          ...prev,
          departureDate: updatedDate,
        }
      }

      if (name === "carId") {
        return {
          ...prev,
          car: {
            ...(prev.car || {}),
            carId: Number(value),
          },
        }
      }

      return {
        ...prev,
        [name]: value,
      }
    })
  }

  console.log("formData", formData)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.patch(`/update-ride/${id}`, formData)
      console.log(res.data)
    } catch (err) {
      console.error(err)
      setErrors("Erreur lors de la mise à jour du trajet.")
    }
  }

  const handleCalculateDuration = async (
    departureCoords = formData.departureAddress.coords,
    destinationCoords = formData.destinationAddress.coords
  ) => {
    try {
      const result = await calculateRoute(departureCoords, destinationCoords)

      if (result.duration) {
        setFormData((prev) => ({
          ...prev,
          duration: result.duration,
        }))
        setDuration(displayDuration(result.duration))
      }

      setRouteCoords(result.routeCoords)
    } catch (err) {
      console.error("Erreur lors du calcul de la durée :", err)
      setErrors("Impossible de calculer la durée du trajet.")
    }
  }

  if (loading)
    return (
      <div className="flex-column justify-start align-center w-100 mt-40">
        <div class="loader"></div>
      </div>
    )

  return (
    <>
      <Header />
      <Cover />
      <main>
        <div className="container-full">
          <section className="flex-column justify-center align-center">
            <h1 className="mb-20">Modifier le trajet</h1>
            <form
              onSubmit={handleSubmit}
              className="flex-column justify-center align-center w-100 gap-20"
            >
              <div className="flex-row two-column justify-center align-start gap-20 w-100 dotted">
                <div className="block-left flex-column align-start">
                  <h3 className="mt-20 text-white align-self-center">
                    Adresse de départ
                  </h3>
                  <AddressForm
                    label=""
                    address={formData.departureAddress}
                    errors={geolocErrors}
                    onChange={(updatedAddress) =>
                      setFormData((prev) => ({
                        ...prev,
                        departureAddress: {
                          ...prev.departureAddress,
                          ...updatedAddress,
                        },
                      }))
                    }
                    onSubmit={async () => {
                      try {
                        const coords = await getCoordinates(
                          formData.departureAddress
                        )
                        const updatedAddress = {
                          ...formData.departureAddress,
                          coords,
                        }

                        setFormData((prev) => ({
                          ...prev,
                          departureAddress: updatedAddress,
                        }))

                        // Appel explicite avec les nouvelles coordonnées
                        await handleCalculateDuration(
                          formData.departureAddress.coords,
                          coords
                        )

                        setGeolocErrors("")
                      } catch {
                        console.log(
                          "Impossible de localiser l’adresse d’arrivée."
                        )
                        setGeolocErrors(
                          "Impossible de localiser l’adresse d’arrivée."
                        )
                      }
                    }}
                  />
                  <hr className="mt-20 mb-20" />
                  <h3 className="mt-20 text-white align-self-center">
                    Adresse de destination
                  </h3>
                  <AddressForm
                    label=""
                    address={formData.destinationAddress}
                    errors={geolocErrors}
                    onChange={(updatedAddress) =>
                      setFormData((prev) => ({
                        ...prev,
                        destinationAddress: {
                          ...prev.destinationAddress,
                          ...updatedAddress,
                        },
                      }))
                    }
                    onSubmit={async () => {
                      try {
                        const coords = await getCoordinates(
                          formData.destinationAddress
                        )
                        const updatedAddress = {
                          ...formData.destinationAddress,
                          coords,
                        }

                        setFormData((prev) => ({
                          ...prev,
                          destinationAddress: updatedAddress,
                        }))

                        // Appel explicite avec les nouvelles coordonnées
                        await handleCalculateDuration(
                          formData.destinationAddress.coords,
                          coords
                        )

                        setGeolocErrors("")
                      } catch {
                        console.log(
                          "Impossible de localiser l’adresse de destination."
                        )
                        setGeolocErrors(
                          "Impossible de localiser l’adresse de destination."
                        )
                      }
                    }}
                  />
                </div>
                <div className="block-right">
                  <div className="flex-row justify-center align-end gap-15 mb-20 mt-20">
                    <h3 className="text-white">Durée du trajet :</h3>
                    <p className="text-white p-0 text-emphase">
                      {displayDuration(formData.duration)}
                    </p>
                  </div>
                  <MapContainer
                    center={
                      formData.departureAddress.coords || [48.8566, 2.3522]
                    }
                    zoom={13}
                    style={{ maxHeight: "500px", aspectRatio: 1 }}
                    ref={setMap}
                  >
                    <TileLayer
                      attribution="&copy; OpenStreetMap"
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <MapMarker
                      position={formData.departureAddress.coords}
                      label="Départ"
                    />
                    <MapMarker
                      position={formData.destinationAddress.coords}
                      label="Arrivée"
                    />
                    {routeCoords.length > 0 && (
                      <Polyline positions={routeCoords} color="blue" />
                    )}
                  </MapContainer>
                </div>
              </div>

              <div className="flex-row two-column justify-center align-center gap-20 w-100 dotted">
                <div className="block-left flex-column align-start">
                  <div className="flex-row gap-15 align-center mb-20">
                    <label className="uppercase text-white">Date :</label>
                    <DatePicker
                      className="drop-btn"
                      locale="fr"
                      selected={formData.departureDate}
                      onChange={handleDateChange}
                      dateFormat="dd/MM/yyyy"
                      minDate={new Date()}
                    />
                  </div>
                  <div className="flex-row gap-15 justify-left align-center">
                    <label className="uppercase text-white">Heure</label>
                    <input
                      type="time"
                      name="departureTime"
                      value={
                        formData.departureDate
                          ? formatTimeToFrench(formData.departureDate).slice(
                              0,
                              5
                            )
                          : ""
                      }
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="block-right">
                  <div className="flex-row gap-15 justify-left align-center mb-20">
                    <label className="uppercase text-white">
                      Crédits par passager
                    </label>
                    <input
                      type="number"
                      name="creditsPerPassenger"
                      value={formData.creditsPerPassenger}
                      onChange={handleChange}
                      min="0"
                    />
                  </div>

                  <div className="flex-row gap-15 justify-left align-center">
                    <label className="uppercase text-white">
                      Places disponibles
                    </label>
                    <input
                      type="number"
                      name="availableSeats"
                      value={formData.availableSeats}
                      onChange={handleChange}
                      min="0"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="flex-row two-column justify-center align-start gap-20 w-100 dotted">
                <div className="block-left flex-column align-start">
                  <div className="flex-column gap-15 justify-left align-start mb-20 w-100">
                    <label className="uppercase text-white">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="10"
                      className="w-100"
                    />
                  </div>
                </div>
                <div className="block-right">
                  <div className="flex-column gap-15 justify-left align-start mb-20">
                    <label className="uppercase text-white">Véhicule</label>
                    <select
                      name="carId"
                      value={formData.car.carId}
                      onChange={handleChange}
                      className="custom-select-minimal"
                    >
                      {vehicles.map((vehicle) => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {vehicle.model} - {vehicle.registration_number} -{" "}
                          {vehicle.color}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <section className="flex-row justify-center gap-15">
                <button onClick={() => navigate(-1)} className="btn-light">
                  Retour
                </button>
                <button type="submit" className="btn-solid">
                  Mettre à jour
                </button>
              </section>
            </form>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default RideEdit
