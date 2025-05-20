import ImageCropper from "./ImageCropper"

import CloseIcon from "@mui/icons-material/Close"

const UploadImageModal = ({ updateAvatar, closeModal, setFormData }) => {
  return (
    <div
      className="relative z-10"
      aria-labelledby="crop-image-dialog"
      role="dialog"
      aria-modal="true"
    >
      {/* <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-all backdrop-blur-sm bg-primary"></div> */}
      <div className="modal-overlay flex-column justify-center align-center">
        <div className="flex-column w-100 justify-center align-center text-center p-20">
          <div className="flex-row align-center space-between w-100">
            <button
              className="back-btn flex-row align-end"
              onClick={closeModal}
            >
              <CloseIcon sx={{ fontSize: 38 }} />
            </button>
          </div>

          <div className="flex-column fit-content justify-center align-center text-center ">
            <h2>Nouvelle photo de profil</h2>

            <ImageCropper
              updateAvatar={updateAvatar}
              closeModal={closeModal}
              setFormData={setFormData}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
export default UploadImageModal
