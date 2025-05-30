import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import Modal from "react-modal"
import LoginForm from "./LoginForm"
import axios from "../config/axiosConfig"

Modal.setAppElement("#root")

import ArrowRightAltOutlinedIcon from "@mui/icons-material/ArrowRightAltOutlined"

const BookingModal = ({ rideDetail, seats }) => {
  const { user, isAuthenticated, refreshUser } = useContext(AuthContext)
  const [isOpen, setIsOpen] = useState(false)
  const [showBooking, setShowBooking] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const navigate = useNavigate()

  const openModal = () => {
    setIsOpen(true)
    setShowBooking(isAuthenticated)
    setErrorMessage("")
    setSuccessMessage("")
  }

  const closeModal = () => {
    setIsOpen(false)
    setShowBooking(false)
    setErrorMessage("")
  }

  const handleBooking = async () => {
    try {
      setIsLoading(true)
      const response = await axios.post(`/create-booking/${rideDetail._id}`, {
        bookingData: { seats },
      })
      setSuccessMessage("Réservation confirmée ! ")
      if (response.status === 201 || response.status === 200) {
        console.log("La réservation a été validée !")
      }
    } catch (error) {
      console.error("Erreur lors de la réservation", error)
      setErrorMessage(
        error.response?.data?.message ||
          "Une erreur est survenue lors de la réservation."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button onClick={openModal} className="btn-solid">
        Réserver ce trajet
      </button>

      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Réservation"
        className="modal"
        overlayClassName="overlay"
      >
        <button
          onClick={closeModal}
          className="close-btn btn-round color-dark"
          aria-label="Fermer"
          style={{ color: "#fff" }}
        >
          ✕
        </button>

        {showBooking && (
          <div className="flex-column space-between align-center flex-1">
            <div className="flex-column align-center flex-1 w-100">
              <h2 className="mb-20 mt-20">Confirmer la réservation</h2>
              <div className="flex-column align-center">
                <h3 className="color-white">Trajet réservé</h3>
                <p className="text-big flex-row align-center">
                  {rideDetail?.departureAddress.city}{" "}
                  <ArrowRightAltOutlinedIcon
                    sx={{ color: "#42ba92", fontSize: 38 }}
                  />{" "}
                  {rideDetail?.destinationAddress.city}
                </p>
                {errorMessage ? (
                  <>
                    <div className="dotted mt-20 mb-20">
                      <p className="error-msg text-emphase mt-20">
                        {errorMessage}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="mt-20">
                      Vous vous apprêtez à réserver un trajet.
                    </p>
                    <div className="dotted mt-20 mb-20">
                      <p>
                        <strong
                          className="text-emphase"
                          style={{ color: "#fff" }}
                        >
                          {rideDetail?.creditsPerPassenger * seats} crédits
                        </strong>{" "}
                        vont être débités de votre compte.
                      </p>
                    </div>
                    <p className="mt-20 text-emphase">
                      Voulez-vous continuer ?
                    </p>
                  </>
                )}

                {successMessage && (
                  <p className="success-message mt-10">{successMessage}</p>
                )}
              </div>
            </div>

            {!successMessage && !errorMessage ? (
              <button
                onClick={handleBooking}
                className="btn-solid mt-20 align-self-center"
                disabled={isLoading}
              >
                {isLoading ? "Réservation..." : "Confirmer"}
              </button>
            ) : errorMessage ? (
              <button
                onClick={closeModal}
                className="btn-light mt-20 align-self-center color-primary"
                disabled={isLoading}
              >
                Fermer
              </button>
            ) : (
              <button
                onClick={navigate("/vos-trajets")}
                className="btn-light mt-20 align-self-center color-primary"
                disabled={isLoading}
              >
                Voir ma réservation
              </button>
            )}
          </div>
        )}
      </Modal>
    </>
  )
}

export default BookingModal
