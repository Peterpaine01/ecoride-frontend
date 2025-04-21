import React, { useState, useRef, useEffect, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { Link } from "react-router-dom"
import {
  User,
  ChevronRight,
  XCircle,
  Compass,
  UserPlus,
  PlusCircle,
  ChevronLeft,
} from "react-feather"

import { displayDuration } from "../utils/dateTimeHandler"

const RideCard = ({ ride }) => {
  const { user, login, logout, isAuthenticated } = useContext(AuthContext)
  const [isOpen, setIsOpen] = useState(false)

  const {
    availableSeats,
    car,
    creditsPerPassenger,
    departureAddress,
    departureDate,
    destinationAddress,
    duration,
    driver,
  } = ride

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

  const setFormattedDuration = (duration) => {
    if (typeof duration !== "number" || isNaN(duration)) {
      throw new Error("Duration must be a number.")
    }

    const hours = Math.floor(duration / 60)
    const mins = duration % 60

    return `${String(hours).padStart(2)}h${String(mins).padStart(2, "0")}`
  }

  const arrivalDate = setArrivalDate(departureDate, duration)

  return (
    <Link>
      <article className="ride-card flex-column">
        <div className="top-ride-card flex-row">
          <div className="info-ride">
            <div className="departure">
              <p>{departureDate ? getTimeFromDate(departureDate) : "--:--"}</p>
              <p>{departureAddress?.city || "Ville inconnue"}</p>
            </div>
            <div className="timing">
              <div className="timeline"></div>
              <p>
                {typeof duration === "number"
                  ? displayDuration(duration)
                  : "Durée inconnue"}
              </p>
            </div>
            <div className="arrival">
              <p>
                {departureDate && typeof duration === "number"
                  ? getTimeFromDate(arrivalDate)
                  : "--:--"}
              </p>
              <p>{destinationAddress?.city || "Ville inconnue"}</p>
            </div>
          </div>
          <div className="credits">
            <p>{creditsPerPassenger ?? "--"}</p>
            <p>crédits</p>
          </div>
        </div>
        <div className="bottom-ride-card flex-row">
          <div className="driver-infos flex-column">
            <div className="profil-icon">
              {driver?.photo ? (
                <img src={driver.photo} alt="photo profil par défaut" />
              ) : (
                <div className="default-icon" />
              )}
            </div>
            <p>{driver?.username || "Conducteur inconnu"}</p>
            <p>{driver?.average_rating ?? "–"}</p>
          </div>
          <div className="ride-criteria">
            <div className="seats">
              <p>{availableSeats ?? "--"}</p>
              <p>
                places <span>disponibles</span>
              </p>
            </div>
            {car?.energy_id === 3 && <p>voyage ecolo</p>}
          </div>
        </div>
      </article>
    </Link>
  )
}

export default RideCard
