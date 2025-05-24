import { useContext, useEffect } from "react"
import { AuthContext } from "../context/AuthContext"
import Modal from "react-modal"
import LoginForm from "./LoginForm"

Modal.setAppElement("#root")

const LoginModal = ({ isOpen, onClose }) => {
  const { isAuthenticated, fetchUser } = useContext(AuthContext)

  useEffect(() => {
    if (isAuthenticated) {
      onClose()
      fetchUser()
    }
  }, [isAuthenticated])

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Connexion requise"
      className="modal"
      overlayClassName="overlay"
    >
      <button
        onClick={onClose}
        className="close-btn btn-round color-dark"
        aria-label="Fermer"
      >
        ✕
      </button>

      <div className="flex-column justify-center align-center flex-1 pb-20 gap-15">
        <h2 className="mb-20 mt-20">Connectez-vous pour réserver</h2>
        <LoginForm />
      </div>
    </Modal>
  )
}

export default LoginModal
