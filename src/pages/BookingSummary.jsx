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
    authLoading,
  } = useContext(AuthContext)
  const [rideDetail, setRideDetail] = useState(null)
  const [seats, setSeats] = useState(1)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isEligible, setIsEligible] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    setErrorMessage("")
    setSuccessMessage("")
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
    setErrorMessage("")
    setSuccessMessage("")
    if (isAuthenticated) {
      refreshUser()
      if (rideDetail) {
        const result = checkBookingEligibility(seats)
        setIsEligible(result)
      }
    } else {
      openLoginModal()
    }
  }, [isAuthenticated, rideDetail])

  useEffect(() => {
    setErrorMessage("")
    setSuccessMessage("")
    if (rideDetail) {
      const result = checkBookingEligibility(seats)
      setIsEligible(result)
    }
  }, [seats, rideDetail])

  const checkBookingEligibility = (seats) => {
    if (!user) return

    const userCredits = user?.credits || 0
    const rideCredits = rideDetail?.creditsPerPassenger || 0

    if (userCredits < rideCredits * seats) {
      setErrorMessage(
        "Vous n'avez pas assez de crédits pour réserver ce trajet."
      )
      return false
    }

    if (rideDetail.remainingSeats < 1) {
      setErrorMessage("Il n'y a plus de place disponible pour ce trajet.")
      return false
    }

    setErrorMessage("")
    return true
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

  if (authLoading) return null

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
              <div className="flex-row justify-start gap-30 align-end">
                <div className="w-100">
                  <p className="text-big mb-10 flex-row align-center ">
                    {rideDetail.departureAddress.city}{" "}
                    <ArrowRightAltOutlinedIcon
                      sx={{ color: "#42ba92", fontSize: 32 }}
                    />{" "}
                    {rideDetail.destinationAddress.city}
                  </p>
                  <div className="flex-row space-between align-start gap-15 w-100">
                    <div>
                      <p className="text-bold mb-10">
                        {formatDate(rideDetail.departureDate)}
                      </p>
                      <p className="mt-20">
                        {rideDetail.creditsPerPassenger} crédits / passager
                      </p>
                      <p className="mt-10">
                        {rideDetail.remainingSeats > 0
                          ? `${rideDetail.remainingSeats} place${
                              rideDetail.remainingSeats > 1 && "s"
                            } disponible${rideDetail.remainingSeats > 1 && "s"}`
                          : "Complet"}
                      </p>
                    </div>
                    <div className="w-fit flex-column justify-center align-start">
                      <AccessTimeOutlinedIcon
                        sx={{ color: "#f7c134", fontSize: 24 }}
                        className="mb-10"
                      />
                      <p className="mb-5">DÉPART</p>
                      <p
                        className="flex-row justify-center align-center"
                        style={{ fontSize: 32 }}
                      >
                        {formatTimeToFrench(rideDetail.departureDate)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-column justify-start align-center w-100 mt-40">
              <div class="loader"></div>
            </div>
          )}

          {isAuthenticated && rideDetail ? (
            <>
              <div className="booking-detail mb-20">
                <div className="">
                  <div className="mb-20 flex-row align-center gap-15">
                    <p className="text-emphase">
                      Nombre de places à réserver :
                    </p>
                    <Counter
                      name="seats"
                      value={seats}
                      minValue={1}
                      maxValue={rideDetail.remainingSeats}
                      onChange={(e) => setSeats(Number(e.target.value))}
                    />
                  </div>

                  <p className="text-emphase">
                    Total :{" "}
                    <strong className="text-primary">
                      {seats * rideDetail.creditsPerPassenger} crédits
                    </strong>
                  </p>
                </div>
              </div>
              {errorMessage && (
                <div className="flex-row justify-center mt-20">
                  <p className="error-msg text-emphase text-center">
                    {errorMessage}
                  </p>
                </div>
              )}
              {successMessage && (
                <p className="success-message">{successMessage}</p>
              )}

              <div className="flex-row justify-center">
                {!isEligible ? (
                  <button
                    onClick={() => navigate(-1)}
                    className="btn btn-light mt-20"
                  >
                    ← Retour
                  </button>
                ) : (
                  <BookingModal rideDetail={rideDetail} seats={seats} />
                )}
              </div>
            </>
          ) : (
            <div className="flex-column justify-start align-center w-100 mt-40">
              <div class="loader"></div>
            </div>
          )}
          {!isAuthenticated && showLoginModal && (
            <LoginModal isOpen={showLoginModal} onClose={closeLoginModal} />
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

export default BookingSummary
