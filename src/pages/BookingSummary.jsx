import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import axios from "../config/axiosConfig"
import ArrowRightAltOutlinedIcon from "@mui/icons-material/ArrowRightAltOutlined"
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined"

import Header from "../components/Header"
import Cover from "../components/Cover"
import Footer from "../components/Footer"
import Counter from "../components/Counter"
import BookingModal from "../components/BookingModal"
import LoginModal from "../components/LoginModal"

const BookingSummary = () => {
  const { rideId } = useParams()
  const {
    user,
    fetchUser,
    isAuthenticated,
    refreshUser,
    openLoginModal,
    showLoginModal,
    closeLoginModal,
  } = useContext(AuthContext)
  const [rideDetail, setRideDetail] = useState(null)
  const [seats, setSeats] = useState(1)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isEligible, setIsEligible] = useState(true)

  const navigate = useNavigate()

  console.log("isAuth 1", isAuthenticated)

  useEffect(() => {
    const fetchRideDetail = async () => {
      try {
        console.log("rideId", rideId)

        const response = await axios.get(`/ride/${rideId}`)
        setRideDetail(response.data)

        setIsLoading(false)
      } catch (error) {
        setErrorMessage("Erreur lors du chargement du trajet.")
      }
    }

    fetchRideDetail()
  }, [rideId])

  useEffect(() => {
    if (isAuthenticated) {
      console.log("isAuth 2", isAuthenticated)
      refreshUser()
      const result = checkBookingEligibility()
      setIsEligible(result)
    } else {
      openLoginModal()
    }
  }, [isAuthenticated])

  const checkBookingEligibility = () => {
    if (!user) return

    const availableSeats = rideDetail?.availableSeats || 0
    const userCredits = user?.credits || 0
    const rideCredits = rideDetail?.creditsPerPassenger || 0

    console.log("availableSeats", availableSeats)
    console.log("userCredits", userCredits)

    if (userCredits < rideCredits) {
      setErrorMessage(
        "Vous n'avez pas assez de crédits pour réserver ce trajet."
      )
      return false
    }

    if (availableSeats < 1) {
      setErrorMessage("Il n'y a plus de place disponible pour ce trajet.")
      return false
    }

    setErrorMessage("")
    return true
  }

  const handleBooking = async () => {
    if (!rideDetail || !user) return

    const availableSeats = rideDetail.availableSeats
    const rideCredits = rideDetail.creditsPerPassenger
    const totalCost = rideCredits * seats

    try {
      setIsLoading(true)
      const res = await axios.post(`/create-booking/${rideId}`, {
        bookingData: { seats },
      })

      if (res.status === 201 || res.status === 200) {
        setSuccessMessage("Réservation confirmée !")
        setTimeout(() => navigate("/vos-trajets"), 1500)
      }
    } catch (error) {
      setErrorMessage("Erreur lors de la réservation.")
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (isoDate) => {
    const date = new Date(isoDate)
      .toLocaleDateString("fr-FR", {
        weekday: "short",
        day: "2-digit",
        month: "long",
      })
      .replace(".", "")
      .replace(/^\w/, (c) => c.toUpperCase())

    return date
  }

  const formatTimeToFrench = (isoDate) => {
    if (!isoDate) return ""
    const date = new Date(isoDate)
    const formatted = date.toLocaleString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    })
    const formattedDate = formatted.split(":")

    return formattedDate[0] + "h" + formattedDate[1]
  }

  return (
    <>
      <Header />
      <Cover />
      <main>
        <div className="booking-summary container mt-20">
          <h1 className="mb-20">Votre réservation</h1>
          {rideDetail ? (
            <div className="dotted p-20 mb-20">
              <h3 className="mb-20">Trajet</h3>
              <div className="flex-row sjustify-start gap-30 align-end">
                <div>
                  <p className="text-big mb-10">
                    {rideDetail.departureAddress.city}{" "}
                    <ArrowRightAltOutlinedIcon
                      sx={{ color: "#42ba92", fontSize: 32 }}
                    />{" "}
                    {rideDetail.destinationAddress.city}
                  </p>
                  <p className="text-bold mb-10">
                    {formatDate(rideDetail.departureDate)}
                  </p>
                  <p className="mt-10">
                    {rideDetail.creditsPerPassenger} crédits / place –{" "}
                    {rideDetail.availableSeats && rideDetail.availableSeats}{" "}
                    place
                    {rideDetail.availableSeats &&
                      rideDetail.availableSeats > 1 &&
                      "s"}{" "}
                    disponible
                    {rideDetail.availableSeats &&
                      rideDetail.availableSeats > 1 &&
                      "s"}
                  </p>
                </div>
                <div></div>
                <div className="w-fit flex-column justify-center align-start">
                  <AccessTimeOutlinedIcon
                    sx={{ color: "#f7c134", fontSize: 24 }}
                    className="mb-10"
                  />
                  <p className="mb-10">DÉPART</p>
                  <p
                    className="flex-row justify-center align-center"
                    style={{ fontSize: 32 }}
                  >
                    {formatTimeToFrench(rideDetail.departureDate)}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p>Chargement...</p>
          )}

          {isAuthenticated && rideDetail ? (
            <>
              <div className="booking-detail">
                <div className="mb-20 mt-20">
                  {errorMessage ? (
                    <div className="flex-row justify-center">
                      <p className="error-msg text-center">{errorMessage}</p>
                    </div>
                  ) : (
                    <>
                      <div className="mb-20 flex-row align-center gap-15">
                        <p className="text-emphase">
                          Nombre de places à réserver :
                        </p>
                        <Counter
                          name="seats"
                          value={seats}
                          minValue={1}
                          maxValue={rideDetail.availableSeats}
                          onChange={(e) => setSeats(Number(e.target.value))}
                        />
                      </div>
                      <p className="text-emphase">
                        Total :{" "}
                        <strong className="text-primary">
                          {seats * rideDetail.creditsPerPassenger} crédits
                        </strong>
                      </p>
                    </>
                  )}
                </div>
              </div>

              {successMessage && (
                <p className="success-message">{successMessage}</p>
              )}

              <section className="flex-row justify-center">
                {!isEligible ? (
                  <button
                    onClick={() => navigate(-1)}
                    className="btn btn-light mt-20"
                  >
                    ← Retour
                  </button>
                ) : (
                  <BookingModal rideDetail={rideDetail} />
                )}
              </section>
            </>
          ) : (
            <p>Chargement</p>
          )}
          {showLoginModal && (
            <LoginModal isOpen={showLoginModal} onClose={closeLoginModal} />
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

export default BookingSummary
