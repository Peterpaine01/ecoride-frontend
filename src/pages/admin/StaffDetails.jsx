import React, { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import axios from "../../config/axiosConfig"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// Components
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import Cover from "../../components/Cover"

import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft"

const StaffDetails = () => {
  const { id } = useParams()
  const [staff, setStaff] = useState(null)
  const [loading, setLoading] = useState(true)

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

  console.log(staff)

  return (
    <>
      <Header />
      <Cover />
      <main>
        <div className="container">
          <section className="flex-column justify-center align-center">
            <h1 className="mb-20">Webmaster Infos</h1>

            {loading ? (
              <p>Chargement...</p>
            ) : staff ? (
              <div className="mb-40 dotted">
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
