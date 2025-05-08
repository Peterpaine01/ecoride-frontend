import DeleteIcon from "@mui/icons-material/Delete"
import ModeEditIcon from "@mui/icons-material/ModeEdit"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"

import { displayDuration } from "../utils/dateTimeHandler"

const RoadMapCard = ({ ride, isDriver }) => {
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

  return (
    <article className="roadmap-card bg-white br-10 b-shadow flex-row space-between">
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
          <button className="icon-button">
            <DeleteIcon sx={{ color: "#023560", fontSize: 24 }} />
          </button>
          <button className="icon-button">
            <ModeEditIcon sx={{ color: "#023560", fontSize: 24 }} />
          </button>
          <button className="icon-button">
            <ArrowForwardIosIcon sx={{ color: "#023560", fontSize: 24 }} />
          </button>
        </div>
        {isDriver && isToday(departureDate) && (
          <button className="btn-solid w-100">Démarrer</button>
        )}
      </div>
    </article>
  )
}

export default RoadMapCard
