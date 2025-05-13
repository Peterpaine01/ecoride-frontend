import { useNavigate, useParams, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "../config/axiosConfig"

import { usePreviousLocation } from "../context/PreviousLocationContext"

// Components
import Header from "../components/Header"
import Cover from "../components/Cover"
import Footer from "../components/Footer"
import RoadMap from "../components/RoadMap"
import BookingModal from "../components/BookingModal"

const RideDetails = () => {
  const [rideDetail, setRideDetail] = useState()
  const [isLoading, setIsLoading] = useState(true)

  const params = useParams()
  const id = params.id

  const navigate = useNavigate()
  const previousLocation = usePreviousLocation()

  const location = useLocation()
  const driverRide = location.state?.driverRide

  console.log("driverRide", driverRide)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/ride/${id}`)
        setRideDetail(response.data)

        setIsLoading(false)
      } catch (error) {
        console.log(error.message)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return <p>Loading</p>
  }

  return (
    <>
      <Header />
      <Cover />
      <main>
        <h1>Modifier trajet</h1>
      </main>
      <Footer />
    </>
  )
}

export default RideDetails
