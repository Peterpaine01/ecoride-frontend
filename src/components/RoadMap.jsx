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

// Utils
import {
  getCoordinates,
  reverseGeocode,
  calculateRoute,
} from "../utils/geolocation"
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
import TollOutlinedIcon from "@mui/icons-material/TollOutlined"
import GroupIcon from "@mui/icons-material/Group"

import { MapContainer, TileLayer, Polyline } from "react-leaflet"
import "leaflet/dist/leaflet.css"

import MapMarker from "../components/MapMarker"

const RoadMap = ({ rideDetail }) => {
  const [routeCoords, setRouteCoords] = useState([])
  const [map, setMap] = useState(null)

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
          console.log(result)

          setRouteCoords(result.routeCoords)
        } catch (err) {
          console.error(err)
          console.log("Erreur lors du calcul de l’itinéraire")
        }
      }

      fetchRoute()
    }, [rideDetail])

    useEffect(() => {
      if (map && routeCoords.length > 0) {
        const bounds =
          routeCoords.length === 1
            ? map.getBounds().extend(routeCoords[0]) // fallback pour un seul point
            : routeCoords
        map.fitBounds(bounds, { padding: [20, 20] })
      }
    }, [map, routeCoords])

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

  const getTimeFromDate = (date) => {
    const formattedDate = new Date(Date.parse(date))

    const hours = String(formattedDate.getHours()).padStart(2, "0")
    const minutes = String(formattedDate.getMinutes()).padStart(2, "0")

    return `${hours}:${minutes}`
  }

  const setArrivalDate = (date, duration) => {
    const formattedDate = new Date(Date.parse(date))

    if (typeof duration !== "number" || isNaN(duration)) {
      throw new Error("Duration must be a number.")
    }

    const newDate = new Date(formattedDate.getTime() + duration * 60000)
    return newDate
  }

  const arrivalDate = setArrivalDate(
    rideDetail.departureDate,
    rideDetail.duration
  )

  return (
    <>
      <div className="container-full ride-details">
        <section className="flex-column justify-center align-center bg-secondary">
          <div className="flex-column"></div>
          <h1 className="flex-row justify-center align-center">
            {formatDateToFrench(rideDetail.departureDate)}
          </h1>
          <div className="flex-row justify-center align-center gap-15">
            <div className="flex-column align-start">
              {rideDetail?.availableSeats && (
                <p className="flex-row justify-start align-center gap-5 color-dark">
                  <GroupIcon sx={{ color: "#023560", fontSize: 28 }} />{" "}
                  {rideDetail.availableSeats} place
                  {rideDetail.availableSeats > 1 && "s"} disponible
                  {rideDetail.availableSeats > 1 && "s"}
                </p>
              )}
            </div>
          </div>

          <div className="roadmap-card flex-row space-between">
            <div className="ride-card flex-column">
              <div className="info-ride flex-row justify-left">
                <div className="hours flex-column space-between">
                  <p>
                    {rideDetail.departureDate
                      ? getTimeFromDate(rideDetail.departureDate)
                      : "--:--"}
                  </p>
                  <p>
                    {rideDetail.departureDate &&
                    typeof rideDetail.duration === "number"
                      ? getTimeFromDate(arrivalDate)
                      : "--:--"}
                  </p>
                </div>
                <div className="timing flex-row">
                  <div className="ride-line">
                    <span className="round"></span>
                    <span className="timeline"></span>
                    <span className="round"></span>
                  </div>
                </div>
                <div className="cities flex-column space-between">
                  <p>{rideDetail.departureAddress?.city || "Ville inconnue"}</p>
                  <div className="timing">
                    <p>
                      {typeof rideDetail.duration === "number"
                        ? displayDuration(rideDetail.duration)
                        : "Durée inconnue"}
                    </p>
                  </div>

                  <p>
                    {rideDetail.destinationAddress?.city || "Ville inconnue"}
                  </p>
                </div>
              </div>
            </div>
            <div className="dotted w-fit flex-column justify-center align-start">
              <TollOutlinedIcon sx={{ color: "#42ba92", fontSize: 24 }} />
              <small className="color-dark">
                CRÉDITS <br />
                par passager
              </small>
              <p
                className="flex-row justify-center align-center color-dark"
                style={{ fontSize: 24 }}
              >
                <strong>{rideDetail.creditsPerPassenger}</strong>
              </p>
            </div>
          </div>
        </section>
      </div>
      <div className="container ride-details">
        <section>
          <div className="flex-row two-column align-start w-100">
            <div className="block-left flex-column align-start">
              <div className="flex-column mb-10 dotted justify-left">
                <h3 className="flex-row align-center gap-5 color-secondary mb-20">
                  {rideDetail.driver?.gender === "male" ||
                  rideDetail.driver?.gender === "other"
                    ? "Conducteur"
                    : "Conductrice"}
                </h3>
                <div className="driver-infos flex-row justify-left align-center gap-15 ">
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
                    {rideDetail.driver?.total_reviews.length > 0 ? (
                      <Link to={"/"} className="link mt-5">
                        {rideDetail.driver?.total_reviews} avis
                      </Link>
                    ) : (
                      <p className="text-tiny">Pas encore d'avis</p>
                    )}
                  </div>
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
                <hr className="mt-20 mb-10" />

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
                    <BlockOutlinedIcon
                      sx={{ color: "#f7c134", fontSize: 28 }}
                    />
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
                      sx={{ color: "#42ba92", fontSize: 28 }}
                    />{" "}
                    Voyage écologique
                  </p>
                )}
              </div>
              <div className="flex-row mb-10 dotted align-center justify-start gap-15">
                <p className="flex-row align-center justify-start gap-5">
                  <DirectionsCarFilledOutlinedIcon
                    sx={{ color: "#f7c134", fontSize: 24 }}
                  />
                </p>
                <div className="flex-column justify-left">
                  <p className="flex-row align-center justify-start">
                    {rideDetail.car
                      ? `${rideDetail.car.model} - ${rideDetail.car.registration_number}`
                      : "Non renseigné"}
                  </p>
                  <p className="text-tiny">
                    {rideDetail.car && rideDetail.car.color}
                  </p>
                </div>
              </div>
            </div>
            <div className="block-right">
              <MapContainer
                center={rideDetail.departureAddress.coords || [48.8566, 2.3522]}
                zoom={13}
                style={{ minHeight: "300px", aspectRatio: 1 }}
                ref={setMap}
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
    </>
  )
}

export default RoadMap
