import React, { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import axios from "../../config/axiosConfig"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// Components
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import Cover from "../../components/Cover"

import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft"
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight"
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"
import ModeEditIcon from "@mui/icons-material/ModeEdit"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import CancelIcon from "@mui/icons-material/Cancel"
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb"
import PendingIcon from "@mui/icons-material/Pending"

const UserDetails = () => {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchUser = async () => {
    try {
      const response = await axios.get(`/user/${id}`)
      setUser(response.data)
    } catch (error) {
      toast.error("Erreur lors du chargement de l'utilisateur")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [id])

  const hardDeleteUser = async (id) => {
    try {
      await axios.delete(`/hard-delete-user/${id}`)
      setTimeout(() => navigate("/utilisateurs"), 1500)
    } catch (error) {
      console.error(
        "Erreur suppression :",
        error.response?.data?.error || error.message
      )
    }
  }

  const toggleSuspendStatus = async () => {
    try {
      const updatedStatus =
        user.accountStatus === "suspended" ? "active" : "suspended"

      const response = await axios.patch(`/update-user/${id}`, {
        account_status: updatedStatus,
      })

      fetchUser()
      toast.success("Statut du compte mis à jour")
    } catch (error) {
      console.error(
        "Erreur update status :",
        error.response?.data?.error || error.message
      )
      toast.error("Erreur lors de la mise à jour du statut")
    }
  }

  const softDeleteUser = async (id) => {
    try {
      await axios.patch(`/soft-delete-user/${id}`)
      fetchUser()
    } catch (error) {
      console.error(
        "Erreur anonymisation :",
        error.response?.data?.error || error.message
      )
    }
  }

  console.log(user)

  return (
    <>
      <Header />
      <Cover />
      <main>
        <div className="container">
          <section className="flex-column justify-center align-center">
            <h1 className="mb-20">Utilisateur Infos</h1>

            {loading ? (
              <p>Chargement...</p>
            ) : user ? (
              <>
                <div className="mb-20 dotted">
                  <div className="profile-header">
                    <div className="flex-row gap-15">
                      <div className="profil-icon user-logged">
                        <img
                          src={user.photo}
                          alt={`Photo de ${user.username}`}
                        />
                      </div>
                      <div className="profile flex-column justify-center">
                        <h2 className="mb-5">{user.username}</h2>
                        <p className="pb-0">{user.credits} crédits</p>
                      </div>
                    </div>
                  </div>

                  <p>
                    <strong>Email :</strong> {user.email}
                  </p>
                  <p>
                    <strong>Conducteur :</strong>{" "}
                    {user.is_driver === false ? "non" : "oui"}
                  </p>
                  <p>
                    <strong>S'identifie comme :</strong>{" "}
                    {user.gender === "other"
                      ? "Autre"
                      : user.gender === "male"
                      ? "Homme"
                      : "Femme"}
                  </p>
                  <p>
                    <strong>Statut du compte :</strong> {user.accountStatus}
                  </p>
                </div>

                <div className="criteria toggle flex-row space-between align-center gap-15 mb-20">
                  <div className="flex-row space-between align-center gap-15">
                    <div className="flex-column ">
                      <label>Suspendre le compte</label>
                    </div>
                  </div>

                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={user.accountStatus === "suspended"}
                      onChange={toggleSuspendStatus}
                      disabled={user.accountStatus === "deleted"}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="flex-row space-between align-center gap-15 mb-40">
                  <button
                    onClick={() => softDeleteUser(id)}
                    className="btn-icon flex-row justify-center align-center color-dark"
                  >
                    <VisibilityOffIcon />
                  </button>
                  <button
                    onClick={() => hardDeleteUser(id)}
                    className="btn-icon flex-row justify-center align-center color-dark"
                  >
                    <DeleteForeverIcon />
                  </button>
                </div>
              </>
            ) : (
              <p>Utilisateur introuvable</p>
            )}

            <Link to="/utilisateurs" className="btn-link flex-row align-center">
              <KeyboardArrowLeftIcon />
              <span>Retour à la liste</span>
            </Link>
          </section>
        </div>
      </main>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  )
}

export default UserDetails
