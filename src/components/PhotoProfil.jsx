import { useEffect, useRef, useState } from "react"
import ModeEditIcon from "@mui/icons-material/ModeEdit"
import UploadImageModal from "./UploadImageModal"

const PhotoProfil = ({ photo, setFormData }) => {
  const avatarUrl = useRef()
  const [modalOpen, setModalOpen] = useState(false)

  const updateAvatar = (imgSrc) => {
    avatarUrl.current = imgSrc
  }

  useEffect(() => {
    if (photo) {
      updateAvatar(photo)
    }
  }, [photo])

  return (
    <div className="flex-column align-center mb-40">
      {avatarUrl.current && (
        <div className="relative avatar-to-upload">
          <img src={avatarUrl.current} alt="Avatar" className="" />
          <button
            className="icon-button absolute rounded"
            title="Changer photo"
            onClick={() => setModalOpen(true)}
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
