import { Link } from "react-router-dom"
import React, { useEffect, useState, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import axios from "../config/axiosConfig"

// Components
import Header from "../components/Header"
import Cover from "../components/Cover"
import Footer from "../components/Footer"
import RoadMapCard from "../components/RoadMapCard"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"

const RidesSchedule = () => {
  const [ridesDriver, setRidesDriver] = useState([])
  const [ridesPassenger, setRidesPassenger] = useState([])
  const [showDriverRides, setShowDriverRides] = useState(false)
  const [showPassengerRides, setShowPassengerRides] = useState(false)

  const { user, authLoading } = useContext(AuthContext)

  useEffect(() => {
    const fetchRidesDriver = async () => {
      try {
        const response = await axios.get(`/driver-rides`)

        const now = new Date()
        const minDate = new Date(now)
        minDate.setHours(0, 0, 0, 0) // minuit aujourd'hui
        minDate.setDate(minDate.getDate() - 2) // -2 jours

        const upcomingDriverRides = response.data.rides
          ?.filter((ride) => {
            const rideDate = new Date(ride.departureDate)
            return ride.rideStatus !== "canceled" && rideDate >= minDate
          })
          .sort((a, b) => new Date(a.departureDate) - new Date(b.departureDate))

        setRidesDriver(upcomingDriverRides)
      } catch (error) {
        console.error("Error fetching driver rides :", error)
      }
    }

    const fetchRidesPassenger = async () => {
      if (user) {
        try {
          const response = await axios.get(`/passenger-bookings`)

          const now = new Date()
          const minDate = new Date(now)
          minDate.setHours(0, 0, 0, 0)
          minDate.setDate(minDate.getDate() - 2)

          const upcomingPassengerRides = response.data.bookings
            ?.filter((booking) => {
              const rideDate = new Date(booking?.ride?.departureDate)
              return booking.bookingStatus !== "canceled" && rideDate >= minDate
            })
            .sort(
              (a, b) =>
                new Date(a.ride.departureDate) - new Date(b.ride.departureDate)
            )

          setRidesPassenger(upcomingPassengerRides)
        } catch (error) {
          console.error("Error fetching passenger rides :", error)
        }
      }
    }

    fetchRidesDriver()
    fetchRidesPassenger()
  }, [user])

  if (authLoading) return null

  let previousDateRide = null
  let previousDateBooking = null

  return (
    <>
      <Header />
      <Cover />
      <main>
        <div className="container ride-schedule">
          <section>
            <h1>Vos trajets à venir</h1>
          </section>

          {ridesDriver &&
            ridesPassenger &&
            ridesDriver.length === 0 &&
            ridesPassenger.length === 0 && (
              <div className="dotted">
                <p>Pas de trajets à venir.</p>
              </div>
            )}
          {ridesDriver && ridesDriver.length > 0 && (
            <section>
              <div
                className="toggle-title flex-row align-center space-between"
                onClick={() => setShowDriverRides(!showDriverRides)}
                style={{ cursor: "pointer" }}
              >
                <h2>Conducteur</h2>
                <ArrowForwardIosIcon
                  sx={{
                    color: "#fff",
                    fontSize: 18,
                    transform: showDriverRides
                      ? "rotate(90deg)"
                      : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                />
              </div>

              <div
                className={`toggle-content ${showDriverRides ? "" : "closed"}`}
              >
                {ridesDriver?.map((ride, index) => {
                  const currentDate = format(
                    new Date(ride.departureDate),
                    "EEE dd MMMM",
                    { locale: fr }
                  )
                  const showDate = currentDate !== previousDateRide
                  previousDateRide = currentDate

                  return (
                    <div key={ride._id}>
                      {showDate && (
                        <h3 className="text-white mt-20">{currentDate}</h3>
                      )}
                      <RoadMapCard ride={ride} driverRide={true} />
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {ridesPassenger && ridesPassenger.length > 0 && (
            <section>
              <div
                className="toggle-title flex-row align-center space-between"
                onClick={() => setShowPassengerRides(!showPassengerRides)}
                style={{ cursor: "pointer" }}
              >
                <h2>Passager</h2>
                <ArrowForwardIosIcon
                  sx={{
                    color: "#fff",
                    fontSize: 18,
                    transform: showPassengerRides
                      ? "rotate(90deg)"
                      : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                />
              </div>

              <div
                className={`toggle-content ${
                  showPassengerRides ? "" : "closed"
                }`}
              >
                {ridesPassenger?.map((booking, index) => {
                  const currentDate = format(
                    new Date(booking.ride?.departureDate),
                    "EEE dd MMMM",
                    { locale: fr }
                  )
                  const showDate = currentDate !== previousDateBooking
                  previousDateBooking = currentDate

                  return (
                    <div key={booking.ride?._id}>
                      {showDate && (
                        <h3 className="text-white mt-20">{currentDate}</h3>
                      )}
                      <RoadMapCard
                        ride={booking.ride}
                        booking={booking}
                        driverRide={false}
                      />
                    </div>
                  )
                })}
              </div>
            </section>
          )}
          <section>
            <Link
              to={`/trajets-archive/${user.account_id}`}
              className="edit-profile btn-link flex-row align-center"
            >
              <span>Trajets passés</span> <KeyboardArrowRightIcon />
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default RidesSchedule
