import { Link } from "react-router-dom"
import React, { useEffect, useState } from "react"
import axios from "axios"

// Components
import Header from "../components/Header"
import Footer from "../components/Footer"
import Cover from "../components/Cover"

const CarDetails = () => {
  return (
    <>
      <Header />
      <Cover />
      <main>
        <div className="container">
          <h1>Car Details</h1>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default CarDetails
