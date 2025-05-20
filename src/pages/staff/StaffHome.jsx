import { Link } from "react-router-dom"
import React, { useEffect, useState } from "react"
import axios from "../../config/axiosConfig"

// Components
import Header from "../../components/Header"
import Cover from "../../components/Cover"
import Footer from "../../components/Footer"

import LitigeCard from "../../components/LitigeCard"
import OpinionCard from "../../components/OpinionCard"

import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight"
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft"

const StaffHome = () => {
  const [litigesList, setLitigesList] = useState([])
  const [opinionsList, setOpinionsList] = useState([])

  const fetchData = async () => {
    try {
      const response = await axios.get("/reviews")
      const reviews = response.data || []

      // Filtrage selon les conditions
      const litiges = reviews.filter(
        (review) => review.wasRideOk === false && review.isModerated === false
      )
      const opinions = reviews.filter(
        (review) => review.wasRideOk === true && review.isModerated === false
      )

      setLitigesList(litiges)
      setOpinionsList(opinions)
    } catch (error) {
      console.error("Error fetching reviews:", error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <>
      <Header />
      <Cover />
      <main className="webmaster">
        <div className="container relative">
          <section>
            <h1>Espace Webmaster</h1>
          </section>
          <section>
            <div className="flex-row space-between align-center mb-20">
              <h2>Litiges à traiter</h2>
              <p className="count-list">{litigesList.length}</p>
            </div>
            <div className="flex-column gap-15">
              {litigesList.map((litige) => {
                return <LitigeCard litigeData={litige} />
              })}
            </div>
            <div className="mt-20">
              <Link to="/staff" className="btn-link flex-row align-center">
                <span>Tous les litiges </span> <KeyboardArrowRightIcon />
              </Link>
            </div>
          </section>
          <section className="mt-40">
            <div className="flex-row space-between align-center mb-20">
              <h2>Avis à modérer</h2>
              <p className="count-list">{opinionsList.length}</p>
            </div>
            <div className="flex-column gap-15">
              {opinionsList.map((opinion) => {
                return <OpinionCard opinionData={opinion} />
              })}
            </div>
            <div className="mt-20">
              <Link to="/staff" className="btn-link flex-row align-center">
                <span>Tous les avis </span> <KeyboardArrowRightIcon />
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default StaffHome
