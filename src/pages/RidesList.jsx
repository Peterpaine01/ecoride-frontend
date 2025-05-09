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
import Filters from "../components/Filters"
import FiltersModal from "../components/FiltersModal"

const RidesList = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [ridesList, setRidesList] = useState()
  const [fuzzyRides, setFuzzyRides] = useState([])
  const [showFuzzy, setShowFuzzy] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const navigate = useNavigate()

  // useMemo = update searchQuery only if searchParams change
  const searchQuery = useMemo(
    () => ({
      departureCity: searchParams.get("departureCity") || "",
      destinationCity: searchParams.get("destinationCity") || "",
      departureDate: searchParams.get("departureDate") || new Date(),
      availableSeats: parseInt(searchParams.get("availableSeats"), 10) || 1,
      maxPrice: parseFloat(searchParams.get("maxPrice")) || undefined,
      minRating: parseFloat(searchParams.get("minRating")) || undefined,
      isElectric: searchParams.get("isElectric") === "true" || undefined,
      acceptSmoking: searchParams.get("acceptSmoking") === "true" || undefined,
      acceptAnimals: searchParams.get("acceptAnimals") === "true" || undefined,
    }),
    [searchParams]
  )

  useEffect(() => {
    const fetchData = async () => {
      const today = new Date()
      const formattedDate = today.toISOString().split("T")[0]
      const hasSearchCriteria =
        searchQuery.departureCity && searchQuery.destinationCity

      const cleanDate = (date) => date?.split?.("T")?.[0] ?? date
      const nonFuzzyParams = hasSearchCriteria
        ? {
            ...searchQuery,
            departureDate: cleanDate(searchQuery.departureDate),
            fuzzy: false,
          }
        : { departureDate: formattedDate, fuzzy: false }

      const fuzzyParams = hasSearchCriteria
        ? {
            ...searchQuery,
            departureDate: cleanDate(searchQuery.departureDate),
            fuzzy: true,
          }
        : { departureDate: formattedDate, fuzzy: true }
      try {
        const response = await axios.get("/search-rides", {
          params: nonFuzzyParams,
        })

        setRidesList(response.data.rides || [])
        const fuzzyResponse = await axios.get("/search-rides", {
          params: fuzzyParams,
        })
        setFuzzyRides(fuzzyResponse.data.rides || [])
        setShowFuzzy(false)
      } catch (error) {
        console.error("Error fetching rides:", error)
      }
    }

    fetchData()
  }, [searchQuery, searchParams])

  useEffect(() => {
    // console.log("ridesList has been updated ✅", ridesList)
    console.log("searchQuery", searchQuery)
  }, [ridesList, searchQuery])

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

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

  let previousDate = null
  let isFirstDate = true

  const fuzzyRidesList = fuzzyRides.map((ride) => {
    const rideDate = new Date(ride.departureDate).toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    const isNewDay = rideDate !== previousDate
    const showDateHeader = isNewDay && !isFirstDate
    if (isNewDay) {
      previousDate = rideDate
      if (isFirstDate) isFirstDate = false
    }

    return (
      <div key={ride._id}>
        {showDateHeader && <h3 className="next-day">{rideDate}</h3>}
        <RideCard ride={ride} />
      </div>
    )
  })

  return (
    <>
      <Header />
      <Hero searchParams={searchQuery} />
      <main>
        <div className="container">
          <section className="filters-layout flex-row">
            {!isMobile && (
              <aside className="filters one-third-column">
                <Filters searchQuery={searchQuery} />
              </aside>
            )}

            {ridesList && (
              <div className="results-search">
                <div className="flex-row space-between align-center">
                  {searchQuery.departureDate ? (
                    <h1>{getDate(searchQuery.departureDate)}</h1>
                  ) : (
                    <h1>Aujourd'hui</h1>
                  )}

                  {isMobile && <FiltersModal searchQuery={searchQuery} />}
                </div>

                {!showFuzzy ? (
                  <>
                    <div className="results-list flex-column gap-15">
                      {ridesList.length > 0 ? (
                        ridesList.map((ride) => {
                          return <RideCard key={ride._id} ride={ride} />
                        })
                      ) : (
                        <div className="flex-row justify-center dotted mb-20">
                          <p>Pas de trajet trouvé avec ces critères.</p>
                        </div>
                      )}
                    </div>
                    {fuzzyRides.length > 0 &&
                      fuzzyRides.length > ridesList.length && (
                        <div className="mt-20 flex-row justify-center w-100">
                          <button
                            className="btn-link"
                            onClick={() => setShowFuzzy(true)}
                          >
                            Voir les jours suivants
                          </button>
                        </div>
                      )}
                  </>
                ) : (
                  <div className="results-list flex-column gap-15">
                    {fuzzyRides ? (
                      fuzzyRidesList
                    ) : (
                      <p>Pas de trajet trouvé avec ces critères.</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default RidesList
