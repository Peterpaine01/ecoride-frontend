import axios from "../config/axiosConfig"
import { AuthContext } from "../context/AuthContext"
import { useEffect, useState, useContext } from "react"
import { useNavigate } from "react-router-dom"

import DeleteIcon from "@mui/icons-material/Delete"
import ModeEditIcon from "@mui/icons-material/ModeEdit"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"

import { displayDuration } from "../utils/dateTimeHandler"

const RoadMapCard = ({ ride, driverRide }) => {
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
        <div className="actions">
          {rideStatus !== "completed" && (
            <>
              <button className="icon-button">
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

          <button
            onClick={() =>
              navigate(`/trajet/${_id}`, { state: { driverRide: driverRide } })
            }
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
        {!driverRide && rideStatus === "completed" && (
          <button
            onClick={() => handleStartStopRide("stop")}
            className="btn-solid w-100"
          >
            Noter
          </button>
        )}
      </div>
    </article>
  )
}

export default RoadMapCard
