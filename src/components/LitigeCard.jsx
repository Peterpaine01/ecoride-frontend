import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "../config/axiosConfig"

import ArrowRightAltOutlinedIcon from "@mui/icons-material/ArrowRightAltOutlined"
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight"

const LitigeCard = ({ litigeData }) => {
  if (!litigeData) return null

  const [rideDetails, setRideDetails] = useState([])

  const fetchData = async () => {
    if (litigeData) {
      try {
        const response = await axios.get(`/ride/${litigeData.booking.ride}`)
        // console.log("response.data", response.data)

        setRideDetails(response.data)
      } catch (error) {
        console.error("Error fetching reviews:", error)
      }
    }
  }

  useEffect(() => {
    fetchData()
  }, [litigeData])

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

  if (!litigeData && !rideDetails)
    return (
      <div className="flex-column justify-start align-center w-100 mt-40">
        <div class="loader"></div>
      </div>
    )

  return (
    <Link
      to={"/staff"}
      className="litige-card btn-arrow flex-row space-between align-center bg-white"
    >
      <div className="flex-column justify-center align-start">
        <p className="color-dark text-emphase flex-row align-center gap-5 p-0">
          {rideDetails?.departureAddress?.city}{" "}
          <ArrowRightAltOutlinedIcon sx={{ color: "#023560", fontSize: 30 }} />{" "}
          {rideDetails?.destinationAddress?.city}
        </p>
        <p className="p-0 color-dark">{getDate(rideDetails?.departureDate)}</p>
      </div>
      <KeyboardArrowRightIcon />
    </Link>
  )
}

export default LitigeCard
