import React, { useState, useEffect } from "react"
import { MapContainer, TileLayer, Polyline } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import MapMarker from "../components/MapMarker"
import AddressForm from "../components/AddressForm"
import {
  getCoordinates,
  reverseGeocode,
  calculateRoute,
} from "../utils/geolocation"

const PublishRideTest = () => {
  const [step, setStep] = useState(1)
  const [startAddress, setStartAddress] = useState("")
  const [endAddress, setEndAddress] = useState("")
  const [startCoords, setStartCoords] = useState(null)
  const [endCoords, setEndCoords] = useState(null)
  const [routeCoords, setRouteCoords] = useState([])
  const [duration, setDuration] = useState(null)

  useEffect(() => {
    if (step === 1 && !startCoords && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const coords = [pos.coords.latitude, pos.coords.longitude]
          setStartCoords(coords)
          const address = await reverseGeocode(coords)
          setStartAddress(address)
        },
        (err) => {
          console.warn("Erreur géolocalisation :", err)

          if (err.code === 2) {
            // Code 2: Position indisponible. Demande à l'utilisateur de saisir l'adresse manuellement.
            console.log(
              "La géolocalisation est indisponible, veuillez saisir votre adresse manuellement."
            )
          } else {
            // Autres erreurs, afficher le message approprié
            console.log(
              "Impossible d’obtenir votre position. Essayez de réactiver la géolocalisation."
            )
          }

          // Force la saisie manuelle si géolocalisation échoue
          setGeolocFailed(true)
        },
        {
          enableHighAccuracy: true, // Essayer d'obtenir la position la plus précise possible
          timeout: 10000, // Timeout après 10 secondes
          maximumAge: 0, // Ne jamais utiliser une position obsolète
        }
      )
    }
  }, [step])

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const result = await calculateRoute(startCoords, endCoords)
        setDuration(result.duration)
        setRouteCoords(result.routeCoords)
      } catch (err) {
        console.error(err)
        console.log("Erreur lors du calcul de l’itinéraire")
      }
    }

    if (step === 3 && startCoords && endCoords) {
      fetchRoute()
    }
  }, [step, startCoords, endCoords])

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold">Planification d’un itinéraire</h2>

      {step === 1 && (
        <>
          <AddressForm
            label="Adresse de départ"
            address={startAddress}
            onChange={setStartAddress}
            onSubmit={async () => {
              try {
                const coords = await getCoordinates(startAddress)
                setStartCoords(coords)
              } catch {
                console.log("Impossible de localiser l’adresse de départ.")
              }
            }}
          />

          <button
            className="mt-2 bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setStep(2)}
            disabled={!startCoords}
          >
            Continuer
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <AddressForm
            label="Adresse d’arrivée"
            address={endAddress}
            onChange={setEndAddress}
            onSubmit={async () => {
              try {
                const coords = await getCoordinates(endAddress)
                setEndCoords(coords)
              } catch {
                console.log("Impossible de localiser l’adresse d’arrivée.")
              }
            }}
          />

          <button
            className="mt-2 bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setStep(3)}
            disabled={!endCoords}
          >
            Continuer
          </button>
        </>
      )}

      <MapContainer
        center={startCoords || [48.8566, 2.3522]}
        zoom={13}
        style={{ height: "300px" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {startCoords && <MapMarker position={startCoords} label="Départ" />}
        {endCoords && <MapMarker position={endCoords} label="Arrivée" />}
        {routeCoords.length > 0 && (
          <Polyline positions={routeCoords} color="blue" />
        )}
      </MapContainer>

      {step === 3 && (
        <div>
          <h3 className="text-lg font-semibold">Temps de trajet estimé</h3>
          {duration ? (
            <p className="text-green-600 text-xl font-bold">
              {duration} minutes
            </p>
          ) : (
            <p className="text-red-600">Calcul en cours ou impossible.</p>
          )}
        </div>
      )}
    </div>
  )
}

export default PublishRideTest
