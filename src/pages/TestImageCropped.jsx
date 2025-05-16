import { useState, useCallback, useRef } from "react"
import Cropper from "react-easy-crop"
import Slider from "@mui/material/Slider"
import Button from "@mui/material/Button"

import { generateDownload } from "../utils/cropImage"

const UploadImage = () => {
  const inputRef = useRef()

  const triggerFileSelectPopup = () => inputRef.current.click()

  const [image, setImage] = useState(null)
  const [croppedArea, setCroppedArea] = useState(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)

  const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels)
  }

  const onSelectFile = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader()
      reader.readAsDataURL(event.target.files[0])
      reader.addEventListener("load", () => {
        setImage(reader.result)
      })
    }
  }

  const onDownload = () => {
    generateDownload(image, croppedArea)
  }

  return (
    <div className="container-tocrop">
      <div className="container-cropper">
        {image && (
          <>
            <div className="cropper">
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <div className="slider">
              <Slider
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e, newZoom) => setZoom(newZoom)}
              />
            </div>
          </>
        )}
      </div>

      <div className="container-buttons">
        <input
          type="file"
          accept="image/*"
          ref={inputRef}
          onChange={onSelectFile}
          style={{ display: "none" }}
        />
        <Button
          variant="contained"
          onClick={triggerFileSelectPopup}
          sx={{ mr: 2 }}
        >
          Choose
        </Button>
        <Button variant="contained" color="secondary" onClick={onDownload}>
          Download
        </Button>
      </div>
    </div>
  )
}

export default UploadImage
