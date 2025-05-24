import { useNavigate, useParams, Link } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "../config/axiosConfig"

// Components
import Header from "../components/Header"
import Footer from "../components/Footer"
import Cover from "../components/Cover"

const CarDetails = () => {
  const { id } = useParams()
  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const navigate = useNavigate()

  useEffect(() => {
    const fetchCar = async () => {
      try {
        console.log(id)
        const response = await axios.get(`/car/${id}`)
        setCar(response.data)
      } catch (err) {
        setError("Erreur lors du chargement des informations du véhicule.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCar()
  }, [id])

  return (
    <>
      <Header />
      <Cover />
      <main>
        <div className="container">
          {error && <p className="text-red-500">{error}</p>}

          {car && (
            <section className="flex-column justify-center align-center">
              <h1 className="color-primary p-0 mb-40">
                Détails du véhicule {car.registration_number}
              </h1>
              <div className="card fit-content">
                <ul className=" dotted details-list color-white">
                  <li className="mb-20">
                    <strong className="color-primary">Marque :</strong>{" "}
                    {car.brand}
                  </li>
                  <li className="mb-20">
                    <strong className="color-primary">Modèle :</strong>{" "}
                    {car.model}
                  </li>
                  <li className="mb-20">
                    <strong className="color-primary">Immatriculation :</strong>{" "}
                    {car.registration_number}
                  </li>
                  <li className="mb-20">
                    <strong className="color-primary">
                      Date de première immatriculation :
                    </strong>{" "}
                    {new Date(car.first_registration_date).toLocaleDateString(
                      "fr-FR"
                    )}
                  </li>
                  <li className="mb-20">
                    <strong className="color-primary">Couleur :</strong>{" "}
                    {car.color}
                  </li>
                  <li className="mb-20">
                    <strong className="color-primary">
                      Nombre de places disponibles :
                    </strong>{" "}
                    {car.available_seats}
                  </li>
                  <li>
                    <strong className="color-primary">Carburant :</strong>{" "}
                    {car.energy}
                  </li>
                </ul>
              </div>
              <button onClick={() => navigate(-1)} className="btn-light mt-20">
                ← Retour
              </button>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

export default CarDetails
