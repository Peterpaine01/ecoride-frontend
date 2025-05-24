import { Link, useNavigate } from "react-router-dom"
import React, { useEffect, useState, useContext } from "react"
import axios from "../../config/axiosConfig"
import { AuthContext } from "../../context/AuthContext"

import Cookies from "js-cookie"

// Components
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import Cover from "../../components/Cover"

import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight"
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"
import ModeEditIcon from "@mui/icons-material/ModeEdit"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import CancelIcon from "@mui/icons-material/Cancel"
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb"
import PendingIcon from "@mui/icons-material/Pending"

const StaffList = () => {
  const { token } = useContext(AuthContext)
  const navigate = useNavigate()
  const [webmastersList, setWebmastersList] = useState()
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await axios.get(`/staff-members`)

      setWebmastersList(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const deleteStaff = async (id) => {
    try {
      await axios.delete(`/delete-staff-member/${id}`)
      fetchData() // recharge la liste
    } catch (error) {
      console.error(
        "Erreur suppression :",
        error.response?.data?.error || error.message
      )
    }
  }

  console.log("Token dans le cookie :", Cookies.get("token"))

  return (
    <>
      <Header />
      <Cover />
      <main>
        <div className="container">
          <section>
            <h1>Webmasters</h1>
            <div className="flex-column align-center">
              <hr className="mt-20 w-100 mb-20" />
              <button
                onClick={() => navigate("/ajouter-staff")}
                className="btn-solid fit-content"
              >
                Ajouter un webmaster
              </button>
              <hr className="mt-20 w-100 mb-40" />
            </div>

            {webmastersList &&
              webmastersList.map((webmaster) => {
                console.log(webmaster)

                return (
                  <div
                    key={webmaster.id}
                    className="btn-arrow flex-row space-between align-center mb-20 gap-15"
                  >
                    <div
                      className="flex-row justify-left align-center 
                     gap-15 w-50"
                    >
                      <div>
                        {webmaster.account_status === "pending" && (
                          <PendingIcon sx={{ color: "#ebae15" }} />
                        )}
                        {webmaster.account_status === "active" && (
                          <CheckCircleIcon sx={{ color: "#42ba92" }} />
                        )}
                        {webmaster.account_status === "suspended" && (
                          <DoNotDisturbIcon sx={{ color: "#678eae" }} />
                        )}
                        {webmaster.account_status === "deleted" && (
                          <CancelIcon sx={{ color: "#e01700" }} />
                        )}
                      </div>
                      <div>
                        {webmaster.first_name} {webmaster.last_name}
                      </div>
                    </div>

                    <div>
                      {webmaster.role === "administrator"
                        ? "Administrateur"
                        : "Modérateur"}
                    </div>
                    <div className="flex-row space-between align-center gap-15">
                      <button
                        onClick={() => deleteStaff(webmaster.account_id)}
                        className="btn-icon flex-row justify-center align-center color-dark"
                        aria-label="Supprimer"
                      >
                        <DeleteForeverIcon />
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/modifier-staff/${webmaster.account_id}`)
                        }
                        className="btn-icon flex-row justify-center align-center color-dark"
                        aria-label="Modifier"
                      >
                        <ModeEditIcon />
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/staff/${webmaster.account_id}`)
                        }
                        className="btn-icon flex-row justify-center align-center color-dark"
                        aria-label="Voir les détails"
                      >
                        <KeyboardArrowRightIcon />
                      </button>
                    </div>
                  </div>
                )
              })}
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default StaffList
