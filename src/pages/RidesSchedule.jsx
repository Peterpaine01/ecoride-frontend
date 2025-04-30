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
  console.log("authLoading", authLoading)

  useEffect(() => {
    const fetchRidesDriver = async () => {
      try {
        const response = await axios.get(`/driver-rides`)
        setRidesDriver(response.data.rides)
      } catch (error) {
        console.error("Error fetching driver rides :", error)
      }
    }

    const fetchRidesPassenger = async () => {
      try {
        const response = await axios.get(`/passenger-bookings`)
        setRidesPassenger(response.data.rides)
      } catch (error) {
        console.error("Error fetching passenger rides :", error)
      }
    }

    fetchRidesDriver()
    fetchRidesPassenger()
  }, [])

  if (authLoading) return null

  const upcomingDriverRides = ridesDriver
    ?.filter((ride) => {
      const rideDate = new Date(ride.departureDate)
      return ride.rideStatus === "forthcoming" && rideDate >= new Date()
    })
    .sort((a, b) => new Date(a.departureDate) - new Date(b.departureDate))

  const upcomingPassengerRides = ridesPassenger
    ?.filter((ride) => {
      const rideDate = new Date(ride.departureDate)
      return ride.rideStatus === "forthcoming" && rideDate >= new Date()
    })
    .sort((a, b) => new Date(a.departureDate) - new Date(b.departureDate))

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
          <section>
            <h2>Conducteur</h2>
            {upcomingDriverRides?.map((ride, index) => {
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
                  <RoadMapCard ride={ride} isDriver={true} />
                </div>
              )
            })}
          </section>
          <section>
            <h2>Passager</h2>
            {upcomingPassengerRides?.map((ride, index) => {
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
                  <RoadMapCard ride={ride} isDriver={false} />
                </div>
              )
            })}
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default RidesSchedule
