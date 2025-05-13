import { useNavigate, useParams, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "../config/axiosConfig"

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
  const previousLocation = usePreviousLocation()

  const location = useLocation()
  const driverRide = location.state?.driverRide
  const booking = location.state?.booking

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

  console.log("rideDetail >", rideDetail)

  return (
    <>
      <Header />
      <Cover />
      <main>
        <RoadMap rideDetail={rideDetail} />
        <section className="flex-row justify-center gap-15">
          <button onClick={() => navigate(-1)} className="btn-light">
            Retour
          </button>
          {previousLocation?.pathname === "/recherche-trajet" && (
            <button
              onClick={() => navigate(`/reservation/${rideDetail._id}`)}
              className="btn-solid"
            >
              Participer au trajet
            </button>
          )}

          {previousLocation?.pathname === "/vos-trajets" && driverRide && (
            <button
              onClick={() => navigate(`/modifier-trajet/${rideDetail._id}`)}
              className="btn-solid"
            >
              Modifier
            </button>
          )}
          {previousLocation?.pathname === "/vos-trajets" && !driverRide && (
            <button
              onClick={() => navigate(`/modifier-reservation/${booking._id}`)}
              className="btn-solid"
            >
              Annuler la réservation
            </button>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}

export default RideDetails
