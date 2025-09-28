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
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"
import ModeEditIcon from "@mui/icons-material/ModeEdit"

const StaffDetails = () => {
  const { id } = useParams()
  const [staff, setStaff] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get(`/staff-member/${id}`)
        setStaff(response.data)
      } catch (error) {
        toast.error("Erreur lors du chargement du staff")
      } finally {
        setLoading(false)
      }
    }

    fetchStaff()
  }, [id])

  const deleteStaff = async (id) => {
    try {
      await axios.delete(`/delete-staff-member/${id}`)
      // fetchData()
      setTimeout(() => navigate("/staff"), 1500)
    } catch (error) {
      console.error(
        "Erreur suppression :",
        error.response?.data?.error || error.message
      )
    }
  }

  return (
    <>
      <Header />
      <Cover />
      <main>
        <div className="container">
          <section className="flex-column justify-center align-center">
            <h1 className="mb-20">Webmaster Infos</h1>

            {loading ? (
              <div className="flex-column justify-start align-center w-100 mt-40">
                <div class="loader"></div>
              </div>
            ) : staff ? (
              <>
                <div className="mb-20 dotted">
                  <h2>
                    {staff.first_name} {staff.last_name}
                  </h2>
                  <p>
                    <strong>Email :</strong> {staff.email}
                  </p>
                  <p>
                    <strong>Rôle :</strong> {staff.role || "Non défini"}
                  </p>
                  <p>
                    <strong>Statut du compte :</strong>{" "}
                    {staff.account_status || "Non défini"}
                  </p>
                </div>
                <div className="flex-row space-between align-center gap-15 mb-40">
                  <button
                    onClick={() => deleteStaff(id)}
                    className="btn-icon flex-row justify-center align-center color-dark"
                    aria-label="Supprimer"
                  >
                    <DeleteForeverIcon />
                  </button>
                  <button
                    onClick={() => navigate(`/modifier-staff/${id}`)}
                    className="btn-icon flex-row justify-center align-center color-dark"
                    aria-label="Modifier"
                  >
                    <ModeEditIcon />
                  </button>
                </div>
              </>
            ) : (
              <p>Staff introuvable</p>
            )}

            <Link to="/staff" className="btn-link flex-row align-center">
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

export default StaffDetails
