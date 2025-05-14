import { Link, useParams, useNavigate } from "react-router-dom"
import React, { useEffect, useState } from "react"
import axios from "../config/axiosConfig"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import Header from "../components/Header"
import Footer from "../components/Footer"
import Cover from "../components/Cover"
import Counter from "../components/Counter"

import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft"
import StarOutlineOutlinedIcon from "@mui/icons-material/StarOutlineOutlined"

const ReviewForm = () => {
  const { bookingId } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: "",
    note: 0,
    comment: "",
    wasRideOk: true,
    complain: "",
  })

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : name === "note" ? Number(value) : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const updatedFields = Object.fromEntries(
      Object.entries(formData).filter(
        ([_, value]) => value?.toString().trim() !== ""
      )
    )

    console.log("updatedFields", updatedFields)

    try {
      await axios.post(`/create-review/${bookingId}`, {
        reviewData: updatedFields,
      })
      toast.success("Votre avis a été soumis")
      setTimeout(() => navigate("/vos-trajets"), 1500)
    } catch (error) {
      toast.error(error.response?.data?.error || "Erreur lors de la soumission")
    }
  }

  console.log(formData)

  return (
    <>
      <Header />
      <Cover />
      <main>
        <div className="container">
          <section className="flex-column justify-center align-center">
            <h1>Publier un avis</h1>
            <h2 className="mb-40">Comment s'est déroulé votre trajet ?</h2>
            <form
              onSubmit={handleSubmit}
              className="form-full flex-column justify-center align-start gap-20"
            >
              <div className="dotted flex-column justify-left align-start gap-20">
                <div className="w-100 flex-column gap-15">
                  <label htmlFor="firstname">Titre</label>
                  <input
                    className="w-100 mb-20"
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Excellent !"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="criteria  flex-row space-between align-center gap-15 mb-20">
                  <div className="flex-row space-between align-center gap-5">
                    <StarOutlineOutlinedIcon
                      sx={{ color: "#f7c134", fontSize: 28 }}
                    />
                    <label>Noter ce trajet</label>
                  </div>

                  <Counter
                    name="note"
                    value={formData.note}
                    minValue={0}
                    maxValue={5}
                    onChange={handleChange}
                  />
                </div>

                <div className="w-100 flex-column gap-15">
                  <label htmlFor="comment">Ajouter un commentaire</label>
                  <textarea
                    className="w-100 mb-20"
                    type="text"
                    id="comment"
                    name="comment"
                    placeholder="Notre trajet a été très agréable..."
                    value={formData.comment}
                    onChange={handleChange}
                    rows="7"
                  />
                </div>

                <div className="criteria toggle  flex-row space-between align-center gap-15 mb-20">
                  <div className="flex-row space-between align-center gap-5">
                    <label>Trajet conforme à vos attentes ? </label>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      name="wasRideOk"
                      checked={formData.wasRideOk}
                      onChange={handleChange}
                    />
                    <span className="slider slider-red"></span>
                  </label>
                </div>
                {formData.wasRideOk === false && (
                  <div className="w-100 flex-column gap-15">
                    <label htmlFor="complain" className="color-warn">
                      Si le trajet vous a déplu, indiquez la raison :
                    </label>
                    <textarea
                      className="w-100 mb-20"
                      id="complain"
                      name="complain"
                      value={formData.complain}
                      onChange={handleChange}
                      rows="7"
                      style={{ borderColor: "#f75252" }}
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="btn-solid mt-20 align-self-center"
              >
                Soumettre
              </button>
            </form>
          </section>
        </div>
      </main>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  )
}

export default ReviewForm
