import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "../config/axiosConfig"

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

  console.log("rideDetail >", rideDetail)

  return (
    <>
      <Header />
      <Cover />
      <main>
        <RoadMap rideDetail={rideDetail} />
        <section className="flex-row justify-center">
          <button
            onClick={() => navigate(`/reservation/${rideDetail._id}`)}
            className="btn-solid"
          >
            Réserver ce trajet
          </button>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default RideDetails
