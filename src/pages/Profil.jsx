import { Link } from "react-router-dom"
import Cookies from "js-cookie"
import React, { useEffect, useState, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import axios from "../config/axiosConfig"

// Components
import Header from "../components/Header"
import Footer from "../components/Footer"
import Cover from "../components/Cover"
import StarRating from "../components/StarRating"
import ReviewsCard from "../components/ReviewsCard"

import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight"
import ArrowRightAltOutlinedIcon from "@mui/icons-material/ArrowRightAltOutlined"
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined"
import EnergySavingsLeafOutlinedIcon from "@mui/icons-material/EnergySavingsLeafOutlined"
import SmokingRoomsOutlinedIcon from "@mui/icons-material/SmokingRoomsOutlined"
import SmokeFreeOutlinedIcon from "@mui/icons-material/SmokeFreeOutlined"
import PetsOutlinedIcon from "@mui/icons-material/PetsOutlined"
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined"
import DirectionsCarFilledOutlinedIcon from "@mui/icons-material/DirectionsCarFilledOutlined"
import TollOutlinedIcon from "@mui/icons-material/TollOutlined"
import GroupIcon from "@mui/icons-material/Group"
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"

const Profil = () => {
  const { user, login, logout, isAuthenticated, token } =
    useContext(AuthContext)
  console.log(user)
  const [userReviewsList, setUserReviewsList] = useState([])
  const [activeTab, setActiveTab] = useState("infos")
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/reviews-driver/${user.account_id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          )

          if (!response.ok) {
            throw new Error("Network response was not ok")
          }
          const data = await response.json()

          console.log("Reviews data:", data)

          // Filtrer les reviews publiées ici
          const publishedReviews = (data || []).filter(
            (review) => review.isPublished
          )

          setUserReviewsList(publishedReviews)
        } catch (error) {
          console.error("Error fetching reviews:", error)
        }
      }
    }

    fetchData()
  }, [token, user])

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return (
    <>
      <Header />
      <Cover />
      {user ? (
        <main>
          <div className="container profile">
            {!isMobile && (
              <section>
                <div className="profile-header">
                  <div className="flex-row gap-15">
                    <div className="profil-icon user-logged">
                      <img src={user.photo} alt={`Photo de ${user.username}`} />
                    </div>
                    <div className="profile">
                      <h1 className="capitalize">{user.username}</h1>
                      <StarRating rating={user.driverInfos.average_rating} />
                    </div>
                  </div>
                  <Link
                    to="/"
                    className="edit-profile btn-link flex-row align-center"
                  >
                    <span>Modifier le profil</span> <KeyboardArrowRightIcon />
                  </Link>
                </div>
              </section>
            )}

            {isMobile && (
              <section className="mobile-tabs">
                <button
                  className={activeTab === "infos" ? "active" : ""}
                  onClick={() => setActiveTab("infos")}
                >
                  Infos
                </button>
                <button
                  className={activeTab === "account" ? "active" : ""}
                  onClick={() => setActiveTab("account")}
                >
                  Compte
                </button>
              </section>
            )}

            <section className="filters-layout flex-row">
              <aside
                className={`one-third-column ${
                  isMobile && activeTab !== "account" ? "hidden-mobile" : ""
                }`}
              >
                <div className="sidebar flex-column gap-15">
                  {!isMobile && <h2>Compte</h2>}

                  <nav className="menu">
                    <ul>
                      <li className="mb-10">
                        <Link
                          to="/"
                          className="btn-link flex-row align-center space-between"
                        >
                          Mot de passe <KeyboardArrowRightIcon />
                        </Link>
                      </li>
                      <li className="mb-10">
                        <Link
                          to="/"
                          className="btn-link flex-row align-center space-between"
                        >
                          Conditions générales <KeyboardArrowRightIcon />
                        </Link>
                      </li>
                      <li className="mb-10">
                        <Link
                          to="/"
                          className="btn-link flex-row align-center space-between"
                        >
                          Protections des données <KeyboardArrowRightIcon />
                        </Link>
                      </li>
                      <li className="mb-10">
                        <Link
                          to="/"
                          className="btn-link flex-row align-center space-between"
                        >
                          Fermer le compte
                          <KeyboardArrowRightIcon />
                        </Link>
                      </li>
                    </ul>
                  </nav>
                  <button
                    onClick={logout}
                    to={"/se-connecter"}
                    className="btn-solid align-self-center w-100"
                  >
                    Se déconnecter
                  </button>
                </div>
              </aside>
              <div
                className={`user-infos ${
                  isMobile && activeTab !== "infos" ? "hidden-mobile" : ""
                }`}
              >
                {isMobile && (
                  <div className="profile-header-mobile">
                    <div className="flex-row gap-15">
                      <div className="profil-icon user-logged">
                        <img
                          src={user.photo}
                          alt={`Photo de ${user.username}`}
                        />
                      </div>
                      <div className="profile">
                        <h1 className="capitalize">{user.username}</h1>
                        <StarRating rating={user.driverInfos.average_rating} />
                      </div>
                    </div>
                  </div>
                )}
                <h2 className="mt-20">Présentez-vous</h2>
                <div className="row">
                  <div className="profile-info">
                    <p>
                      <span className="text-big">{user.credits}</span> crédits
                    </p>
                    <p>Email : {user.email}</p>
                    <p className="gender">
                      Je m'identifie comme{" "}
                      <strong>
                        {user.gender === "other"
                          ? "autre"
                          : user.gender === "female"
                          ? "femme"
                          : "homme"}
                      </strong>
                    </p>
                  </div>
                  <div className="ecoride">
                    <h3 className="mb-20">SUR ECORIDE</h3>
                    {user.is_driver && <p> Je suis chauffeur</p>}
                    <p> Je suis passager</p>
                  </div>
                </div>
                <div className="row">
                  <div className="preferences">
                    <h3 className="mb-20">VOS PRÉFÉRENCES</h3>

                    {user && user.driverInfos?.accept_smoking === 0 ? (
                      <p className="flex-row justify-start align-center gap-5">
                        <SmokeFreeOutlinedIcon
                          sx={{ color: "#f7c134", fontSize: 28 }}
                        />{" "}
                        Véhicule non fumeur
                      </p>
                    ) : (
                      <p className="flex-row justify-start align-center gap-5">
                        <SmokingRoomsOutlinedIcon
                          sx={{ color: "#f7c134", fontSize: 28 }}
                        />{" "}
                        Véhicule fumeur
                      </p>
                    )}

                    {user && user.driverInfos?.accept_animals === 0 ? (
                      <p className="flex-row justify-start align-center gap-5">
                        <BlockOutlinedIcon
                          sx={{ color: "#f7c134", fontSize: 28 }}
                        />
                        Animaux non admis
                      </p>
                    ) : (
                      <p className="flex-row justify-start align-center gap-5">
                        <PetsOutlinedIcon
                          sx={{ color: "#f7c134", fontSize: 28 }}
                        />{" "}
                        Animaux bienvenus !
                      </p>
                    )}
                  </div>
                  {isMobile && (
                    <div className="actions-profile flex-row">
                      <button className="btn-solid w-100">
                        Modier le profile
                      </button>
                    </div>
                  )}
                  <div className="vehicles flex-column">
                    <h3 className="mb-40">VOS VÉHICULES</h3>
                    {user &&
                      user.driverInfos.cars.map((car) => {
                        return (
                          <Link
                            key={car.id}
                            className="vehicle flex-row mb-10 align-center space-between gap-15"
                          >
                            <div className="flex-row align-center justify-start gap-15">
                              <p className="flex-row align-center justify-start gap-5">
                                <DirectionsCarFilledOutlinedIcon
                                  sx={{ color: "#002340", fontSize: 24 }}
                                />
                              </p>
                              <div className="flex-column justify-left">
                                <p className="flex-row align-center justify-start">
                                  {car
                                    ? `${car.model} - ${car.registration_number}`
                                    : "Non renseigné"}
                                </p>
                                <p className="text-tiny">{car && car.color}</p>
                              </div>
                            </div>

                            <KeyboardArrowRightIcon
                              sx={{ color: "#002340", fontSize: 24 }}
                            />
                          </Link>
                        )
                      })}

                    <button className="btn-link mt-20 flex-row align-center gap-5">
                      <AddCircleOutlineIcon /> Ajouter un véhicule
                    </button>
                  </div>
                </div>
                {userReviewsList.length > 0 && (
                  <div className="row">
                    <div className="reviews">
                      <h3 className="mb-40">AVIS</h3>
                      <div className="last-reviews">
                        {userReviewsList
                          .filter((review) => review.isPublished)
                          .slice(0, 2)
                          .map((review, index) => (
                            <ReviewsCard key={review._id} reviewData={review} />
                          ))}
                      </div>
                      <Link
                        to="/"
                        className="edit-profile btn-link flex-row align-center mt-40"
                      >
                        <span>Tous les avis</span> <KeyboardArrowRightIcon />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </main>
      ) : (
        <p>Loading</p>
      )}

      <Footer />
    </>
  )
}

export default Profil
