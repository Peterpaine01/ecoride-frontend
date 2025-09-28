import { Link } from "react-router-dom"
import React, { useState } from "react"
import { Mail, User, MessageSquare } from "react-feather"
import axios from "axios"

// Components
import Header from "../components/Header"
import Footer from "../components/Footer"
import Cover from "../components/Cover"

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [status, setStatus] = useState(null)
  const [validationEmail, setValidationEmail] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (name === "email") checkEmail(value)
  }

  const checkEmail = (email = "") => {
    const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    setValidationEmail(regexEmail.test(email))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus(null)

    if (!validationEmail) {
      setStatus("Veuillez entrer une adresse e-mail valide.")
      return
    }

    if (!formData.name || !formData.message) {
      setStatus("Veuillez remplir tous les champs.")
      return
    }

    setLoading(true)
    try {
      await axios.post("/api/contact", formData)
      setStatus("Message envoyé avec succès !")
      setFormData({ name: "", email: "", message: "" })
    } catch (err) {
      console.error(err)
      setStatus("Erreur lors de l'envoi. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <Cover />
      <main>
        <div className="container">
          <section className="flex-column align-center">
            <h1>Contact</h1>
            <form
              className="contact-form framed flex-column"
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="input-group w-100">
                <label htmlFor="name" className="label-hidden">
                  Nom
                </label>
                <div className="icon-input-container">
                  <User size={20} className="input-icon-left" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Nom"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="input-group w-100">
                <label htmlFor="email" className="label-hidden">
                  Email
                </label>
                <div className="icon-input-container">
                  <Mail size={20} className="input-icon-left" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Adresse email"
                    value={formData.email}
                    onChange={handleChange}
                    aria-invalid={!validationEmail}
                    required
                  />
                </div>
                {!validationEmail && formData.email.length > 0 && (
                  <span className="error-msg">Email invalide.</span>
                )}
              </div>

              <div className="input-group w-100">
                <label htmlFor="message" className="label-hidden">
                  Message
                </label>
                <div className="icon-input-container">
                  <textarea
                    className="w-100"
                    id="message"
                    name="message"
                    rows="5"
                    placeholder="Votre message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {status && (
                <p
                  className={`status-msg ${
                    status.includes("Erreur") ? "error-msg" : "success-msg"
                  }`}
                  role="alert"
                >
                  {status}
                </p>
              )}

              <button
                type="submit"
                className="btn-solid mt-40"
                disabled={
                  loading ||
                  !validationEmail ||
                  !formData.name ||
                  !formData.message
                }
              >
                {loading ? "Envoi..." : "Envoyer"}
              </button>
            </form>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default Contact
