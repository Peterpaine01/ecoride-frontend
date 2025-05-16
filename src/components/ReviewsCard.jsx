import { useState, useEffect } from "react"
import axios from "../config/axiosConfig"

import StarRating from "../components/StarRating"

const ReviewsCard = ({ reviewData }) => {
  if (!reviewData) return null

  const { title, note, comment, passenger, booking } = reviewData
  const [departureDate, setDepartureDate] = useState(null)

  useEffect(() => {
    const fetchRideDate = async () => {
      if (!booking?.ride) return

      try {
        const response = await axios.get(`/ride/${booking.ride}`)
        setDepartureDate(response.data.departureDate)
      } catch (error) {
        console.error("Erreur récupération date ride:", error)
        setDepartureDate(null)
      }
    }

    fetchRideDate()
  }, [booking?.rideId])

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

  return (
    <div className="review-card">
      <div className="flex-column justify-center align-start">
        <h4 className="color-primary mb-10">{title}</h4>
        <StarRating rating={note} />
      </div>

      <p className="mb-10">{comment}</p>
      <hr />
      <div className="driver-infos flex-row justify-start align-center gap-15 mt-20">
        <div className="profil-icon">
          <img src={passenger?.photo} alt="photo profil par défaut" />
        </div>
        <div className="flex-column gap-5">
          <p className="text-bold capitalize driver-name">
            {passenger?.username || "Conducteur inconnu"}
          </p>
          <p>{getDate(departureDate)}</p>
        </div>
      </div>
    </div>
  )
}

export default ReviewsCard
