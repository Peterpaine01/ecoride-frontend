import axios from "../config/axiosConfig"
import { AuthContext } from "../context/AuthContext"
import { useEffect, useState, useContext } from "react"
import { useNavigate } from "react-router-dom"

import DeleteIcon from "@mui/icons-material/Delete"
import ModeEditIcon from "@mui/icons-material/ModeEdit"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"

import { displayDuration } from "../utils/dateTimeHandler"

const RoadMapCard = ({ ride, booking, driverRide }) => {
  const {
    _id,
    availableSeats,
    car,
    creditsPerPassenger,
    departureAddress,
    departureDate,
    destinationAddress,
    duration,
    driver,
    rideStatus,
  } = ride

  const { user, authLoading, refreshUser } = useContext(AuthContext)

  const navigate = useNavigate()

  const getTimeFromDate = (date) => {
    const formattedDate = new Date(Date.parse(date))

    const hours = String(formattedDate.getHours()).padStart(2, "0")
    const minutes = String(formattedDate.getMinutes()).padStart(2, "0")

    return `${hours}:${minutes}`
  }

  const setArrivalDate = (date, duration) => {
    const formattedDate = new Date(Date.parse(date))

    if (typeof duration !== "number" || isNaN(duration)) {
      throw new Error("Duration must be a number.")
    }

    const newDate = new Date(formattedDate.getTime() + duration * 60000)
    return newDate
  }

  const arrivalDate = setArrivalDate(departureDate, duration)

  const isToday = (date) => {
    const today = new Date()
    const targetDate = new Date(date)

    return (
      today.getFullYear() === targetDate.getFullYear() &&
      today.getMonth() === targetDate.getMonth() &&
      today.getDate() === targetDate.getDate()
    )
  }

  const handleStartStopRide = async (action) => {
    try {
      if (action === "start") {
        const response = await axios.patch(`/update-ride/${_id}`, {
          rideStatus: "ongoing",
        })

        console.log("Ride started:", response.data)
      }

      if (action === "stop") {
        const response = await axios.patch(`/update-ride/${_id}`, {
          rideStatus: "completed",
        })

        console.log("Ride completed:", response.data)
      }

      refreshUser()
    } catch (error) {
      console.error("Error starting ride:", error)
    }
  }

  const handleDeleteRide = async () => {
    try {
      await axios.patch(`/update-ride/${_id}`, {
        rideStatus: "canceled",
      })
      refreshUser()
    } catch (error) {
      console.error("Erreur lors de l'annulation du trajet :", error)
    }
  }

  const handleCancelBooking = async () => {
    try {
      await axios.patch(`/update-booking/${booking._id}`, {
        bookingStatus: "canceled",
      })
      refreshUser()
    } catch (error) {
      console.error("Erreur lors de l'annulation de la réservation :", error)
    }
  }

  if (authLoading) return null

  return (
    <article
      className={`roadmap-card ${
        rideStatus === "completed" ? "card-disabled" : "bg-white b-shadow"
      } br-10  flex-row space-between`}
    >
      <div className="ride-card flex-column">
        <div className="info-ride flex-row justify-left">
          <div className="hours flex-column space-between">
            <p>{departureDate ? getTimeFromDate(departureDate) : "--:--"}</p>
            <p>
              {departureDate && typeof duration === "number"
                ? getTimeFromDate(arrivalDate)
                : "--:--"}
            </p>
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
      <div className="meta">
        <div className="actions flex-row justify-end align-center w-100">
          {driverRide && rideStatus !== "completed" && (
            <>
              <button onClick={handleDeleteRide} className="icon-button">
                <DeleteIcon sx={{ color: "#023560", fontSize: 24 }} />
              </button>
              <button
                onClick={() => navigate(`/modifier-trajet/${_id}`)}
                className="icon-button"
              >
                <ModeEditIcon sx={{ color: "#023560", fontSize: 24 }} />
              </button>
            </>
          )}

          {!driverRide &&
            rideStatus !== "completed" &&
            !isToday(departureDate) && (
              <button
                onClick={handleCancelBooking}
                className="btn-light flex-row gap-10 justify-center color-dark"
                style={{
                  width: "calc(100% - 60px)",
                  background: "#edf0f8",
                  borderColor: "#edf0f8",
                }}
              >
                <DeleteIcon sx={{ color: "#023560", fontSize: 24 }} /> Annuler
              </button>
            )}

          {!driverRide &&
            rideStatus !== "completed" &&
            isToday(departureDate) && (
              <p className="color-dark">
                <small className="color-dark">
                  Vous ne pouvez plus annuler
                </small>
              </p>
            )}

          <button
            onClick={() => {
              console.log(booking._id)

              navigate(`/recap-trajet/${_id}`, {
                state: { driverRide: driverRide, bookingId: booking._id },
              })
            }}
            className="icon-button"
          >
            <ArrowForwardIosIcon sx={{ color: "#023560", fontSize: 24 }} />
          </button>
        </div>

        {driverRide && isToday(departureDate) && rideStatus === "ongoing" && (
          <button
            onClick={() => handleStartStopRide("stop")}
            className="btn-access w-100"
          >
            Clôturer
          </button>
        )}
        {!driverRide && rideStatus === "ongoing" && (
          <p
            className="dotted"
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

        {driverRide && rideStatus === "completed" && (
          <p
            className="dotted"
            style={{
              padding: "10px",
              borderColor: "#d7ead6",
              textAlign: "center",
            }}
          >
            Trajet terminé
          </p>
        )}

        {rideStatus === "forthcoming" &&
          (driverRide && isToday(departureDate) ? (
            <button
              onClick={() => handleStartStopRide("start")}
              className="btn-solid w-100"
            >
              Démarrer
            </button>
          ) : (
            <p
              className="dotted"
              style={{
                padding: "10px",
                borderColor: "#42ba92",
                textAlign: "center",
                color: "#023560",
              }}
            >
              À venir
            </p>
          ))}

        {!driverRide && booking.bookingStatus === "completed" && (
          <button
            onClick={() => navigate(`/publier-avis/${booking._id}`)}
            className="btn-solid w-100"
            style={{ borderColor: "#d7ead6" }}
          >
            Noter
          </button>
        )}

        {!driverRide && booking.bookingStatus === "reviewed" && (
          <p
            className="dotted"
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
