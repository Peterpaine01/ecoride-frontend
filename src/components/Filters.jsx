import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import React, { useState } from "react"

// Components
import Counter from "../components/Counter"

// Icones
import EnergySavingsLeafOutlinedIcon from "@mui/icons-material/EnergySavingsLeafOutlined"
import TransgenderOutlinedIcon from "@mui/icons-material/TransgenderOutlined"
import StarOutlineOutlinedIcon from "@mui/icons-material/StarOutlineOutlined"
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined"
import SmokingRoomsOutlinedIcon from "@mui/icons-material/SmokingRoomsOutlined"
import TollOutlinedIcon from "@mui/icons-material/TollOutlined"
import PetsOutlinedIcon from "@mui/icons-material/PetsOutlined"

const Filters = ({ searchQuery }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [resetKey, setResetKey] = useState(0)

  const [maxPrice, setMaxPrice] = useState(Number(searchQuery.maxPrice) || 2)
  const [minRating, setMinRating] = useState(Number(searchQuery.minRating) || 0)
  const [maxDuration, setMaxDuration] = useState(
    searchQuery.maxDuration ? convertMinutesToTime(searchQuery.maxDuration) : ""
  )

  const handleSubmit = (event) => {
    event.preventDefault()

    const formData = new FormData(event.target)
    const newParams = {}

    formData.forEach((value, key) => {
      if (value && value !== "--:--" && value !== "Indifférent") {
        if (key === "maxDuration") {
          const [hours, minutes] = value.split(":").map(Number)
          newParams[key] = hours * 60 + minutes
        } else {
          newParams[key] = value
        }
      }
    })

    newParams.isElectric = formData.get("isElectric") === "on"
    newParams.acceptSmoking = formData.get("acceptSmoking") === "on"
    newParams.acceptAnimals = formData.get("acceptAnimals") === "on"

    newParams.maxPrice = maxPrice
    newParams.minRating = minRating

    const updatedParams = new URLSearchParams(searchParams)

    Object.entries(newParams).forEach(([key, value]) => {
      updatedParams.set(key, value)
    })

    navigate(`?${updatedParams.toString()}`)
  }

  const convertMinutesToTime = (minutes) => {
    const hrs = String(Math.floor(minutes / 60)).padStart(2, "0")
    const mins = String(minutes % 60).padStart(2, "0")
    return `${hrs}:${mins}`
  }

  return (
    <aside className="filters one-third-column">
      <div className="filter-header flex-row">
        <h2>Filtrer</h2>
        <button
          type="button"
          className="reset btn-light btn-link"
          onClick={() => {
            setMaxPrice(2)
            setMinRating(0)

            setResetKey((prev) => prev + 1)

            const updatedParams = new URLSearchParams(searchParams)
            const filterKeys = [
              "maxPrice",
              "minRating",
              "maxDuration",
              "gender",
              "isElectric",
              "acceptSmoking",
              "acceptAnimals",
            ]
            filterKeys.forEach((key) => updatedParams.delete(key))

            navigate(`?${updatedParams.toString()}`)
          }}
        >
          Tout effacer
        </button>
      </div>
      <form key={resetKey} onSubmit={handleSubmit}>
        <div className="input-group">
          <h3>Votre voyage</h3>
          <div className="criteria flex-row space-between align-center gap-5 mb-20">
            <div className="flex-row space-between align-center gap-5">
              <TollOutlinedIcon sx={{ color: "#f7c134", fontSize: 28 }} />
              <div className="flex-column ">
                <label>Prix maximum</label>
                <small>(en crédits)</small>
              </div>
            </div>

            <Counter
              name="maxPrice"
              value={maxPrice}
              minValue={2}
              maxValue={1000}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
          </div>

          <div className="criteria  flex-row space-between align-center gap-5 mb-20">
            <div className="flex-row space-between align-center gap-5">
              <div className="flex-row space-between align-center gap-5">
                <AccessTimeOutlinedIcon
                  sx={{ color: "#f7c134", fontSize: 28 }}
                />
                <label>Durée maximum</label>
              </div>
            </div>

            <input
              type="time"
              name="maxDuration"
              value={maxDuration}
              onChange={(e) => setMaxDuration(e.target.value)}
              step="60"
            />
          </div>
        </div>

        <div className="input-group">
          <h3>Votre conducteur</h3>
          <div className="criteria  flex-row space-between align-center gap-5 mb-20">
            <div className="flex-row space-between align-center gap-5">
              <StarOutlineOutlinedIcon
                sx={{ color: "#f7c134", fontSize: 28 }}
              />
              <label>Note minimal</label>
            </div>
            <Counter
              name="minRating"
              value={minRating}
              minValue={0}
              maxValue={5}
              onChange={(e) => setMinRating(Number(e.target.value))}
            />
          </div>

          <div className="criteria  flex-row space-between align-center gap-5 mb-20">
            <div className="flex-row space-between align-center gap-5">
              <TransgenderOutlinedIcon
                sx={{ color: "#f7c134", fontSize: 28 }}
              />
              <label>Genre</label>
            </div>
            <select class="custom-select-minimal" name="gender">
              <option>Indifférent</option>
              <option value="male">Homme</option>
              <option value="female">Femme</option>
            </select>
          </div>
        </div>

        <div className="input-group">
          <h3>Vos préférences</h3>

          <div className="criteria toggle  flex-row space-between align-center gap-5 mb-20">
            <div className="flex-row space-between align-center gap-5">
              <EnergySavingsLeafOutlinedIcon
                sx={{ color: "#f7c134", fontSize: 28 }}
              />
              <div className="flex-column ">
                <label>Voyage écologique</label>
                <small>(Voiture électrique)</small>
              </div>
            </div>

            <label class="switch">
              <input type="checkbox" name="isElectric" />
              <span class="slider"></span>
            </label>
          </div>

          <div className="criteria toggle  flex-row space-between align-center gap-5 mb-20">
            <div className="flex-row space-between align-center gap-5">
              <SmokingRoomsOutlinedIcon
                sx={{ color: "#f7c134", fontSize: 28 }}
              />
              <label>Véhicule fumeur</label>
            </div>
            <label class="switch">
              <input type="checkbox" name="acceptSmoking" />
              <span class="slider"></span>
            </label>
          </div>

          <div className="criteria toggle  flex-row space-between align-center gap-5 mb-20">
            <div className="flex-row space-between align-center gap-5">
              <PetsOutlinedIcon sx={{ color: "#f7c134", fontSize: 28 }} />
              <label>Animaux acceptés</label>
            </div>
            <label class="switch">
              <input type="checkbox" name="acceptAnimals" />
              <span class="slider"></span>
            </label>
          </div>
        </div>
        <div className="flex-row justify-center align-center gap-5 ">
          <button type="submit" className="btn-solid mt-20">
            Voir les trajets
          </button>
        </div>
      </form>
    </aside>
  )
}

export default Filters
