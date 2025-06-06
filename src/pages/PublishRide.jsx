import { useState, useEffect, useContext, useRef } from "react"
import { AuthContext } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

// Handle Date
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { registerLocale } from "react-datepicker"
import fr from "date-fns/locale/fr"

import { MapContainer, TileLayer, Polyline } from "react-leaflet"
import "leaflet/dist/leaflet.css"

// Utils
import {
  getCoordinates,
  reverseGeocode,
  calculateRoute,
} from "../utils/geolocation"
import { displayDuration } from "../utils/dateTimeHandler"
import { sanitizeText } from "../utils/sanitizeInput"

import axios from "../config/axiosConfig"
import { toast } from "react-toastify"

// Icones
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"

// Components
import Header from "../components/Header"
import Cover from "../components/Cover"
import Footer from "../components/Footer"
import Counter from "../components/Counter"
import RideSummary from "../components/RideSummary"
import StepIndicator from "../components/StepIndicator"
import MapMarker from "../components/MapMarker"
import AddressForm from "../components/AddressForm"
import AddCarForm from "../components/AddCarForm"

const PublishRide = () => {
  const navigate = useNavigate()
  registerLocale("fr", fr)
  const { user } = useContext(AuthContext)

  // Redirection
  useEffect(() => {
    if (!user) {
      navigate("/se-connecter")
    } else if (!user.is_driver) {
      toast.info(
        "Pour accéder à cette fonctionnalité, merci de modifier votre profil en vous définissant comme conducteur."
      )
      navigate(`/modifier-profil/${user.account_id}`)
    }
  }, [user])

  const [step, setStep] = useState(1)
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
  const [map, setMap] = useState(null)
  const [geolocFailed, setGeolocFailed] = useState(false)
  const [errors, setErrors] = useState("")
  const [isVehiclesModalOpen, setIsVehiclesModalOpen] = useState(false)

  const nextStep = () => {
    hydrateFormStepData()
    setStep(step + 1)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const prevStep = () => {
    setStep(step - 1)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const isFormValide = () => {
    if (step === 1) {
      if (
        !formData.departureAddress?.coords ||
        formData.departureAddress?.coords?.length === 0
      ) {
        return false
      }
    }
    if (step === 2) {
      if (
        !formData.destinationAddress?.coords ||
        formData.destinationAddress?.coords?.length === 0
      ) {
        return false
      }
    }
    if (step === 6) {
      console.log("formData.vehicleId", formData)

      return !!formData.vehicleId
    }
    return true
  }

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
    if (
      step === 1 &&
      !formData.destinationAddress.coords &&
      "geolocation" in navigator
    ) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const coords = [pos.coords.latitude, pos.coords.longitude]
          setFormData((prev) => ({
            ...prev,
            destinationAddress: { ...prev.destinationAddress, coords },
          }))
          const address = await reverseGeocode(coords)
          setFormData((prev) => ({
            ...prev,
            destinationAddress: {
              ...prev.destinationAddress,
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
  }, [step, formData.destinationAddress.coords])

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

  // HANDLE DATE
  const handleDateChange = (date) => {
    const selectedDate = new Date(date)
    selectedDate.setHours(0, 0, 0, 0)
    setFormData({ ...formData, departureDate: selectedDate.toISOString() })
  }

  const formatTimeToFrench = (isoDate) => {
    const date = new Date(isoDate)

    const options = { hour: "2-digit", minute: "2-digit" }
    return date.toLocaleTimeString("fr-FR", options)
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => {
      if (name === "departureTime") {
        const [hour, minute] = value.split(":")
        const currentDate = prev.departureDate

        if (!currentDate) {
          // On attend que la date soit d'abord remplie
          return prev
        }

        const date = new Date(currentDate)
        date.setHours(Number(hour), Number(minute), 0, 0)

        return {
          ...prev,
          departureDate: date.toISOString(), // correct en UTC
        }
      }

      if (name === "description") {
        return {
          ...prev,
          description: sanitizeText(value),
        }
      }

      const addressFields = ["street", "city", "zip"]
      for (const addressType of ["departureAddress", "destinationAddress"]) {
        for (const field of addressFields) {
          if (name === `${addressType}.${field}`) {
            return {
              ...prev,
              [addressType]: {
                ...prev[addressType],
                [field]: sanitizeText(value),
              },
            }
          }
        }
      }

      return {
        ...prev,
        [name]: value,
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post("/create-ride", formData)

      if (response.status === 201 || response.status === 200) {
        console.log("Le ride a bien été créé")
        toast.success("Le trajet a bien été créé")
        navigate("/vos-trajets")
      }
    } catch (error) {
      console.error("Error creating ride :", error)
      toast.error("Une erreur est survenue. Veuillez réessayer.")
    }
  }

  const fetchVehicles = async () => {
    try {
      const response = await axios.get(`/user-cars/${user.account_id}`)
      console.log("data cars : ", response.data)

      setVehicles(response.data)
      if (response.data.length > 0) {
        setFormData((prev) => ({
          ...prev,
          vehicleId: response.data[0].id,
        }))
      }
    } catch (error) {
      console.error("Error fetching cars :", error)
    }
  }

  useEffect(() => {
    if (step === 6 || step === 10) {
      if (!user || !user.account_id) {
        console.error("Utilisateur non authentifié ou account_id manquant.")
        return
      }

      fetchVehicles()
    }
  }, [step, user])

  const calculateDistanceAndPrice = (startCoords, endCoords) => {
    const formatCoords = (coords) => {
      if (!coords) return null

      if (Array.isArray(coords) && coords.length === 2) {
        const [lat, lng] = coords
        return { lat, lng }
      }

      if (typeof coords === "object" && "lat" in coords && "lng" in coords) {
        return coords
      }

      return null
    }

    const start = formatCoords(startCoords)
    const end = formatCoords(endCoords)

    if (!start || !end) return 2

    const startLatLng = L.latLng(start.lat, start.lng)
    const endLatLng = L.latLng(end.lat, end.lng)

    const distanceMeters = startLatLng.distanceTo(endLatLng)
    const distanceKm = distanceMeters / 1000

    // Formule : (km / 20) + 2
    const price = Math.ceil(distanceKm / 20 + 2)

    return price
  }

  const hydrateFormStepData = () => {
    if (step === 4) {
      if (!formData.departureDate) {
        const now = new Date()
        setFormData((prev) => ({
          ...prev,
          departureDate: now.toISOString(),
        }))
      }
    }

    if (step === 5) {
      if (!formData.availableSeats) {
        setFormData((prev) => ({
          ...prev,
          availableSeats: 1,
        }))
      }
    }

    if (step === 6) {
      if (!formData.vehicleId && vehicles.length > 0) {
        setFormData((prev) => ({
          ...prev,
          vehicleId: vehicles[0].id,
        }))
      }
    }

    if (step === 7) {
      if (
        !formData.creditsPerPassenger &&
        formData.departureAddress.coords &&
        formData.destinationAddress.coords
      ) {
        const price = calculateDistanceAndPrice(
          formData.departureAddress.coords,
          formData.destinationAddress.coords
        )

        setFormData((prev) => ({
          ...prev,
          creditsPerPassenger: price,
        }))
      }
    }
  }

  useEffect(() => {
    if (map && routeCoords.length > 0) {
      const bounds =
        routeCoords.length === 1
          ? map.getBounds().extend(routeCoords[0]) // fallback pour un seul point
          : routeCoords
      map.fitBounds(bounds, { padding: [20, 20] })
    }
  }, [map, routeCoords])

  console.log("formData", formData)

  return (
    <>
      <Header />
      <Cover />
      <main>
        <div className="container" id="publishRide">
          <section>
            <h1>Nouveau trajet</h1>
            <div className="mb-20">
              <StepIndicator currentStep={step} totalSteps={10} />
            </div>
          </section>

          <section className="new-ride flex-row two-column framed">
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

                            if (!coords) {
                              setErrors(
                                "Impossible de localiser l’adresse de départ."
                              )
                              setFormData((prev) => ({
                                ...prev,
                                departureAddress: {
                                  ...prev.departureAddress,
                                  coords: [],
                                },
                              }))
                              return
                            }

                            setFormData((prev) => ({
                              ...prev,
                              departureAddress: {
                                ...prev.departureAddress,
                                coords,
                              },
                            }))
                            setErrors("")
                          } catch (error) {
                            console.error("Erreur de géocodage :", error)
                            setFormData((prev) => ({
                              ...prev,
                              departureAddress: {
                                ...prev.departureAddress,
                                coords: [],
                              },
                            }))
                            setErrors(
                              "Impossible de localiser l’adresse de départ."
                            )
                          }
                        }}
                      />
                      {geolocFailed && (
                        <p>
                          Impossible d’accéder à votre position. Saisissez
                          l’adresse de départ manuellement.
                        </p>
                      )}
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

                            if (!coords) {
                              setErrors(
                                "Impossible de localiser l’adresse de destination."
                              )
                              setFormData((prev) => ({
                                ...prev,
                                destinationAddress: {
                                  ...prev.destinationAddress,
                                  coords: [],
                                },
                              }))
                              return
                            }

                            setFormData((prev) => ({
                              ...prev,
                              destinationAddress: {
                                ...prev.destinationAddress,
                                coords,
                              },
                            }))
                            setErrors("")
                          } catch (error) {
                            console.error("Erreur de géocodage :", error)
                            setFormData((prev) => ({
                              ...prev,
                              destinationAddress: {
                                ...prev.destinationAddress,
                                coords: [],
                              },
                            }))
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
                      {formData.duration || formData.duration === 0 ? (
                        <p className="emphase mt-20">
                          {displayDuration(formData.duration)}
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
                    center={
                      formData.departureAddress.coords || [48.8566, 2.3522]
                    }
                    zoom={13}
                    style={{ minHeight: "300px", aspectRatio: 1 }}
                    ref={setMap}
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
                    value={
                      formData.departureDate
                        ? formatTimeToFrench(formData.departureDate).slice(0, 5)
                        : ""
                    }
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
                  {vehicles && vehicles.length > 0 ? (
                    <div>
                      <select
                        name="vehicleId"
                        id="vehicleId"
                        value={formData.vehicleId}
                        onChange={handleChange}
                        className="custom-select-minimal"
                      >
                        {vehicles.map((vehicle, index) => {
                          return (
                            <option key={vehicle.id} value={vehicle.id}>
                              {vehicle.model} - {vehicle.registration_number}
                            </option>
                          )
                        })}
                      </select>
                    </div>
                  ) : (
                    <div className="dotted">
                      <p className="text-center">
                        Vous n'avez pas encore associé de véhicule à votre
                        compte.
                      </p>
                    </div>
                  )}

                  <div className="mt-20 mb-20">
                    <button
                      onClick={() => setIsVehiclesModalOpen(true)}
                      className="btn-link mt-20 flex-row align-center gap-5"
                    >
                      <AddCircleOutlineIcon /> Ajouter un véhicule
                    </button>
                  </div>
                  <div
                    className={`${
                      isVehiclesModalOpen ? "modal-active" : "modal-inactive"
                    }`}
                  >
                    <AddCarForm
                      isVehiclesModalOpen={isVehiclesModalOpen}
                      setIsVehiclesModalOpen={setIsVehiclesModalOpen}
                      fetchVehicles={fetchVehicles}
                    />
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
              <>
                <div className="block-left flex-column align-center">
                  <h2>Combien de crédits par passager ?</h2>

                  <Counter
                    name={"creditsPerPassenger"}
                    value={formData.creditsPerPassenger || 2}
                    onChange={handleChange}
                    minValue={2}
                    maxValue={1000}
                  />
                </div>

                <div className="block-right justify-left">
                  <p>
                    <strong>Prix idéal :</strong>{" "}
                    {calculateDistanceAndPrice(
                      formData.departureAddress.coords,
                      formData.destinationAddress.coords
                    )}{" "}
                    crédits
                  </p>
                  <p>
                    Ecoride vous conseille d'adapter votre prix
                    proportionnellement au nombre de kilomètres parcourus.
                  </p>

                  <div className="flex-row align-center gap-15 mt-20">
                    <div className="comission flex-colunm align-center">
                      <p>
                        <strong>2</strong> crédits
                      </p>
                    </div>
                    <p>
                      La plateforme EcoRide prélève 2 crédits de commission par
                      trajet.
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Étape 9 : Description */}
            {step === 9 && (
              <div className="flex-column align-center text-align w-100">
                <h2>Quelque chose à partager sur votre trajet ?</h2>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="10"
                  cols="10"
                  className="description-textarea"
                  placeholder="Vous êtes flexible quant au lieu de rencontre ? L’espace dans votre coffre est limité ? Dites le à vos passagers !"
                ></textarea>
              </div>
            )}
            {/* Étape 10 : Résumé */}
            {step === 10 && (
              <div className="summary  flex-column two-column w-100">
                <h2>Résumé du trajet</h2>
                <RideSummary formData={formData} vehicles={vehicles} />
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
            {step < 10 ? (
              <button
                onClick={nextStep}
                className="btn-solid"
                disabled={!isFormValide()}
              >
                Continuer
              </button>
            ) : (
              <button
                type="submit"
                onClick={handleSubmit}
                className="btn-solid"
              >
                Publier
              </button>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default PublishRide
