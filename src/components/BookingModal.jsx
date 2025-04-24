import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import Modal from "react-modal"
import LoginForm from "./LoginForm"

Modal.setAppElement("#root")

const BookingModal = ({ rideDetail }) => {
  const { isAuthenticated } = useContext(AuthContext)
  const [isOpen, setIsOpen] = useState(false)
  const [showBooking, setShowBooking] = useState(false)

  const openModal = () => {
    setIsOpen(true)
    setShowBooking(isAuthenticated)
  }

  const closeModal = () => {
    setIsOpen(false)
    setShowBooking(false)
  }

  const handleBooking = () => {
    console.log("Réservation confirmée pour :", rideDetail)
    closeModal()
  }

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      setShowBooking(true)
    }
  }, [isAuthenticated, isOpen])

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
        <button onClick={closeModal} className="close-btn">
          ✕
        </button>

        {showBooking ? (
          <div className="flex flex-col items-center gap-4 p-4">
            <h2 className="text-xl font-semibold">Confirmer la réservation</h2>
            <p>
              Trajet de {rideDetail?.departure} à {rideDetail?.arrival}
            </p>
            <button onClick={handleBooking} className="btn btn-solid mt-20">
              Confirmer
            </button>
          </div>
        ) : (
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-2">
              Connecte-toi pour réserver
            </h2>
            <LoginForm />
          </div>
        )}
      </Modal>
    </>
  )
}

export default BookingModal
