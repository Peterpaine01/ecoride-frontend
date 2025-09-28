import { Link, useParams, useNavigate } from "react-router-dom"
import React, { useEffect, useState } from "react"
import axios from "../../config/axiosConfig"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import Header from "../../components/Header"
import Footer from "../../components/Footer"
import Cover from "../../components/Cover"

import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft"

const StaffEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    accountType: "",
    accountStatus: "",
    roleId: "",
  })

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

    const fetchStaffData = async () => {
      try {
        const response = await axios.get(`/staff-member/${id}`)
        const {
          email,
          first_name,
          last_name,
          role_id,
          account_status,
          account_type,
        } = response.data

        setFormData({
          email,
          password: "",
          firstname: first_name,
          lastname: last_name,
          accountType: account_type,
          accountStatus: account_status,
          roleId: role_id,
        })
      } catch (error) {
        toast.error("Erreur lors du chargement du staff")
      }
    }

    fetchRoles()
    fetchStaffData()
  }, [id])

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const updatedFields = Object.fromEntries(
      Object.entries(formData).filter(
        ([_, value]) => value?.toString().trim() !== ""
      )
    )

    try {
      await axios.patch(`/update-staff-member/${id}`, updatedFields)
      toast.success("Staff modifié avec succès")
      // setTimeout(() => navigate("/staff"), 1500)
    } catch (err) {
      toast.error(err.response?.data?.error || "Erreur lors de la modification")
    }
  }

  return (
    <>
      <Header />
      <Cover />
      <main>
        <div className="container">
          <section className="flex-column justify-center align-center">
            <h1 className="mb-20">Modifier un webmaster</h1>
            <form
              onSubmit={handleSubmit}
              className="form-full flex-column justify-center align-start gap-20"
            >
              <div className="dotted flex-column justify-left align-start gap-20">
                <div className="w-100 flex-column gap-15">
                  <label htmlFor="firstname">Prénom</label>
                  <input
                    className="w-100 mb-20"
                    type="text"
                    id="firstname"
                    name="firstname"
                    placeholder="Prénom"
                    value={formData.firstname}
                    onChange={handleChange}
                    required
                  />

                  <label htmlFor="lastname">Nom</label>
                  <input
                    className="w-100"
                    type="text"
                    id="lastname"
                    name="lastname"
                    placeholder="Nom"
                    value={formData.lastname}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="w-100 flex-column gap-15">
                  <label htmlFor="email">Email</label>
                  <input
                    className="w-100 mb-20"
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="flex-row align-center gap-15">
                  <label htmlFor="accountStatus">Statut du compte</label>
                  <select
                    className="custom-select-minimal"
                    id="accountStatus"
                    name="accountStatus"
                    value={formData.accountStatus}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Statut du compte</option>
                    <option value="pending">En attente</option>
                    <option value="active">Actif</option>
                    <option value="suspended">Suspendu</option>
                    <option value="deleted">Supprimé</option>
                  </select>
                </div>

                <div className="flex-row align-center gap-15">
                  <label htmlFor="roleId">Rôle</label>
                  <select
                    className="custom-select-minimal"
                    id="roleId"
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
                </div>
              </div>
              <div className="dotted flex-column justify-left align-start gap-20">
                <div className="w-100 flex-column gap-15">
                  <label htmlFor="password">Nouveau mot de passe</label>
                  <input
                    className="w-100"
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Laisser vide si inchangé"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-solid mt-20 align-self-center"
              >
                Mettre à jour
              </button>
            </form>

            <section className="flex-row justify-center mt-20">
              <Link to="/staff" className="btn-link flex-row align-center">
                <KeyboardArrowLeftIcon />
                <span>Retour à la liste du staff</span>
              </Link>
            </section>
          </section>
        </div>
      </main>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  )
}

export default StaffEdit
