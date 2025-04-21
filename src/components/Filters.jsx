import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import React, { useState } from "react"

// Components
import Counter from "../components/Counter"

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
          <div className="criteria">
            <label>Prix max (en crédits)</label>
            <Counter
              name="maxPrice"
              value={maxPrice}
              minValue={2}
              maxValue={1000}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
          </div>

          <div className="criteria flex-row">
            <label>Durée max</label>
            <input
              type="time"
              name="maxDuration"
              value={maxDuration}
              onChange={(e) => setMaxDuration(e.target.value)}
              step="60" // pour éviter les secondes
            />
          </div>
        </div>

        <div className="input-group">
          <h3>Votre conducteur</h3>
          <div className="criteria flex-row">
            <label>Note minimal</label>
            <Counter
              name="minRating"
              value={minRating}
              minValue={0}
              maxValue={5}
              onChange={(e) => setMinRating(Number(e.target.value))}
            />
          </div>

          <div className="criteria flex-row">
            <label>Genre</label>
            <select name="gender">
              <option>Indifférent</option>
              <option value="male">Homme</option>
              <option value="female">Femme</option>
            </select>
          </div>
        </div>

        <div className="input-group">
          <h3>Vos préférences</h3>

          <div className="criteria toggle flex-row">
            <label>
              Voyage écologique <small>Voiture électrique</small>
            </label>
            <input type="checkbox" name="isElectric" />
          </div>

          <div className="criteria toggle flex-row">
            <label>Véhicule non fumeur</label>
            <input type="checkbox" name="acceptSmoking" />
          </div>

          <div className="criteria toggle flex-row">
            <label>Pas d’animaux</label>
            <input type="checkbox" name="acceptAnimals" />
          </div>
        </div>

        <button type="submit" className="btn-solid">
          Voir les trajets
        </button>
      </form>
    </aside>
  )
}

export default Filters
