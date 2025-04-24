import { Link, useNavigate } from "react-router-dom"
import React, { useState, useContext, useEffect } from "react"
import { AuthContext } from "../context/AuthContext"

// Components
import Header from "../components/Header"
import Cover from "../components/Cover"
import Footer from "../components/Footer"
import LoginForm from "../components/LoginForm"

const SignIn = () => {
  const { login, isAuthenticated } = useContext(AuthContext)
  const navigate = useNavigate()
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/")
    }
  }, [isAuthenticated, navigate])

  return (
    <>
      <Header />
      <Cover />

      <main>
        <div className="container">
          <section className="flex-column align-center">
            <h1>Se connecter</h1>
            <LoginForm />
          </section>
        </div>
      </main>

      <Footer />
    </>
  )
}

export default SignIn
