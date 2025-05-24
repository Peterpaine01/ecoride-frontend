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
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import CancelIcon from "@mui/icons-material/Cancel"
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb"
import PendingIcon from "@mui/icons-material/Pending"

const UserList = () => {
  const { token } = useContext(AuthContext)
  const navigate = useNavigate()
  const [usersList, setWebmastersList] = useState()
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await axios.get(`/users`)

      setWebmastersList(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const hardDeleteUser = async (id) => {
    try {
      await axios.delete(`/hard-delete-user/${id}`)
      fetchData()
    } catch (error) {
      console.error(
        "Erreur suppression :",
        error.response?.data?.error || error.message
      )
    }
  }

  const softDeleteUser = async (id) => {
    try {
      await axios.patch(`/soft-delete-user/${id}`)
      fetchData()
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
          <section>
            <h1>Utilisateur</h1>
            <hr className="mt-20 w-100 mb-20 " />
            <hr className="mt-20 w-100 mb-40" />

            {usersList &&
              usersList.map((user) => {
                console.log(user)

                return (
                  <div
                    key={user.id}
                    className="btn-arrow flex-row space-between align-center mb-20 gap-15"
                  >
                    <div
                      className="flex-row justify-left align-center 
                     gap-15 w-50"
                    >
                      <div>
                        {user.account_status === "pending" && (
                          <PendingIcon sx={{ color: "#ebae15" }} />
                        )}
                        {user.account_status === "active" && (
                          <CheckCircleIcon sx={{ color: "#42ba92" }} />
                        )}
                        {user.account_status === "suspended" && (
                          <DoNotDisturbIcon sx={{ color: "#678eae" }} />
                        )}
                        {user.account_status === "deleted" && (
                          <CancelIcon sx={{ color: "#e01700" }} />
                        )}
                      </div>
                      <div>{user.username}</div>
                    </div>

                    <div className="flex-row space-between align-center gap-15">
                      <button
                        onClick={() => navigate(`/utilisateur/${user.id}`)}
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

export default UserList
