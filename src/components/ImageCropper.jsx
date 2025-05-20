import { useRef, useState } from "react"
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
} from "react-image-crop"
import setCanvasPreview from "../utils/setCanvasPreview"

const ASPECT_RATIO = 1
const MIN_DIMENSION = 150

const ImageCropper = ({ closeModal, updateAvatar, setFormData }) => {
  const imgRef = useRef(null)
  const previewCanvasRef = useRef(null)
  const [imgSrc, setImgSrc] = useState("")
  const [crop, setCrop] = useState()
  const [error, setError] = useState("")

  const onSelectFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.addEventListener("load", () => {
      const imageElement = new Image()
      const imageUrl = reader.result?.toString() || ""
      imageElement.src = imageUrl

      imageElement.addEventListener("load", (e) => {
        if (error) setError("")
        const { naturalWidth, naturalHeight } = e.currentTarget
        if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
          setError("Image must be at least 150 x 150 pixels.")
          return setImgSrc("")
        }
      })
      setImgSrc(imageUrl)
    })
    reader.readAsDataURL(file)
  }

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget
    const cropWidthInPercent = (MIN_DIMENSION / width) * 100

    const crop = makeAspectCrop(
      {
        unit: "%",
        width: cropWidthInPercent,
      },
      ASPECT_RATIO,
      width,
      height
    )
    const centeredCrop = centerCrop(crop, width, height)
    setCrop(centeredCrop)
  }

  return (
    <>
      <label htmlFor="uploadphoto" className="fit-content label-hidden">
        <span className="sr-only">Choisir une photo</span>
      </label>
      <input
        type="file"
        accept="image/*"
        name="uploadphoto"
        id="uploadphoto"
        onChange={onSelectFile}
        className="btn-ligth"
      />
      {error && <p className="text-red-400 text-xs">{error}</p>}
      {imgSrc && (
        <div className="dotted flex-column justify-center align-center mt-20">
          <button
            className="btn-solid mb-20"
            onClick={() => {
              // 1. Génère l’aperçu sur le canvas
              setCanvasPreview(
                imgRef.current,
                previewCanvasRef.current,
                convertToPixelCrop(
                  crop,
                  imgRef.current.width,
                  imgRef.current.height
                )
              )

              const canvas = previewCanvasRef.current

              // 2. Récupère l’aperçu immédiat pour affichage
              const dataUrl = canvas.toDataURL()
              // Si tu veux une preview ou une mise à jour rapide dans le state :
              // updateAvatarPreview(dataUrl) — si tu as ce genre de logique

              // 3. Crée le fichier à envoyer côté serveur
              canvas.toBlob(
                (blob) => {
                  if (!blob) {
                    setError("Erreur lors du traitement de l'image.")
                    return
                  }

                  const croppedFile = new File([blob], "avatar.jpg", {
                    type: "image/jpeg",
                  })

                  // 4. Envoie vers le frontend (ou vers ton handler plus haut)
                  updateAvatar(dataUrl)

                  setFormData((prev) => {
                    return {
                      ...prev,
                      photo: croppedFile,
                    }
                  })

                  // 5. Ferme la modale (optionnel ici si tu veux attendre la réponse)
                  closeModal()
                },
                "image/jpeg",
                1
              )
            }}
          >
            Recadrer
          </button>

          <div style={{ border: "1px solid #678eae" }}>
            <ReactCrop
              crop={crop}
              onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
              keepSelection
              aspect={ASPECT_RATIO}
              minWidth={MIN_DIMENSION}
            >
              <img
                ref={imgRef}
                src={imgSrc}
                alt="Upload"
                style={{ maxHeight: "70vh" }}
                onLoad={onImageLoad}
              />
            </ReactCrop>
          </div>
        </div>
      )}
      {crop && (
        <canvas
          ref={previewCanvasRef}
          className="mt-4"
          style={{
            display: "none",
            border: "1px solid black",
            objectFit: "contain",
            width: 150,
            height: 150,
          }}
        />
      )}
    </>
  )
}
export default ImageCropper
