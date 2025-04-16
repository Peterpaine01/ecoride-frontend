import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

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

const PublishRide = () => {
  const navigate = useNavigate()

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

  const { user } = useContext(AuthContext)

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  const handleAddressSelect = async (query, type) => {
    const response = await geocodingClient
      .forwardGeocode({ query, limit: 1 })
      .send()

    if (response.body.features.length > 0) {
      const place = response.body.features[0]
      const newCoords = place.center

      setFormData((prev) => ({
        ...prev,
        [type]: {
          street: place.text,
          city: place.context?.find((c) => c.id.includes("place"))?.text || "",
          zip:
            place.context?.find((c) => c.id.includes("postcode"))?.text || "",
          coords: newCoords,
        },
      }))

      setMarker(newCoords)
      setMapView({ longitude: newCoords[0], latitude: newCoords[1], zoom: 14 })
    }
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

  return (
    <>
      <Header />
      <Cover />
      <main>
        <div className="section">
          <h1>Nouveau trajet</h1>
        </div>
        <div className="section framed">
          {(step === 1 || step === 2 || step === 3) && (
            <>
              <div className="block-left">
                {/* Étape 1 : Adresse de départ */}
                {step === 1 && (
                  <>
                    <AddressForm
                      label="Où souhaitez-vous récupérer vos passager ?"
                      address={formData.departureAddress}
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
                        } catch {
                          console.log(
                            "Impossible de localiser l’adresse de départ."
                          )
                        }
                      }}
                    />

                    <button
                      className="btn-solid"
                      onClick={() => setStep(2)}
                      disabled={!formData.departureAddress.coords}
                    >
                      Continuer
                    </button>
                  </>
                )}
                {/* Étape 2 : Adresse de destination */}
                {step === 2 && (
                  <>
                    <AddressForm
                      label="Où allez-vous ?"
                      address={formData.destinationAddress}
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
                        } catch {
                          console.log(
                            "Impossible de localiser l’adresse de destination."
                          )
                        }
                      }}
                    />

                    <button
                      className="btn-solid"
                      onClick={() => setStep(3)}
                      disabled={!formData.destinationAddress.coords}
                    >
                      Continuer
                    </button>
                  </>
                )}
                {/* Étape 3 : Calcul itinéraire */}
                {step === 3 && (
                  <div>
                    <h3 className="text-lg font-semibold">
                      Temps de trajet estimé
                    </h3>
                    {formData.duration ? (
                      <p className="text-green-600 text-xl font-bold">
                        {formData.duration} minutes
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
                  style={{ height: "300px" }}
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
          {step === 4 && (
            <div>
              <label>Date de départ :</label>
              <input
                type="date"
                name="departureDate"
                value={formData.departureDate.split("T")[0]}
                onChange={handleChange}
              />
            </div>
          )}
          {/* Étape 4 : Date de départ */}
          {step === 4 && (
            <div>
              <label>Date de départ :</label>
              <input
                type="date"
                name="departureDate"
                value={formData.departureDate.split("T")[0] || ""}
                onChange={handleChange}
              />
            </div>
          )}

          {/* Étape 5 : Heure de départ */}
          {step === 5 && (
            <div>
              <label>Heure de départ :</label>
              <input
                type="time"
                name="departureTime"
                value={formData.departureDate.split("T")[1] || ""}
                onChange={handleChange}
              />
            </div>
          )}

          {/* Étape 6 : Véhicule */}
          {step === 6 && (
            <div>
              <label>Véhicule :</label>
              <select
                name="vehicleId"
                value={formData.vehicleId || ""}
                onChange={handleChange}
              >
                <option value="">Sélectionnez un véhicule</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.model} - {vehicle.registration_number}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Étape 7 : Nombre de passagers */}
          {step === 7 && (
            <div>
              <label>Nombre de places disponibles :</label>
              <input
                type="number"
                name="availableSeats"
                value={formData.availableSeats}
                onChange={handleChange}
              />
            </div>
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
              <button onClick={prevStep}>Précédent</button>
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
              <button onClick={prevStep}>Précédent</button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="btn-solid"
              >
                Publier
              </button>
            </div>
          )}
        </div>
        <section>
          {/* Navigation entre les étapes */}
          <div>
            {step > 1 && <button onClick={prevStep}>Précédent</button>}
            {step < 9 ? (
              <button onClick={nextStep} className="btn-solid">
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
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default PublishRide
