import { Link, useParams } from "react-router-dom"
import { useState, useEffect, useContext, useRef } from "react"

import {
  Calendar,
  MapPin,
  Target,
  Clock,
  Users,
  CreditCard,
  Edit,
  Truck,
} from "react-feather"

import { displayDuration } from "../utils/dateTimeHandler"
import StarRating from "../components/StarRating"

import ArrowRightAltOutlinedIcon from "@mui/icons-material/ArrowRightAltOutlined"
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined"
import EnergySavingsLeafOutlinedIcon from "@mui/icons-material/EnergySavingsLeafOutlined"
import SmokingRoomsOutlinedIcon from "@mui/icons-material/SmokingRoomsOutlined"
import SmokeFreeOutlinedIcon from "@mui/icons-material/SmokeFreeOutlined"
import PetsOutlinedIcon from "@mui/icons-material/PetsOutlined"
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined"
import DirectionsCarFilledOutlinedIcon from "@mui/icons-material/DirectionsCarFilledOutlined"
import UpdateOutlinedIcon from "@mui/icons-material/UpdateOutlined"

import { MapContainer, TileLayer, Polyline } from "react-leaflet"
import "leaflet/dist/leaflet.css"

import MapMarker from "../components/MapMarker"

// Utils
import {
  getCoordinates,
  reverseGeocode,
  calculateRoute,
} from "../utils/geolocation"

const RoadMap = ({ rideDetail }) => {
  const [routeCoords, setRouteCoords] = useState([])

  const formatDateToFrench = (isoDate) => {
    if (!isoDate) return ""
    const date = new Date(isoDate)
    const formatted = date.toLocaleString("fr-FR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    })

    useEffect(() => {
      const fetchRoute = async () => {
        try {
          const result = await calculateRoute(
            rideDetail.departureAddress.coords,
            rideDetail.destinationAddress.coords
          )
          setRouteCoords(result.routeCoords)
        } catch (err) {
          console.error(err)
          console.log("Erreur lors du calcul de l’itinéraire")
        }
      }

      fetchRoute()
    }, [])

    return formatted.charAt(0).toUpperCase() + formatted.slice(1)
  }

  const formatTimeToFrench = (isoDate) => {
    if (!isoDate) return ""
    const date = new Date(isoDate)
    const formatted = date.toLocaleString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    })
    const formattedDate = formatted.split(":")

    return formattedDate[0] + "h" + formattedDate[1]
  }

  return (
    <div className="container ride-details">
      <section className="flex-column justify-center align-center">
        <h1 className="flex-row justify-center align-center">
          {rideDetail.departureAddress.city}{" "}
          <ArrowRightAltOutlinedIcon sx={{ color: "#f7c134", fontSize: 38 }} />{" "}
          {rideDetail.destinationAddress.city}
        </h1>
        <h2>{formatDateToFrench(rideDetail.departureDate)}</h2>
        <div className="flex-row justify-center align-center gap-15">
          <div className="dotted w-fit flex-column justify-center align-start">
            <AccessTimeOutlinedIcon sx={{ color: "#f7c134", fontSize: 18 }} />
            <small>DÉPART</small>
            <p
              className="flex-row justify-center align-center"
              style={{ "font-size": 22 }}
            >
              {formatTimeToFrench(rideDetail.departureDate)}
            </p>
          </div>
          <div className="flex-column align-start">
            {rideDetail.driver?.accept_smoking === 0 ? (
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
            {rideDetail.driver?.accept_animals === 0 ? (
              <p className="flex-row justify-start align-center gap-5">
                <BlockOutlinedIcon sx={{ color: "#f7c134", fontSize: 28 }} />
                Animaux non admis
              </p>
            ) : (
              <p className="flex-row justify-start align-center gap-5">
                <PetsOutlinedIcon sx={{ color: "#f7c134", fontSize: 28 }} />{" "}
                Animaux bienvenus !
              </p>
            )}
            {rideDetail.car?.energy === "Électricité" && (
              <p className="flex-row justify-start align-center gap-5">
                <EnergySavingsLeafOutlinedIcon
                  sx={{ color: "#f7c134", fontSize: 28 }}
                />{" "}
                Voyage écologique
              </p>
            )}
          </div>
        </div>
      </section>

      <section>
        <div className="flex-row justify-start align-center gap-15">
          <div className="driver-infos flex-row space-between align-center gap-15 mb-20">
            <div className="profil-icon">
              {rideDetail.driver?.photo ? (
                <img
                  src={rideDetail.driver.photo}
                  alt="photo profil par défaut"
                />
              ) : (
                <div className="default-icon" />
              )}
            </div>
            <div className="flex-column gap-5">
              <p className="text-bold">
                {rideDetail.driver?.username || "Conducteur inconnu"}
              </p>
              {rideDetail.driver?.average_rating && (
                <StarRating rating={rideDetail.driver.average_rating} />
              )}
              {rideDetail.driver?.total_reviews > 0 && (
                <Link to={"/"}>
                  <small>{rideDetail.driver?.total_reviews} avis</small>
                </Link>
              )}
              <Link to={"/"} className="link mt-5">
                {rideDetail.driver?.total_reviews} avis
              </Link>
            </div>
          </div>
        </div>
        <div className="flex-row two-column align-start w-100">
          <div className="block-left flex-column align-start">
            <div className="flex-column mb-10 dotted">
              <div className="detail">
                <h3 className="flex-row align-center gap-5 color-secondary">
                  <strong className="color-yellow">
                    <MapPin size={20} />
                  </strong>
                  <strong className="flex-row align-center">
                    Adresse de départ
                  </strong>
                </h3>
                <p>
                  {rideDetail.departureAddress.street}{" "}
                  {rideDetail.departureAddress.zip}{" "}
                  {rideDetail.departureAddress.city}
                </p>
              </div>
              <div className="detail">
                <h3 className="flex-row align-center gap-5 color-secondary">
                  <strong className="color-yellow">
                    <Target size={20} />
                  </strong>
                  Adresse de destination
                </h3>
                <p>
                  {rideDetail.destinationAddress.street}{" "}
                  {rideDetail.destinationAddress.zip}{" "}
                  {rideDetail.destinationAddress.city}
                </p>
              </div>
            </div>
            <div className="flex-row mb-10 dotted justify-around">
              <div className="w-fit flex-column justify-center align-start">
                <AccessTimeOutlinedIcon
                  sx={{ color: "#f7c134", fontSize: 18 }}
                />
                <small>CRÉDITS</small>
                <p
                  className="flex-row justify-center align-center"
                  style={{ "font-size": 22 }}
                >
                  {rideDetail.creditsPerPassenger}
                </p>
              </div>
              <div className="w-fit flex-column justify-center align-start">
                <strong className="color-yellow">
                  <Users size={18} />
                </strong>
                <small>PLACES</small>
                <p
                  className="flex-row justify-center align-center"
                  style={{ "font-size": 22 }}
                >
                  {rideDetail.availableSeats}
                </p>
              </div>
              <div className="w-fit flex-column justify-center align-start">
                <UpdateOutlinedIcon sx={{ color: "#f7c134", fontSize: 18 }} />
                <small>DURÉE</small>
                <p
                  className="flex-row justify-center align-center"
                  style={{ "font-size": 22 }}
                >
                  {displayDuration(rideDetail.duration)}
                </p>
              </div>
            </div>
            <div className="flex-column mb-10 dotted">
              <h3 className="flex-row align-center gap-5 color-secondary">
                <strong className="color-yellow">
                  <Edit size={20} />
                </strong>
                Description
              </h3>
              <p>{rideDetail.description}</p>
            </div>
            <div className="flex-row mb-10 dotted align-center justify-start gap-15">
              <p className="flex-row align-center justify-start gap-5">
                <DirectionsCarFilledOutlinedIcon
                  sx={{ color: "#f7c134", fontSize: 24 }}
                />
                {rideDetail.car
                  ? `${rideDetail.car.model} - ${rideDetail.car.registration_number}`
                  : "Non sélectionné"}
              </p>
              <p className="text-tiny">
                {rideDetail.car && rideDetail.car.color}
              </p>
            </div>
          </div>
          <div className="block-right">
            <MapContainer
              center={rideDetail.departureAddress.coords || [48.8566, 2.3522]}
              zoom={13}
              style={{ minHeight: "300px", aspectRatio: 1 }}
              className="map"
            >
              <TileLayer
                attribution="&copy; OpenStreetMap"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <MapMarker
                position={rideDetail.departureAddress.coords}
                label="Départ"
              />
              <MapMarker
                position={rideDetail.destinationAddress.coords}
                label="Arrivée"
              />
              {routeCoords.length > 0 && (
                <Polyline positions={routeCoords} color="blue" />
              )}
            </MapContainer>
          </div>
        </div>
      </section>
    </div>
  )
}

export default RoadMap
