import { useContext, useEffect, useState, useCallback } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import axios from "../config/axiosConfig"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import Header from "../components/Header"
import Footer from "../components/Footer"
import Cover from "../components/Cover"
import PhotoProfil from "../components/PhotoProfil"

// Icones
import EnergySavingsLeafOutlinedIcon from "@mui/icons-material/EnergySavingsLeafOutlined"
import TransgenderOutlinedIcon from "@mui/icons-material/TransgenderOutlined"
import StarOutlineOutlinedIcon from "@mui/icons-material/StarOutlineOutlined"
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined"
import SmokingRoomsOutlinedIcon from "@mui/icons-material/SmokingRoomsOutlined"
import TollOutlinedIcon from "@mui/icons-material/TollOutlined"
import PetsOutlinedIcon from "@mui/icons-material/PetsOutlined"
import { ChevronLeft } from "react-feather"

const EditProfil = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { user } = useContext(AuthContext)

  const [formData, setFormData] = useState({
    username: "",
    gender: "",
    is_driver: 0,
    email: "",
    password: "",
    accept_smoking: 0,
    accept_animals: 0,
    photo: "",
  })

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`/user/${id}`)
        // console.log("data", data)

        const driver =
          data.is_driver === true ||
          data.is_driver === "true" ||
          data.is_driver === 1
            ? 1
            : 0

        const smoking =
          data.driverInfos?.accept_smoking === true ||
          data.driverInfos?.accept_smoking === "true" ||
          data.driverInfos?.accept_smoking === 1
            ? 1
            : 0

        const animals =
          data.driverInfos?.accept_animals === true ||
          data.driverInfos?.accept_animals === "true" ||
          data.driverInfos?.accept_animals === 1
            ? 1
            : 0

        setFormData({
          username: data.username,
          gender: data.gender,
          is_driver: driver,
          email: data.email,
          password: "",
          accept_smoking: smoking,
          accept_animals: animals,
          photo: data?.photo,
        })
      } catch (error) {
        toast.error("Erreur lors du chargement du profil utilisateur.")
        console.error(error)
      }
    }

    fetchUser()
  }, [id])

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const form = new FormData()
    Object.entries(formData).forEach(([key, value]) => form.append(key, value))

    if (formData.password) {
      form.append("password", formData.password)
    }

    try {
      await axios.patch(`/update-user/${id}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      toast.success("Profil mis à jour avec succès !")

      setTimeout(() => navigate("/profil"), 1500)
    } catch (err) {
      toast.error("Erreur lors de la mise à jour du profil.")
    }
  }

  return (
    <>
      <Header />
      <Cover />
      <main className="container">
        <section className="flex-column align-center">
          <h1 className="mb-20">Modifier mon profil</h1>

          <PhotoProfil photo={formData.photo} setFormData={setFormData} />

          <form
            onSubmit={handleSubmit}
            className="form-full flex-column gap-20"
          >
            <div className="dotted flex-column gap-20">
              <label htmlFor="username">Nom d'utilisateur</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />

              <label htmlFor="email">Adresse email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <label htmlFor="password">Nouveau mot de passe</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Laisser vide si inchangé"
                value={formData.password}
                onChange={handleChange}
              />

              <label htmlFor="gender">Je m'identifie comme :</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="custom-select-minimal"
              >
                <option value="">Sélectionner</option>
                <option value="male">Homme</option>
                <option value="female">Femme</option>
                <option value="other">Autre</option>
              </select>

              <div className="dotted">
                <h3 className="color-white mb-20">Sur Ecoride</h3>

                <div className="criteria toggle  flex-row space-between align-center gap-5 ">
                  <div className="flex-row space-between align-center gap-5">
                    <SmokingRoomsOutlinedIcon
                      sx={{ color: "#f7c134", fontSize: 28 }}
                    />
                    <label htmlFor="is_driver">
                      Je souhaite être conducteur
                    </label>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      name="is_driver"
                      id="is_driver"
                      checked={formData.is_driver === 1}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          is_driver: e.target.checked ? 1 : 0,
                        }))
                      }
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>

              {(user.is_driver || formData.is_driver === 1) && (
                <div className="dotted">
                  <h3 className="color-white mb-20">
                    Vos préférences en voiture
                  </h3>

                  <div className="criteria toggle  flex-row space-between align-center gap-5 mb-20">
                    <div className="flex-row space-between align-center gap-5">
                      <SmokingRoomsOutlinedIcon
                        sx={{ color: "#f7c134", fontSize: 28 }}
                      />
                      <label htmlFor="acceptSmoking">Véhicule fumeur</label>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        name="accept_smoking"
                        id="accept_smoking"
                        checked={formData.accept_smoking === 1}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            accept_smoking: e.target.checked ? 1 : 0,
                          }))
                        }
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="criteria toggle  flex-row space-between align-center gap-5 ">
                    <div className="flex-row space-between align-center gap-5">
                      <PetsOutlinedIcon
                        sx={{ color: "#f7c134", fontSize: 28 }}
                      />
                      <label htmlFor="acceptAnimals">Animaux acceptés</label>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        name="accept_animals"
                        id="accept_animals"
                        checked={formData.accept_animals === 1}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            accept_animals: e.target.checked ? 1 : 0,
                          }))
                        }
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              )}
            </div>
            <div className="flex-row align-center justify-center gap-15">
              <button onClick={() => navigate(-1)} className="btn-light mt-20">
                ← Retour
              </button>
              <button
                className="btn-solid mt-20 align-self-center"
                type="submit"
              >
                Mettre à jour
              </button>
            </div>
          </form>
        </section>
      </main>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  )
}

export default EditProfil
