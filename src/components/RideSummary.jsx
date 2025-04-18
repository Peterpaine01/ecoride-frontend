import {
  Calendar,
  MapPin,
  Target,
  Clock,
  Users,
  CreditCard,
  Edit,
  Truck,
} from "react-feather"

import { displayDuration } from "../utils/dateTimeHandler"

const RideSummary = ({ formData, vehicles }) => {
  const {
    departureDate,
    departureAddress,
    destinationAddress,
    duration,
    availableSeats,
    creditsPerPassenger,
    description,
    vehicleId,
  } = formData

  const rideVehicle = vehicles.find((vehicle) => vehicle.id === vehicleId)

  const formatDateToFrench = (isoDate) => {
    if (!isoDate) return ""
    const date = new Date(isoDate)
    const formatted = date.toLocaleString("fr-FR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

    return formatted.charAt(0).toUpperCase() + formatted.slice(1)
  }

  return (
    <div className="flex-row two-column align-start w-100">
      <div className="block-left flex-column align-start">
        <div className="flex-column mb-10 dotted">
          <h3 className="flex-row align-center gap-5 color-secondary">
            <strong className="color-yellow">
              <Calendar size={20} />
            </strong>
            <strong className="flex-row align-center">Date de départ</strong>
          </h3>
          <p>{formatDateToFrench(departureDate)}</p>
        </div>
        <div className="flex-column mb-10 dotted">
          <h3 className="flex-row align-center gap-5 color-secondary">
            <strong className="color-yellow">
              <MapPin size={20} />
            </strong>
            <strong className="flex-row align-center">Adresse de départ</strong>
          </h3>
          <p>
            {departureAddress.street} {departureAddress.zip}{" "}
            {departureAddress.city}
          </p>
        </div>
        <div className="flex-column mb-10 dotted">
          <h3 className="flex-row align-center gap-5 color-secondary">
            <strong className="color-yellow">
              <Target size={20} />
            </strong>
            Adresse de destination
          </h3>
          <p>
            {destinationAddress.street} {destinationAddress.zip}{" "}
            {destinationAddress.city}
          </p>
        </div>

        <div className="flex-column mb-10 dotted">
          <h3 className="flex-row align-center gap-5 color-secondary">
            <strong className="color-yellow">
              <Clock size={20} />
            </strong>
            Durée estimée
          </h3>
          <p>{displayDuration(duration) || "Non précisée"}</p>
        </div>
      </div>
      <div className="block-right">
        <div className="flex-column mb-10 dotted">
          <h3 className="flex-row align-center gap-5 color-secondary">
            <strong className="color-yellow">
              <Users size={20} />
            </strong>
            Places disponibles
          </h3>
          <p>
            {availableSeats} place{availableSeats > 1 && "s"}
          </p>
        </div>

        <div className="flex-column mb-10 dotted">
          <h3 className="flex-row align-center gap-5 color-secondary">
            <strong className="color-yellow">
              <CreditCard size={20} />
            </strong>
            Crédits par passager
          </h3>
          <p>{creditsPerPassenger} crédits/passager</p>
        </div>

        <div className="flex-column mb-10 dotted">
          <h3 className="flex-row align-center gap-5 color-secondary">
            <strong className="color-yellow">
              <Edit size={20} />
            </strong>
            Description
          </h3>
          <p>{description || "Aucune description fournie"}</p>
        </div>

        <div className="flex-column mb-10 dotted">
          <h3 className="flex-row align-center gap-5 color-secondary">
            <strong className="color-yellow">
              <Truck size={20} />
            </strong>
            Véhicule
          </h3>
          <p>
            {rideVehicle
              ? `${rideVehicle.model} - ${rideVehicle.registration_number}`
              : "Non sélectionné"}
          </p>
        </div>
      </div>
    </div>
  )
}

export default RideSummary
