import {
  Link,
  useLocation,
  useSearchParams,
  useNavigate,
} from "react-router-dom"
import React, { useEffect, useState, useMemo, useRef } from "react"
import axios from "../config/axiosConfig"

// Components
import Header from "../components/Header"
import Cover from "../components/Cover"
import Hero from "../components/Hero"
import Search from "../components/Search"
import Footer from "../components/Footer"
import RideCard from "../components/RideCard"
import { Key } from "react-feather"

const RidesList = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [ridesList, setRidesList] = useState()

  const navigate = useNavigate()

  // useMemo = update searchQuery only if searchParams change
  const searchQuery = useMemo(
    () => ({
      departureCity: searchParams.get("departureCity") || "",
      destinationCity: searchParams.get("destinationCity") || "",
      departureDate: searchParams.get("departureDate") || "",
      availableSeats: parseInt(searchParams.get("availableSeats"), 10) || 1,
    }),
    [searchParams]
  )

  console.log("searchParams", searchParams)

  useEffect(() => {
    const fetchData = async () => {
      if (searchQuery.departureCity && searchQuery.destinationCity) {
        try {
          const response = await axios.get("/search-rides", {
            params: searchQuery,
          })
          console.log("Rides data:", response.data)

          setRidesList(response.data.rides || [])
        } catch (error) {
          console.error("Error fetching rides:", error)
        }
      }
    }

    fetchData()
  }, [searchQuery])
  console.log("ridesList", ridesList)

  const handleSubmit = (event) => {
    event.preventDefault()

    const formData = new FormData(event.target)
    const newParams = {}

    formData.forEach((value, key) => {
      if (value && value !== "--:--" && value !== "Indifférent") {
        newParams[key] = value
      }
    })

    newParams.isElectric = formData.get("isElectric") === "on"
    newParams.acceptSmoking = formData.get("acceptSmoking") === "on"
    newParams.acceptAnimals = formData.get("acceptAnimals") === "on"

    const updatedParams = new URLSearchParams(searchParams)

    Object.entries(newParams).forEach(([key, value]) => {
      updatedParams.set(key, value)
    })

    navigate(`?${updatedParams.toString()}`)
  }

  const getDate = (date) => {
    const formattedDate = new Date(Date.parse(date))

    const options = {
      weekday: "short",
      day: "numeric",
      month: "long",
      year: "numeric",
    }

    return formattedDate
      .toLocaleDateString("fr-FR", options)
      .replace(/^./, (c) => c.toUpperCase())
  }
  console.log(searchQuery)

  // COUNTER

  // REF
  const minusButtonRef = useRef(null)
  const minusButtonModalRef = useRef(null)
  const plusButtonRef = useRef(null)
  const plusButtonModalRef = useRef(null)

  // Accéder aux boutons via le DOM
  const minusButton = minusButtonRef.current
  const plusButton = plusButtonRef.current
  const minusButtonModal = minusButtonModalRef.current
  const plusButtonModal = plusButtonModalRef.current

  // dropdown counter desktop
  if (minusButton) {
    if (formData.availableSeats === 1) {
      minusButton.disabled = true
    } else {
      minusButton.disabled = false
    }
  }
  if (plusButton) {
    if (formData.availableSeats === 8) {
      plusButton.disabled = true
    } else {
      plusButton.disabled = false
    }
  }
  // modal counter mobile
  if (minusButtonModal) {
    if (formData.availableSeats === 1) {
      minusButtonModal.disabled = true
    } else {
      minusButtonModal.disabled = false
    }
  }

  if (plusButtonModal) {
    if (formData.availableSeats === 8) {
      plusButtonModal.disabled = true
    } else {
      plusButtonModal.disabled = false
    }
  }

  const incrementCounter = () => {
    if (formData.availableSeats >= 1 && formData.availableSeats < 8) {
      setFormData({ ...formData, passengers: formData.availableSeats + 1 })
    }
  }
  const decrementCounter = () => {
    if (formData.availableSeats > 1 && formData.availableSeats <= 8) {
      setFormData({ ...formData, passengers: formData.availableSeats - 1 })
    }
  }

  return (
    <>
      <Header />
      <Hero searchParams={searchQuery} />
      <main>
        <div className="container">
          <section className="filters-layout flex-row">
            <aside className="filters one-third-column">
              <div className="filter-header flex-row">
                <h2>Filtrer</h2>
                <a href="#" class="reset">
                  tout effacer
                </a>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <h3>Votre voyage</h3>
                  <div className="criteria">
                    <label>Prix max (en crédits)</label>
                    <input
                      type="number"
                      name="maxPrice"
                      min="2"
                      defaultValue="2"
                    />
                    {/* <div className="counter">
                    <button
                      type="button"
                      onClick={decrementCounter}
                      ref={minusButtonRef}
                    >
                      <Minus />
                    </button>
                    <p>{formData.availableSeats}</p>

                    <button
                      type="button"
                      onClick={incrementCounter}
                      ref={plusButtonRef}
                    >
                      <Plus />
                    </button>
                  </div> */}
                  </div>

                  <div className="criteria flex-row">
                    <label>Durée max</label>
                    <select>
                      <option>--:--</option>
                      <option value="30">30 min</option>
                      <option value="60">1h</option>
                    </select>
                  </div>
                </div>
                <div className="input-group">
                  <h3>Votre conducteur</h3>
                  <div className="criteria flex-row">
                    <label>Note minimal</label>
                    <input
                      type="number"
                      name="minRating"
                      min="0"
                      max="5"
                      defaultValue="0"
                    />
                  </div>

                  <div className="criteria flex-row">
                    <label>Genre</label>
                    <select>
                      <option>Indifférent</option>
                      <option>Homme</option>
                      <option>Femme</option>
                    </select>
                  </div>
                </div>
                <div className="input-group">
                  <h3>Vos préférences</h3>
                  <div class="criteria toggle flex-row">
                    <label>
                      Voyage écologique <small>Voiture électrique</small>
                    </label>
                    <input type="checkbox" />
                  </div>

                  <div class="criteria toggle flex-row">
                    <label>Véhicule non fumeur</label>
                    <input type="checkbox" checked />
                  </div>

                  <div class=" criteria toggle flex-row">
                    <label>Pas d’animaux</label>
                    <input type="checkbox" />
                  </div>
                </div>
                <button type="submit" className="btn-solid">
                  Voir les trajets
                </button>
              </form>
            </aside>
            <div className="results-search">
              <h1>{getDate(searchQuery.departureDate)}</h1>

              <div className="results-list flex-column gap-15">
                {ridesList ? (
                  ridesList.map((ride) => {
                    console.log("ride", ride)
                    return <RideCard key={ride._id} ride={ride} />
                  })
                ) : (
                  <p>Pas de trajet trouvé avec ces critères.</p>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default RidesList
