import React, { useState, useRef, useEffect, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { Link } from "react-router-dom"

import EnergySavingsLeafOutlinedIcon from "@mui/icons-material/EnergySavingsLeafOutlined"

import { displayDuration } from "../utils/dateTimeHandler"

import StarRating from "../components/StarRating"

const RideCard = ({ ride }) => {
  const [isMobile, setIsMobile] = useState(false)

  const {
    _id,
    remainingSeats,
    car,
    creditsPerPassenger,
    departureAddress,
    departureDate,
    destinationAddress,
    duration,
    driver,
  } = ride

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 500)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

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

  return (
    <Link to={`/trajet/${_id}`}>
      {isMobile ? (
        <article className="ride-card br-10 b-shadow bg-white flex-column">
          <div className="top-ride-card ">
            <div className="info-ride flex-row justify-start">
              <div className="flex-column space-between gap-5">
                <p>
                  {departureDate ? getTimeFromDate(departureDate) : "--:--"}
                </p>
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
              <div className="flex-column space-between">
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
            <div className="credits">
              <p>{creditsPerPassenger ?? "--"}</p>
              <p>crédits</p>
            </div>
          </div>
          <div className="bottom-ride-card flex-row align-center space-between">
            <div
              className={`driver-infos flex-row space-between align-center ${
                isMobile ? "gap-5" : "gap-15"
              } `}
            >
              <div className="profil-icon">
                {driver?.photo ? (
                  <img src={driver.photo} alt="photo profil par défaut" />
                ) : (
                  <div className="default-icon" />
                )}
              </div>
              <div className="flex-column gap-5">
                <p className="text-bold driver-name">
                  {driver?.username || "Conducteur inconnu"}
                </p>
                <StarRating rating={driver.average_rating} />
              </div>
            </div>
            <div className="seats flex-row space-between align-center gap-5">
              <p className="text-big">{remainingSeats ?? "--"}</p>
              <p className="text-tiny">
                place{remainingSeats > 1 && "s"} <br />{" "}
                <span>disponible{remainingSeats > 1 && "s"}</span>
              </p>
            </div>
            <div className="flex-column align-center">
              {car?.energy_id === 3 ||
                (car?.energy === "Électricité" && (
                  <>
                    <EnergySavingsLeafOutlinedIcon
                      sx={{
                        color: "#42ba92",
                        fontSize: isMobile ? "24px" : "38px",
                      }}
                    />
                    <small className="text-center">écolo</small>
                  </>
                ))}
            </div>
          </div>
        </article>
      ) : (
        <article className="ride-card bg-white br-10 flex-column">
          <div className="top-ride-card flex-row">
            <div className="info-ride">
              <div className="departure">
                <p>
                  {departureDate ? getTimeFromDate(departureDate) : "--:--"}
                </p>
                <p>{departureAddress?.city || "Ville inconnue"}</p>
              </div>
              <div className="timing">
                <div className="ride-line">
                  <span className="round"></span>
                  <span className="timeline"></span>
                  <span className="round"></span>
                </div>
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
          <div className="bottom-ride-card flex-row align-center space-between">
            <div className="driver-infos flex-row space-between align-center gap-15">
              <div className="profil-icon">
                {driver?.photo ? (
                  <img src={driver.photo} alt="photo profil par défaut" />
                ) : (
                  <div className="default-icon" />
                )}
              </div>
              <div className="flex-column gap-5">
                <p className="text-bold driver-name">
                  {driver?.username || "Conducteur inconnu"}
                </p>
                <StarRating rating={driver.average_rating} />
              </div>
            </div>
            <div className="seats flex-row space-between align-center gap-5">
              <p className="text-big">{remainingSeats ?? "--"}</p>
              <p className="text-tiny">
                place{remainingSeats > 1 && "s"} <br />{" "}
                <span>disponible{remainingSeats > 1 && "s"}</span>
              </p>
            </div>
            <div className="flex-column align-center">
              {car?.energy_id === 3 ||
                (car?.energy === "Électricité" && (
                  <>
                    <EnergySavingsLeafOutlinedIcon
                      sx={{ color: "#42ba92", fontSize: 38 }}
                    />
                    <small className="text-center">écolo</small>
                  </>
                ))}
            </div>
          </div>
        </article>
      )}
    </Link>
  )
}

export default RideCard
