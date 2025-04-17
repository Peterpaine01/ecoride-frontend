import { useState, useEffect, useContext, useRef } from "react"
import { AuthContext } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

import { Plus, Minus } from "react-feather"

// Handle Date
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { registerLocale } from "react-datepicker"
import fr from "date-fns/locale/fr"

import { MapContainer, TileLayer, Polyline } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import MapMarker from "../components/MapMarker"
import AddressForm from "../components/AddressForm"
import {
  getCoordinates,
  reverseGeocode,
  calculateRoute,
} from "../utils/geolocation"

import axios from "../config/axiosConfig"

// Components
import Header from "../components/Header"
import Cover from "../components/Cover"
import Footer from "../components/Footer"
import Counter from "../components/Counter"

const PublishRide = () => {
  const navigate = useNavigate()

  const mapRef = useRef(null)

  const [step, setStep] = useState(7)
  const [vehicles, setVehicles] = useState([])
  const [formData, setFormData] = useState({
    departureDate: "",
    departureAddress: { street: "", city: "", zip: "", coords: null },
    destinationAddress: { street: "", city: "", zip: "", coords: null },
    duration: "",
    availableSeats: "",
    creditsPerPassenger: "",
    description: "",
    vehicleId: "",
  })
  const [routeCoords, setRouteCoords] = useState([])
  const [geolocFailed, setGeolocFailed] = useState(false)
  const [errors, setErrors] = useState("")
  const [isMapReady, setIsMapReady] = useState(false)

  const { user } = useContext(AuthContext)

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  useEffect(() => {
    if (
      step === 1 &&
      !formData.departureAddress.coords &&
      "geolocation" in navigator
    ) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const coords = [pos.coords.latitude, pos.coords.longitude]
          setFormData((prev) => ({
            ...prev,
            departureAddress: { ...prev.departureAddress, coords },
          }))
          const address = await reverseGeocode(coords)
          setFormData((prev) => ({
            ...prev,
            departureAddress: {
              ...prev.departureAddress,
              street: address.street,
              city: address.city,
              zip: address.zip,
            },
          }))
        },
        (err) => {
          console.warn("Erreur géolocalisation :", err)

          if (err.code === 2) {
            console.log(
              "La géolocalisation est indisponible, veuillez saisir votre adresse manuellement."
            )
          } else {
            console.log(
              "Impossible d’obtenir votre position. Essayez de réactiver la géolocalisation."
            )
          }

          setGeolocFailed(true)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      )
    }
  }, [step, formData.departureAddress.coords])

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const result = await calculateRoute(
          formData.departureAddress.coords,
          formData.destinationAddress.coords
        )
        setFormData((prev) => ({
          ...prev,
          duration: result.duration,
        }))
        setRouteCoords(result.routeCoords)
      } catch (err) {
        console.error(err)
        console.log("Erreur lors du calcul de l’itinéraire")
      }
    }

    if (
      step === 3 &&
      formData.departureAddress.coords &&
      formData.destinationAddress.coords
    ) {
      fetchRoute()
    }
  }, [
    step,
    formData.departureAddress.coords,
    formData.destinationAddress.coords,
  ])

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => {
      if (name === "departureDate") {
        const existingTime = prev.departureDate.split("T")[1] || "00:00"
        return {
          ...prev,
          departureDate: `${value}T${existingTime}`,
        }
      }

      if (name === "departureTime") {
        const existingDate =
          prev.departureDate.split("T")[0] ||
          new Date().toISOString().split("T")[0]
        return {
          ...prev,
          departureDate: `${existingDate}T${value}`,
        }
      }

      return { ...prev, [name]: value }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post("/create-ride", formData)

      if (response.status === 201 || response.status === 200) {
        console.log("Le ride a bien été créé")
        navigate("/vos-trajets")
      }
    } catch (error) {
      console.error("Error creating ride :", error)
      alert("Une erreur est survenue. Veuillez réessayer.")
    }
  }

  useEffect(() => {
    if (step === 6) {
      if (!user || !user.account_id) {
        console.error("Utilisateur non authentifié ou account_id manquant.")
        return
      }

      const fetchVehicles = async () => {
        try {
          const response = await axios.get(`/user-cars/${user.account_id}`)
          console.log("data cars : ", response.data[0])

          setVehicles(response.data)
        } catch (error) {
          console.error("Error fetching cars :", error)
        }
      }

      fetchVehicles()
    }
  }, [step, user])

  useEffect(() => {
    if (isMapReady && step === 3 && routeCoords.length > 0 && mapRef.current) {
      const bounds = L.latLngBounds(
        routeCoords.map(([lat, lng]) => L.latLng(lat, lng))
      )

      console.log("✅ Zoom sur l’itinéraire :", bounds)

      mapRef.current.fitBounds(bounds, {
        padding: [50, 50],
        animate: true,
      })
    }
  }, [isMapReady, step, routeCoords])

  useEffect(() => {
    console.log("Zoom Check →", {
      step,
      routeCoordsLength: routeCoords.length,
      isMapReady,
      hasMap: !!mapRef.current,
    })
  }, [step, routeCoords, isMapReady])

  // HANDLE DATE
  registerLocale("fr", fr)

  const handleDateChange = (date) => {
    setFormData({ ...formData, departureDate: date })
  }

  console.log(formData)

  return (
    <>
      <Header />
      <Cover />
      <main>
        <section>
          <h1>Nouveau trajet</h1>
          {geolocFailed && (
            <p className="text-red-600 mt-10">
              Impossible d’accéder à votre position. Saisissez l’adresse de
              départ manuellement.
            </p>
          )}
        </section>

        <section className="flex-row two-column framed">
          {(step === 1 || step === 2 || step === 3) && (
            <>
              <div className="block-left">
                {/* Étape 1 : Adresse de départ */}
                {step === 1 && (
                  <>
                    <AddressForm
                      label="Où souhaitez-vous récupérer vos passagers ?"
                      address={formData.departureAddress}
                      errors={errors}
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
                          setFormData((prev) => ({
                            ...prev,
                            departureAddress: {
                              ...prev.departureAddress,
                              coords,
                            },
                          }))
                          setErrors("")
                        } catch {
                          console.log(
                            "Impossible de localiser l’adresse de départ."
                          )
                          setErrors(
                            "Impossible de localiser l’adresse de départ."
                          )
                        }
                      }}
                    />
                  </>
                )}
                {/* Étape 2 : Adresse de destination */}
                {step === 2 && (
                  <>
                    <AddressForm
                      label="Où allez-vous ?"
                      address={formData.destinationAddress}
                      errors={errors}
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
                          setFormData((prev) => ({
                            ...prev,
                            destinationAddress: {
                              ...prev.destinationAddress,
                              coords,
                            },
                          }))
                          setErrors("")
                        } catch {
                          console.log(
                            "Impossible de localiser l’adresse de destination."
                          )
                          setErrors(
                            "Impossible de localiser l’adresse de destination."
                          )
                        }
                      }}
                    />
                  </>
                )}
                {/* Étape 3 : Calcul itinéraire */}
                {step === 3 && (
                  <div className="flex-column align-center">
                    <h2 className="text-lg font-semibold">
                      Temps de trajet estimé
                    </h2>
                    {formData.duration ? (
                      <p className="emphase mt-20">
                        {(() => {
                          const duration = Math.round(formData.duration)
                          if (duration >= 60) {
                            const hours = Math.floor(duration / 60)
                            const minutes = duration % 60
                            return `${hours}h${
                              minutes > 0 ? ` ${minutes} min` : ""
                            }`
                          } else {
                            return `${duration} min`
                          }
                        })()}
                      </p>
                    ) : (
                      <p className="text-red-600">
                        Calcul en cours ou impossible.
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div className="block-right">
                <MapContainer
                  center={formData.departureAddress.coords || [48.8566, 2.3522]}
                  zoom={13}
                  style={{ minHeight: "300px", aspectRatio: 1 }}
                  ref={mapRef}
                >
                  <TileLayer
                    attribution="&copy; OpenStreetMap"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {formData.departureAddress.coords && (
                    <MapMarker
                      position={formData.departureAddress.coords}
                      label="Départ"
                    />
                  )}
                  {formData.destinationAddress.coords && (
                    <MapMarker
                      position={formData.destinationAddress.coords}
                      label="Arrivée"
                    />
                  )}
                  {routeCoords.length > 0 && (
                    <Polyline positions={routeCoords} color="blue" />
                  )}
                </MapContainer>
              </div>
            </>
          )}

          {/* Étape 4 : Date de départ */}
          {step === 4 && (
            <>
              <div className="block-left flex-column align-center">
                <h2>Quand partez-vous ?</h2>
                <p className="emphase mt-20">
                  {formData.departureDate
                    ? new Date(formData.departureDate)
                        .toLocaleDateString("fr-FR", {
                          weekday: "short",
                          day: "2-digit",
                          month: "long",
                        })
                        .replace(".", "")
                        .replace(/^\w/, (c) => c.toUpperCase())
                    : new Date()
                        .toLocaleDateString("fr-FR", {
                          weekday: "short",
                          day: "2-digit",
                          month: "long",
                        })
                        .replace(".", "")
                        .replace(/^\w/, (c) => c.toUpperCase())}
                </p>
              </div>

              <div className="block-right date-picker-content">
                <DatePicker
                  className="drop-btn"
                  locale="fr"
                  selected={formData.departureDate}
                  onChange={handleDateChange}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Aujourd'hui"
                  minDate={new Date()}
                  inline
                />
              </div>
            </>
          )}

          {/* Étape 5 : Heure de départ */}
          {step === 5 && (
            <>
              <div className="flex-column align-center w-100">
                <h2>A quelle heure ?</h2>

                <input
                  type="time"
                  name="departureTime"
                  value={formData.departureDate.split("T")[1] || ""}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          {/* Étape 6 : Véhicule */}
          {step === 6 && (
            <>
              <div className="flex-column align-center w-100">
                <h2>Avec quel véhicule ?</h2>

                <div className="custom-select mt-20">
                  <div className="select" tabIndex="1">
                    {vehicles.map((vehicle, index) => {
                      const inputId = `vehicle-${vehicle.id}`
                      console.log(formData.vehicleId)

                      return (
                        <div className="wrapper-select" key={vehicle.id}>
                          <input
                            className="selectopt"
                            name="vehicleId"
                            type="radio"
                            id={inputId}
                            value={vehicle.id}
                            checked={
                              formData.vehicleId
                                ? formData.vehicleId === String(vehicle.id)
                                : index === 0 // coche le premier par défaut
                            }
                            onChange={handleChange}
                          />
                          <label htmlFor={inputId} className="option">
                            {vehicle.model} - {vehicle.registration_number}
                          </label>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Étape 7 : Nombre de passagers */}
          {step === 7 && (
            <>
              <div className="flex-column align-center w-100">
                <h2>Combien de passagers ?</h2>
                <Counter
                  name={"availableSeats"}
                  value={formData.availableSeats || 1}
                  onChange={handleChange}
                  minValue={1}
                  maxValue={8}
                />
              </div>
            </>
          )}

          {/* Étape 8 : Nombre de crédits par passager */}
          {step === 8 && (
            <div>
              <label>Crédits par passager :</label>
              <input
                type="number"
                name="creditsPerPassenger"
                value={formData.creditsPerPassenger}
                onChange={handleChange}
              />
            </div>
          )}

          {/* Étape 9 : Description */}
          {step === 9 && (
            <div>
              <label>Description :</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>
          )}
        </section>
        <section className="flex-row gap-15 justify-center">
          {/* Navigation entre les étapes */}
          {step > 1 && (
            <button className="btn-light" onClick={prevStep}>
              Précédent
            </button>
          )}
          {step < 9 ? (
            <button
              onClick={nextStep}
              className="btn-solid"
              disabled={
                step === 1
                  ? !formData.departureAddress.street ||
                    !formData.departureAddress.zip ||
                    !formData.departureAddress.city
                  : step === 2
                  ? !formData.destinationAddress.coords
                  : ""
              }
            >
              Continuer
            </button>
          ) : (
            <button type="submit" onClick={handleSubmit} className="btn-solid">
              Publier
            </button>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}

export default PublishRide
