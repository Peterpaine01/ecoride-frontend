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

const RidesSchedule = () => {
  const [ridesDriver, setRidesDriver] = useState([])
  const [ridesPassenger, setRidesPassenger] = useState([])

  const { user, authLoading } = useContext(AuthContext)
  // console.log("authLoading", authLoading)

  useEffect(() => {
    const fetchRidesDriver = async () => {
      try {
        const response = await axios.get(`/driver-rides`)
        const upcomingDriverRides = response.data.rides
          ?.filter((ride) => {
            const rideDate = new Date(ride.departureDate)
            return ride.rideStatus !== "canceled" && rideDate >= new Date()
          })
          .sort((a, b) => new Date(a.departureDate) - new Date(b.departureDate))

        setRidesDriver(upcomingDriverRides)
      } catch (error) {
        console.error("Error fetching driver rides :", error)
      }
    }

    const fetchRidesPassenger = async () => {
      if (user) {
      }
      try {
        const response = await axios.get(`/passenger-bookings`)
        const upcomingPassengerRides = response.data.bookings
          ?.filter((booking) => {
            const rideDate = new Date(booking.ride.departureDate)
            return (
              booking.bookingStatus !== "canceled" &&
              booking.bookingStatus !== "reviewed" &&
              rideDate >= new Date()
            )
          })
          .sort((a, b) => new Date(a.departureDate) - new Date(b.departureDate))
        console.log(upcomingPassengerRides)
        setRidesPassenger(upcomingPassengerRides)
      } catch (error) {
        console.error("Error fetching passenger rides :", error)
      }
    }

    fetchRidesDriver()
    fetchRidesPassenger()
  }, [user])

  if (authLoading) return null

  let previousDate = null

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
              <h2>Conducteur</h2>
              {ridesDriver?.map((ride, index) => {
                const currentDate = format(
                  new Date(ride.departureDate),
                  "EEE dd MMMM",
                  { locale: fr }
                )

                const showDate = currentDate !== previousDate
                previousDate = currentDate

                return (
                  <div key={ride._id}>
                    {showDate && (
                      <h3 className="text-white mt-20">{currentDate}</h3>
                    )}{" "}
                    <RoadMapCard ride={ride} driverRide={true} />
                  </div>
                )
              })}
            </section>
          )}

          {ridesPassenger && ridesPassenger.length > 0 && (
            <section>
              <h2>Passager</h2>
              {ridesPassenger?.map((booking, index) => {
                const currentDate = format(
                  new Date(booking.ride?.departureDate),
                  "EEE dd MMMM",
                  { locale: fr }
                )

                const showDate = currentDate !== previousDate
                previousDate = currentDate

                return (
                  <div key={booking.ride?._id}>
                    {showDate && (
                      <h3 className="text-white mt-20">{currentDate}</h3>
                    )}{" "}
                    <RoadMapCard
                      ride={booking.ride}
                      booking={booking}
                      driverRide={false}
                    />
                  </div>
                )
              })}
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

export default RidesSchedule
