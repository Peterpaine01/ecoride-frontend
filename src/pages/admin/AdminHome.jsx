import { Link } from "react-router-dom"
import React, { useEffect, useState } from "react"
import axios from "../../config/axiosConfig"

// Components
import Header from "../../components/Header"
import Cover from "../../components/Cover"
import Footer from "../../components/Footer"
import StatisticsChart from "../../components/StatisticsChart"

import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight"

const AdminHome = () => {
  const [data, setData] = useState()
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await axios.get(`/statistics/total`)

      setData(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <Header />
      <Cover />
      <main>
        <div className="container relative">
          <section className="mt-20">
            <div className="total-gains framed-white flex-column  absolute">
              <span className="flex-column align-end mb-10">
                Crédits{" "}
                <strong className="text-big">
                  {data && data.total_benefits}
                </strong>
              </span>
              <hr />
              <span className="mt-10 align-self-center">GAINS TOTAL</span>
            </div>
            <h1 className="mt-20">Espace Admin</h1>
            <h2>Statistiques</h2>
            <StatisticsChart />
          </section>
          <section>
            <h2>Comptes</h2>
            <hr className="mb-20" />
            <Link
              to={"/staff"}
              className="btn-arrow flex-row space-between align-center mb-20"
            >
              Webmasters <KeyboardArrowRightIcon />
            </Link>
            <Link
              to={"/utilisateurs"}
              className="btn-arrow flex-row space-between align-center"
            >
              Utilisateurs <KeyboardArrowRightIcon />
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default AdminHome
