import axios from "../config/axiosConfig"
import { AuthContext } from "../context/AuthContext"
import { useContext } from "react"
import { useNavigate } from "react-router-dom"

import DeleteIcon from "@mui/icons-material/Delete"
import ModeEditIcon from "@mui/icons-material/ModeEdit"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"

import { displayDuration } from "../utils/dateTimeHandler"

const RoadMapCard = ({ ride, booking, driverRide }) => {
  const {
    _id,
    departureAddress,
    departureDate,
    destinationAddress,
    duration,
    rideStatus,
  } = ride

  const { authLoading, refreshUser } = useContext(AuthContext)
  const navigate = useNavigate()

  if (authLoading) return null

  // ==== UTILS ====
  const getTimeFromDate = (date) => {
    const d = new Date(date)
    return `${String(d.getHours()).padStart(2, "0")}:${String(
      d.getMinutes()
    ).padStart(2, "0")}`
  }

  const getArrivalDate = () => {
    const d = new Date(departureDate)
    return new Date(d.getTime() + (duration || 0) * 60000)
  }

  const isToday = (date) => {
    const today = new Date()
    const target = new Date(date)
    return today.toDateString() === target.toDateString()
  }

  // ==== STATUTS SIMPLIFIÉS ====
  const isRideToday = isToday(departureDate)
  const isDriver = driverRide
  const isRideCompleted = rideStatus === "completed"
  const isRideOngoing = rideStatus === "ongoing"
  const isRideForthcoming = rideStatus === "forthcoming"

  const isBookingForthcoming = booking?.bookingStatus === "forthcoming"
  const isBookingCompleted = booking?.bookingStatus === "completed"
  const isBookingReviewed = booking?.bookingStatus === "reviewed"

  // ==== HANDLERS ====
  const handleStartStopRide = async (action) => {
    const newStatus = action === "start" ? "ongoing" : "completed"
    try {
      await axios.patch(`/update-ride/${_id}`, { rideStatus: newStatus })
      refreshUser()
    } catch (error) {
      console.error(`Erreur ${action} du trajet :`, error)
    }
  }

  const handleDeleteRide = async () => {
    try {
      await axios.patch(`/update-ride/${_id}`, { rideStatus: "canceled" })
      refreshUser()
    } catch (error) {
      console.error("Erreur suppression trajet :", error)
    }
  }

  const handleCancelBooking = async () => {
    try {
      await axios.patch(`/update-booking/${booking._id}`, {
        bookingStatus: "canceled",
      })
      refreshUser()
    } catch (error) {
      console.error("Erreur annulation réservation :", error)
    }
  }

  const handleNavigateToRecap = () => {
    navigate(`/recap-trajet/${_id}`, {
      state: {
        driverRide: driverRide,
        bookingId: booking?._id || null,
      },
    })
  }

  const departureTime = getTimeFromDate(departureDate)
  const arrivalTime = getTimeFromDate(getArrivalDate())

  return (
    <article
      className={`roadmap-card ${
        isRideCompleted ? "card-disabled" : "bg-white b-shadow"
      } br-10 flex-row space-between`}
    >
      {/* === Infos de trajet === */}
      <div className="ride-card flex-column">
        <div className="info-ride flex-row justify-left">
          <div className="hours flex-column space-between">
            <p>{departureTime}</p>
            <p>{arrivalTime}</p>
          </div>
          <div className="timing flex-row">
            <div className="ride-line">
              <span className="round"></span>
              <span className="timeline"></span>
              <span className="round"></span>
            </div>
          </div>
          <div className="cities flex-column space-between">
            <p>{departureAddress?.city || "Ville inconnue"}</p>
            <div className="timing">
              <p>
                {typeof duration === "number"
                  ? displayDuration(duration)
                  : "Durée inconnue"}
              </p>
            </div>
            <p>{destinationAddress?.city || "Ville inconnue"}</p>
          </div>
        </div>
      </div>

      {/* === Actions & Statuts === */}
      <div className="meta">
        <div className="actions flex-row justify-end align-center w-100">
          {isDriver && !isRideCompleted && (
            <>
              <button
                onClick={handleDeleteRide}
                className="icon-button"
                aria-label="Annuler le trajet"
              >
                <DeleteIcon sx={{ color: "#023560", fontSize: 24 }} />
              </button>
              <button
                onClick={() => navigate(`/modifier-trajet/${_id}`)}
                className="icon-button"
                aria-label="Modifier le trajet"
              >
                <ModeEditIcon sx={{ color: "#023560", fontSize: 24 }} />
              </button>
            </>
          )}

          {!isDriver &&
            !isRideCompleted &&
            !isRideToday &&
            isBookingForthcoming && (
              <button
                onClick={handleCancelBooking}
                className="btn-light flex-row gap-10 justify-center color-dark"
                style={{
                  width: "calc(100% - 60px)",
                  background: "#edf0f8",
                  borderColor: "#edf0f8",
                }}
                aria-label="Annuler"
              >
                <DeleteIcon sx={{ color: "#023560", fontSize: 24 }} />
                Annuler
              </button>
            )}

          {!isDriver && !isRideCompleted && isRideToday && (
            <p className="color-dark">
              <small>Vous ne pouvez plus annuler</small>
            </p>
          )}

          {/* Navigation */}
          <button
            onClick={handleNavigateToRecap}
            className="icon-button"
            aria-label="Voir les détails"
          >
            <ArrowForwardIosIcon sx={{ color: "#023560", fontSize: 24 }} />
          </button>
        </div>

        {/* === Statuts === */}
        {isDriver && isRideToday && isRideOngoing && (
          <button
            onClick={() => handleStartStopRide("stop")}
            className="btn-access w-100 btn-action-ride"
            aria-label="Clôturer le trajet"
          >
            Clôturer
          </button>
        )}

        {isRideOngoing && !isDriver && (
          <p
            className="dotted btn-action-ride"
            style={{
              padding: "10px",
              borderColor: "#f7c134",
              textAlign: "center",
              color: "#023560",
            }}
          >
            En cours
          </p>
        )}

        {isRideCompleted && (
          <p
            className="dotted btn-action-ride"
            style={{
              padding: "10px",
              borderColor: "#d7ead6",
              textAlign: "center",
            }}
          >
            Trajet terminé
          </p>
        )}

        {isRideForthcoming && isDriver && isRideToday && (
          <button
            onClick={() => handleStartStopRide("start")}
            className="btn-solid w-100 btn-action-ride"
            aria-label="Démarrer le trajet"
          >
            Démarrer
          </button>
        )}

        {isRideForthcoming && isDriver && !isRideToday && (
          <p
            className="dotted btn-action-ride"
            style={{
              padding: "10px",
              borderColor: "#42ba92",
              textAlign: "center",
              color: "#023560",
            }}
          >
            À venir
          </p>
        )}

        {isRideForthcoming && !isDriver && (
          <p
            className="dotted btn-action-ride"
            style={{
              padding: "10px",
              borderColor: "#42ba92",
              textAlign: "center",
              color: "#023560",
            }}
          >
            À venir
          </p>
        )}

        {!isDriver && isBookingCompleted && (
          <button
            onClick={() => navigate(`/publier-avis/${booking._id}`)}
            className="btn-solid w-100 btn-action-ride"
            style={{ borderColor: "#d7ead6" }}
            aria-label="Laisser un avis sur votre trajet"
          >
            Noter
          </button>
        )}

        {!isDriver && isBookingReviewed && (
          <p
            className="dotted btn-action-ride"
            style={{
              padding: "10px",
              borderColor: "#d7ead6",
              textAlign: "center",
              color: "#fff",
            }}
          >
            Avis envoyé
          </p>
        )}
      </div>
    </article>
  )
}

export default RoadMapCard
