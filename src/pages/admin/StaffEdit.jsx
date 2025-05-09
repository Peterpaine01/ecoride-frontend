import { Link } from "react-router-dom"
import React, { useEffect, useState } from "react"
import axios from "../../config/axiosConfig"

// Components
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import Cover from "../../components/Cover"

import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight"
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"
import ModeEditIcon from "@mui/icons-material/ModeEdit"

const StaffList = () => {
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

  return (
    <>
      <Header />
      <Cover />
      <main>
        <div className="container">
          <section>
            <h1>Modifier un webmaster</h1>

            {webmastersList &&
              webmastersList.map((webmaster) => {
                console.log(webmaster)

                return (
                  <div
                    key={webmaster.id}
                    className="btn-arrow flex-row space-between align-center mb-20 gap-15"
                  >
                    <div className="w-50">
                      {webmaster.first_name} {webmaster.last_name}
                    </div>
                    <div>
                      {webmaster.first_role === "administrator"
                        ? "Administrateur"
                        : "Modérateur"}
                    </div>
                    <div className="flex-row space-between align-center gap-15">
                      <button className="btn-icon flex-row justify-center align-center color-dark">
                        <DeleteForeverIcon />
                      </button>
                      <button className="btn-icon flex-row justify-center align-center color-dark">
                        <ModeEditIcon />
                      </button>
                      <button className="btn-icon flex-row justify-center align-center color-dark">
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
