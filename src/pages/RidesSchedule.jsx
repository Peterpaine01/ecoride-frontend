import { Link } from "react-router-dom"
import React, { useEffect, useState, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import axios from "../config/axiosConfig"

// Components
import Header from "../components/Header"
import Cover from "../components/Cover"
import Footer from "../components/Footer"

const RidesSchedule = () => {
  const [rides, setRides] = useState()

  const { user } = useContext(AuthContext)

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await axios.get(`/driver-rides`)

        setRides(response.data.rides)
      } catch (error) {
        console.error("Error fetching rides :", error)
      }
    }

    fetchRides()
  }, [])

  console.log(rides)

  return (
    <>
      <Header />
      <Cover />
      <main>
        <div className="container">
          <section>
            <h1>Vos trajets</h1>
          </section>
          <section>
            {rides &&
              rides
                .filter((ride) => ride.rideStatus === "forthcoming")
                .map((ride) => {
                  console.log("ride", ride)

                  return (
                    <div key={ride._id} className="card-ride">
                      {/* <p>
                    {ride.departureAddress.city} -{" "}
                    <p>{ride.destinationAddress.city}</p>
                  </p> */}
                      <p>{ride.departureDate}</p>
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
