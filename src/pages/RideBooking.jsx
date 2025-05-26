import { useNavigate, useParams, useLocation } from "react-router-dom"
import { useEffect, useState, useContext } from "react"
import axios from "../config/axiosConfig"
import { AuthContext } from "../context/AuthContext"

import { usePreviousLocation } from "../context/PreviousLocationContext"

// Components
import Header from "../components/Header"
import Cover from "../components/Cover"
import Footer from "../components/Footer"
import RoadMap from "../components/RoadMap"

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

  return (
    <>
      <Header />
      <Cover />
      <main>
        <RoadMap />
        <div className="container flex-row justify-center gap-15">
          <button onClick={() => navigate(-1)} className="btn-light">
            Retour
          </button>
          <button
            onClick={() => navigate(`/reservation/${rideDetail._id}`)}
            className="btn-solid"
          >
            Réserver
          </button>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default RideDetails
