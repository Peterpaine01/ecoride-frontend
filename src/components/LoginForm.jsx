import { Link, useNavigate, useLocation } from "react-router-dom"
import React, { useState, useContext, useEffect } from "react"
import { AuthContext } from "../context/AuthContext"
import { Eye, EyeOff, Lock, Unlock, Mail } from "react-feather"

const LoginForm = () => {
  const { login, isAuthenticated } = useContext(AuthContext)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [validationEmail, setValidationEmail] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (name === "email") checkEmail(value)
  }

  const checkEmail = (email = "") => {
    const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    setValidationEmail(regexEmail.test(email))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage("")

    if (!validationEmail) {
      setErrorMessage("Veuillez entrer une adresse e-mail valide.")
      return
    }

    const result = await login(formData.email, formData.password)

    if (result.success) {
      if (location.pathname === "/se-connecter") {
        navigate("/")
      }
    } else {
      setErrorMessage(result.message || "Identifiants incorrects.")
    }
  }
  return (
    <form
      className="user-connect framed flex-column"
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="input-group">
        <label htmlFor="email" className="label-hidden">
          Entrez votre email
        </label>
        <div className="icon-input-container">
          <Mail size={20} className="input-icon-left" />
          <input
            type="email"
            autoComplete="off"
            id="email"
            name="email"
            placeholder="Adresse email"
            value={formData.email}
            onChange={handleChange}
            aria-invalid={!validationEmail}
          />
        </div>
        {!validationEmail && formData.email.length > 0 && (
          <span className="error-msg">Email invalide.</span>
        )}
      </div>

      <div className="input-group password-container">
        <label htmlFor="password" className="label-hidden">
          Mot de passe
        </label>
        <div className="icon-input-container password-container">
          {showPassword ? (
            <Unlock size={20} className="input-icon-left" />
          ) : (
            <Lock size={20} className="input-icon-left" />
          )}
          <input
            type={showPassword ? "text" : "password"}
            autoComplete="off"
            id="password"
            name="password"
            placeholder="Mot de passe"
            value={formData.password}
            onChange={handleChange}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            aria-label="Afficher ou masquer le mot de passe"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>
      {errorMessage && (
        <p className="error-msg" role="alert">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        className="btn-solid"
        disabled={!validationEmail || loading}
      >
        {loading ? "Connexion..." : "Accéder"}
      </button>

      <Link to="/nouveau-password" className="btn-link mt-20 align-self">
        Mot de passe oublié ?
      </Link>
    </form>
  )
}

export default LoginForm
