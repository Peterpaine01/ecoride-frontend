import {
  Link,
  useLocation,
  useSearchParams,
  useNavigate,
} from "react-router-dom"
import React, { useEffect, useState, useMemo, useRef } from "react"
import axios from "../config/axiosConfig"

// Icones
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined"

// Components
import Header from "../components/Header"
import Hero from "../components/Hero"
import Footer from "../components/Footer"
import RideCard from "../components/RideCard"
import Filters from "../components/Filters"
import FiltersModal from "../components/FiltersModal"

const RidesList = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [ridesList, setRidesList] = useState([])
  const [fuzzyRides, setFuzzyRides] = useState([])
  const [showFuzzy, setShowFuzzy] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [visibleRidesCount, setVisibleRidesCount] = useState(6)
  const [visibleFuzzyCount, setVisibleFuzzyCount] = useState(6)
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false)

  const navigate = useNavigate()

  // useMemo = update searchQuery only if searchParams change
  const searchQuery = useMemo(
    () => ({
      departureCity: searchParams.get("departureCity") || "",
      destinationCity: searchParams.get("destinationCity") || "",
      departureDate: searchParams.get("departureDate") || new Date(),
      remainingSeats: parseInt(searchParams.get("remainingSeats"), 10) || 1,
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

      const cleanDate = (date) => date?.split?.("T")?.[0] ?? date

      const departureDate =
        cleanDate(searchQuery.departureDate) || formattedDate

      const nonFuzzyParams = {
        ...searchQuery,
        departureDate,
        fuzzy: false,
      }

      const fuzzyParams = {
        ...searchQuery,
        departureDate,
        fuzzy: true,
      }

      try {
        const response = await axios.get("/search-rides", {
          params: nonFuzzyParams,
        })

        setRidesList(response.data.rides || [])

        const fuzzyResponse = await axios.get("/search-rides", {
          params: fuzzyParams,
        })
        console.log("fuzzyResponse.data.rides", fuzzyResponse.data.rides)

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
    const checkMobile = () => setIsMobile(window.innerWidth <= 1000)
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
    }

    return formattedDate
      .toLocaleDateString("fr-FR", options)
      .replace(/^./, (c) => c.toUpperCase())
  }

  //  MODE FUZZY

  let previousDate = null
  let isFirstDate = true

  const fuzzyRidesList = fuzzyRides.slice(0, visibleFuzzyCount).map((ride) => {
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

  const hasExactDateRide = () => {
    if (!ridesList || ridesList.length === 0) return false

    const searchDate = new Date(searchQuery.departureDate)
      .toISOString()
      .split("T")[0]

    return ridesList.some((ride) => {
      const rideDate = new Date(ride.departureDate).toISOString().split("T")[0]
      return rideDate === searchDate
    })
  }

  const getFirstFuzzyDate = () => {
    if (fuzzyRides.length === 0) return null

    const firstRide = fuzzyRides[0]
    return new Date(firstRide.departureDate).toISOString().split("T")[0]
  }

  //  PAGINATION INFINIE

  useEffect(() => {
    setVisibleRidesCount(6)
    setVisibleFuzzyCount(6)
  }, [ridesList, fuzzyRides])

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY
      const bottomPosition = document.documentElement.offsetHeight - 100

      if (scrollPosition >= bottomPosition) {
        if (showFuzzy) {
          setVisibleFuzzyCount((prev) => Math.min(prev + 6, fuzzyRides.length))
        } else {
          setVisibleRidesCount((prev) => Math.min(prev + 6, ridesList.length))
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [showFuzzy, ridesList?.length, fuzzyRides?.length])

  return (
    <>
      <Header />
      <Hero searchParams={searchQuery} />
      <main>
        <div className="container">
          <section className="filters-layout flex-row">
            <div
              className={
                isMobile
                  ? `modal-overlay-filters filters ${
                      isFiltersModalOpen ? "visible" : "hidden"
                    }`
                  : "filters one-third-column"
              }
            >
              <Filters
                searchQuery={searchQuery}
                isFiltersModalOpen={isFiltersModalOpen}
                setIsFiltersModalOpen={setIsFiltersModalOpen}
              />
            </div>

            {ridesList && (
              <div className="results-search">
                <div className="flex-row space-between align-center">
                  <h1>
                    {showFuzzy && !hasExactDateRide()
                      ? getFirstFuzzyDate()
                        ? getDate(getFirstFuzzyDate())
                        : "Prochains jours"
                      : getDate(searchQuery.departureDate)}
                  </h1>

                  {/* {isMobile && <FiltersModal searchQuery={searchQuery} />} */}
                  {isMobile && (
                    <button
                      className="btn-round flex-column align-center justify-center"
                      onClick={() => setIsFiltersModalOpen(true)}
                    >
                      <TuneOutlinedIcon
                        sx={{ color: "#023560", fontSize: 22 }}
                      />
                      <small>Filtrer</small>
                    </button>
                  )}
                </div>

                {!showFuzzy ? (
                  <>
                    <div className="results-list flex-column gap-15">
                      {ridesList.length > 0 ? (
                        ridesList.slice(0, visibleRidesCount).map((ride) => {
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
                            <span>Voir les jours suivants</span>
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
