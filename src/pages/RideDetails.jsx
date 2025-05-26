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
import StarRating from "../components/StarRating"

const RideDetails = () => {
  const [rideDetail, setRideDetail] = useState()
  const [bookingsList, setBookingsList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDriverRide, setIsDriverRide] = useState(false)

  const { user, authLoading, refreshUser } = useContext(AuthContext)

  const params = useParams()
  const id = params.id

  const navigate = useNavigate()

  const location = useLocation()
  const bookingId = location.state?.bookingId

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

    const fetchBookings = async () => {
      try {
        const response = await axios.get(`/ride/${id}/bookings`)
        setBookingsList(response.data)

        setIsLoading(false)
      } catch (error) {
        console.log(error.message)
      }
    }
    fetchData()
    fetchBookings()
  }, [])

  useEffect(() => {
    if (rideDetail && user) {
      setIsDriverRide(user.account_id === rideDetail.driver.account_id)
    }
  }, [rideDetail, user])

  const handleCancelBooking = async () => {
    if (!bookingId) {
      console.error("Impossible d’annuler : bookingId est undefined")
      return
    }

    try {
      await axios.patch(`/update-booking/${bookingId}`, {
        bookingStatus: "canceled",
      })
      refreshUser()
      navigate("/vos-trajets")
    } catch (error) {
      console.error("Erreur lors de l'annulation de la réservation :", error)
    }
  }

  if (isLoading) {
    return <p>Loading</p>
  }

  return (
    <>
      <Header />
      <Cover />
      <main>
        {isLoading ? (
          <p>Loading</p>
        ) : (
          <>
            <RoadMap />
            {isDriverRide && (
              <div className="container">
                <section>
                  <div className="dotted flex-column align-start w-100">
                    <h3 className="color-white mb-20">Passagers</h3>
                    {bookingsList.length > 0 ? (
                      <div className="flex-row justify-start align-center gap-15">
                        {bookingsList.map((booking) => {
                          console.log(booking)

                          return (
                            <div key={booking._id}>
                              <div className="driver-infos flex-row space-between align-center gap-15">
                                <div className="profil-icon">
                                  {booking.bookingDetails.passenger?.photo ? (
                                    <img
                                      src={
                                        booking.bookingDetails.passenger?.photo
                                      }
                                      alt="photo du passager"
                                    />
                                  ) : (
                                    <div className="default-icon" />
                                  )}
                                </div>
                                <div className="flex-column gap-5">
                                  <p className="text-bold">
                                    {booking.bookingDetails.passenger
                                      ?.username || "Conducteur inconnu"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="dotted">
                        <p>Pas encore de réservation.</p>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            )}

            <div className="container flex-row justify-center gap-15">
              {/* <button onClick={() => navigate(-1)} className="btn-light">
                Retour
              </button> */}

              {isDriverRide && (
                <button
                  onClick={() => navigate(`/modifier-trajet/${rideDetail._id}`)}
                  className="btn-solid"
                >
                  Modifier
                </button>
              )}
              {!isDriverRide && (
                <button
                  onClick={() => {
                    handleCancelBooking()
                  }}
                  className="btn-solid"
                >
                  Annuler la réservation
                </button>
              )}
            </div>
          </>
        )}
      </main>
      <Footer />
    </>
  )
}

export default RideDetails
