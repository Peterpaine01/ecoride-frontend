import { Link } from "react-router-dom"
import React, { useEffect, useState } from "react"
import axios from "../../config/axiosConfig"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// Components
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import Cover from "../../components/Cover"

import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft"

const StaffList = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    roleId: "",
  })

  const [success, setSuccess] = useState(false)
  const [roles, setRoles] = useState([])

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get("/roles")
        setRoles(response.data)
      } catch (error) {
        toast.error("Erreur lors du chargement des rôles")
      }
    }

    fetchRoles()
  }, [])

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post("/create-staff", formData)

      toast.success("Staff créé avec succès ✅")
      setSuccess(true)
      setFormData({
        email: "",
        password: "",
        firstname: "",
        lastname: "",
        roleId: "",
      })
    } catch (err) {
      toast.error(err.response?.data?.error || "Erreur lors de la création")
    }
  }

  return (
    <>
      <Header />
      <Cover />
      <main>
        <div className="container">
          <section>
            <h1 className="mb-20">Ajouter un webmaster</h1>
            <form
              onSubmit={handleSubmit}
              className="flex-column justify-left align-center gap-20 "
            >
              <div>
                <input
                  className="w-100 mb-20"
                  type="text"
                  name="firstname"
                  placeholder="Prénom"
                  value={formData.firstname}
                  onChange={handleChange}
                  required
                />

                <input
                  className="w-100"
                  type="text"
                  name="lastname"
                  placeholder="Nom"
                  value={formData.lastname}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <input
                  className="w-100 mb-20"
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <input
                  className="w-100"
                  type="password"
                  name="password"
                  placeholder="Mot de passe"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <select
                className="custom-select-minimal"
                name="roleId"
                value={formData.roleId}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionnez un rôle</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.label}
                  </option>
                ))}
              </select>

              <button type="submit" className="btn-solid mt-20">
                Créer le staff
              </button>
            </form>

            {success && (
              <section className="flex-row justify-center">
                <Link
                  to="/staff"
                  className="btn-link success flex-row align-center"
                >
                  <KeyboardArrowLeftIcon />

                  <span>Retour à la liste du staff</span>
                </Link>
              </section>
            )}
          </section>
        </div>
      </main>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  )
}

export default StaffList
