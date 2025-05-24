import { Link } from "react-router-dom"

import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight"
import DirectionsCarFilledOutlinedIcon from "@mui/icons-material/DirectionsCarFilledOutlined"

const CarCard = ({ car }) => {
  if (!car) return null

  return (
    <Link
      to={`/vehicule/${car.id}`}
      key={car.id}
      className="vehicle flex-row mb-10 align-center space-between gap-15 w-100"
    >
      <div className="flex-row align-center justify-start gap-15">
        <p className="flex-row align-center justify-start gap-5">
          <DirectionsCarFilledOutlinedIcon
            sx={{ color: "#002340", fontSize: 24 }}
          />
        </p>
        <div className="flex-column justify-left">
          <p className="flex-row align-center justify-start">
            {car
              ? `${car.model} - ${car.registration_number}`
              : "Non renseigné"}
          </p>
          <p className="text-tiny">{car && car.color}</p>
        </div>
      </div>

      <KeyboardArrowRightIcon sx={{ color: "#002340", fontSize: 24 }} />
    </Link>
  )
}

export default CarCard
