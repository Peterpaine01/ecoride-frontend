import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "../config/axiosConfig"

import ArrowRightAltOutlinedIcon from "@mui/icons-material/ArrowRightAltOutlined"
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight"

import StarRating from "../components/StarRating"

const OpinionCard = ({ opinionData }) => {
  if (!opinionData) return null

  const [rideDetails, setRideDetails] = useState()
  const [passengerDetails, setPassengerDetails] = useState()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isModerated, setIsModerated] = useState(false)

  const fetchData = async () => {
    if (opinionData) {
      try {
        const response = await axios.get(`/ride/${opinionData.booking.ride}`)

        setRideDetails(response.data)
      } catch (error) {
        console.error("Error fetching reviews:", error)
      }
    }
  }

  const fetchPassengerData = async () => {
    if (opinionData) {
      try {
        const response = await axios.get(
          `/user/${opinionData.booking.bookingDetails.passenger.passengerId}`
        )
        setPassengerDetails(response.data)
      } catch (error) {
        console.error("Error fetching reviews:", error)
      }
    }
  }

  useEffect(() => {
    fetchData()
    fetchPassengerData()
  }, [opinionData])

  console.log("opinion", opinionData)

  const handlePublish = async () => {
    try {
      await axios.patch(`/update-review/${opinionData._id}`, {
        isModerated: true,
        isPublish: true,
      })
      setIsModerated(true)
    } catch (error) {
      console.error("Erreur lors de la publication de l'avis :", error)
    }
  }

  const handleNotPublish = async () => {
    try {
      await axios.patch(`/update-review/${opinionData._id}`, {
        isModerated: true,
      })
      setIsModerated(true)
    } catch (error) {
      console.error("Erreur lors du masquage de l'avis :", error)
    }
  }

  const getDate = (date) => {
    const formattedDate = new Date(Date.parse(date))

    const options = {
      weekday: "short",
      day: "numeric",
      month: "long",
    }

    return formattedDate
      .toLocaleDateString("fr-FR", options)
      .replace(/^./, (c) => c.toUpperCase())
  }

  if (!opinionData && !rideDetails) return <p>Chargement</p>
  if (isModerated) return null

  return (
    <div className="opinion-card btn-arrow">
      <div
        className="top-card flex-row space-between align-center"
        onClick={() => setIsExpanded((prev) => !prev)}
        style={{ cursor: "pointer" }}
      >
        <div className="flex-column justify-center align-start">
          <p className="color-dark text-emphase flex-row align-center gap-5 p-0 mb-5">
            {opinionData?.title}
          </p>
          <StarRating rating={opinionData?.note} />
        </div>
        <KeyboardArrowRightIcon
          style={{
            transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease-in-out",
          }}
        />
      </div>
      <div className={`bottom-card-wrapper ${isExpanded ? "expanded" : ""}`}>
        <div className="bottom-card-inner">
          <p className="color-dark">{opinionData.comment}</p>
          <hr className="mt-20 mb-20" />
          <div className="driver-infos flex-row justify-start align-center gap-15 mt-20 mb-20">
            <div className="profil-icon">
              <img
                src={passengerDetails?.photo}
                alt="photo profil par défaut"
              />
            </div>
            <div className="flex-column gap-5">
              <p className="text-bold capitalize driver-name color-dark">
                {passengerDetails?.username || "Conducteur inconnu"}
              </p>
              <p className="color-dark">
                {getDate(rideDetails?.departureDate) || "Date inconnue"}
              </p>
            </div>
          </div>
          <div className="flex-row gap-15 mt-10">
            <button className="btn btn-solid" onClick={handlePublish}>
              Publier
            </button>
            <button
              className="btn btn-light color-primary"
              onClick={handleNotPublish}
            >
              Masquer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OpinionCard
