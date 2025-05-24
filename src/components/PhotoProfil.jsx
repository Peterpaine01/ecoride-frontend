import { useContext, useEffect, useRef, useState } from "react"
import ModeEditIcon from "@mui/icons-material/ModeEdit"
import UploadImageModal from "./UploadImageModal"
import { AuthContext } from "../context/AuthContext"

const PhotoProfil = ({ setFormData }) => {
  const avatarUrl = useRef()
  const [modalOpen, setModalOpen] = useState(false)
  const { user } = useContext(AuthContext)

  const [photo, setPhoto] = useState("")

  const updateAvatar = (imgSrc) => {
    avatarUrl.current = imgSrc
  }

  useEffect(() => {
    if (user) {
      updateAvatar(user.photo)
    }
  }, [user])

  console.log("avatarUrl.current", avatarUrl.current)

  return (
    <div className="flex-column align-center mb-40">
      {avatarUrl.current && (
        <div className="relative avatar-to-upload">
          <img src={avatarUrl.current} alt="Avatar" className="" />
          <button
            className="icon-button absolute rounded"
            title="Changer photo"
            onClick={() => setModalOpen(true)}
            aria-label="Modifier la photo"
          >
            <ModeEditIcon sx={{ color: "#023560", fontSize: 24 }} />
          </button>
        </div>
      )}

      {modalOpen && (
        <UploadImageModal
          updateAvatar={updateAvatar}
          closeModal={() => setModalOpen(false)}
          setFormData={setFormData}
        />
      )}
    </div>
  )
}

export default PhotoProfil
