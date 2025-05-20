import { Link } from "react-router-dom"
import Cookies from "js-cookie"
import React, { useEffect, useState, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import axios from "../config/axiosConfig"

// Components
import Header from "../components/Header"
import Footer from "../components/Footer"
import Cover from "../components/Cover"
import AddCarForm from "../components/AddCarForm"

const AddCar = () => {
  const { user, login, logout, isAuthenticated } = useContext(AuthContext)
  console.log(user)
  const [userReviewsList, setUserReviewsList] = useState(false)

  return (
    <>
      <Header />
      <Cover />
      <main className="container">
        <section className="flex-column align-center">
          <h1 className="mb-20">Ajouter un véhicule</h1>
          <AddCarForm />
        </section>
      </main>

      <Footer />
    </>
  )
}

export default AddCar
