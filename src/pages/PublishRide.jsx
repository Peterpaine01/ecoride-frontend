import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import MapGL, { Marker } from "react-map-gl";
import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding";
import mbxDirections from "@mapbox/mapbox-sdk/services/directions";
//import "mapbox-gl/lib/mapbox-gl.css";

import axios from "../config/axiosConfig";

// Components
import Header from "../components/Header";
import Cover from "../components/Cover";
import Footer from "../components/Footer";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: MAPBOX_TOKEN });
const directionsClient = mbxDirections({ accessToken: MAPBOX_TOKEN });

const PublishRide = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    departureDate: "",
    departureAddress: { street: "", city: "", zip: "", coords: null },
    destinationAddress: { street: "", city: "", zip: "", coords: null },
    duration: "",
    availableSeats: "",
    creditsPerPassenger: "",
    description: "",
  });

  const [mapView, setMapView] = useState({
    longitude: 2.3522,
    latitude: 48.8566,
    zoom: 10,
  });
  const [marker, setMarker] = useState(null);

  const { user } = useContext(AuthContext);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  // const handleAddressSelect = async (query, type) => {
  //   const response = await geocodingClient
  //     .forwardGeocode({ query, limit: 1 })
  //     .send();
  //   if (response.body.features.length > 0) {
  //     const place = response.body.features[0];
  //     setFormData({
  //       ...formData,
  //       [type]: {
  //         street: place.text,
  //         city: place.context?.find((c) => c.id.includes("place"))?.text || "",
  //         zip:
  //           place.context?.find((c) => c.id.includes("postcode"))?.text || "",
  //         coords: place.center,
  //       },
  //     });
  //   }
  // };

  const handleAddressSelect = async (query, type) => {
    const response = await geocodingClient
      .forwardGeocode({ query, limit: 1 })
      .send();
    if (response.body.features.length > 0) {
      const place = response.body.features[0];
      const newCoords = place.center;

      setFormData((prev) => ({
        ...prev,
        [type]: {
          street: place.text,
          city: place.context?.find((c) => c.id.includes("place"))?.text || "",
          zip:
            place.context?.find((c) => c.id.includes("postcode"))?.text || "",
          coords: newCoords,
        },
      }));

      setMarker(newCoords);
      setMapView({ longitude: newCoords[0], latitude: newCoords[1], zoom: 14 });
    }
  };

  const calculateDuration = async () => {
    if (
      formData.departureAddress.coords &&
      formData.destinationAddress.coords
    ) {
      const response = await directionsClient
        .getDirections({
          profile: "driving",
          waypoints: [
            { coordinates: formData.departureAddress.coords },
            { coordinates: formData.destinationAddress.coords },
          ],
          geometries: "geojson",
        })
        .send();
      if (response.body.routes.length > 0) {
        setFormData({
          ...formData,
          duration: Math.round(response.body.routes[0].duration / 60),
        });
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      if (name === "departureDate") {
        const existingTime = prev.departureDate.split("T")[1] || "00:00";
        return {
          ...prev,
          departureDate: `${value}T${existingTime}`,
        };
      }

      if (name === "departureTime") {
        const existingDate =
          prev.departureDate.split("T")[0] ||
          new Date().toISOString().split("T")[0];
        return {
          ...prev,
          departureDate: `${existingDate}T${value}`,
        };
      }

      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/create-ride", formData);

      if (response.status === 201 || response.status === 200) {
        console.log("Le ride a bien été créé");
        navigate("/vos-trajets");
      }
    } catch (error) {
      console.error("Error creating ride :", error);
      alert("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  console.log(user);

  useEffect(() => {
    if (step === 3) {
      calculateDuration();
    }

    if (step === 6) {
      const fetchVehicles = async () => {
        try {
          const response = await axios.get(`/user-cars/${user.account_id}`);
          console.log("data cars : ", response.data[0]);

          setVehicles(response.data);
        } catch (error) {
          console.error("Error fetching cars :", error);
        }
      };

      fetchVehicles();
    }
  }, [step]);

  console.log("formData", formData);

  return (
    <>
      <Header />
      <Cover />
      <main>
        <div className="section">
          <h1>Nouveau trajet</h1>
        </div>
        <div className="section">
          <div className="content-form">
            {step === 1 && (
              <div>
                <label>Adresse de départ :</label>
                <input
                  type="text"
                  placeholder="Saisir une adresse"
                  autoComplete="on"
                  onBlur={(e) =>
                    handleAddressSelect(e.target.value, "departureAddress")
                  }
                />
                <MapGL
                  {...mapView}
                  style={{ width: "100%", height: "300px" }}
                  mapStyle="mapbox://styles/mapbox/streets-v11"
                  mapboxAccessToken={MAPBOX_TOKEN}
                  onMove={(evt) => setMapView(evt.viewState)}
                >
                  {/* {formData.departureAddress.coords && (
                    <Marker
                      longitude={formData.departureAddress.coords[0]}
                      latitude={formData.departureAddress.coords[1]}
                    />
                  )} */}
                  {marker && (
                    <Marker longitude={marker[0]} latitude={marker[1]} />
                  )}
                </MapGL>
              </div>
            )}
            {step === 2 && (
              <div>
                <label>Adresse de destination :</label>
                <input
                  type="text"
                  placeholder="Saisir une adresse"
                  autoComplete="on"
                  onBlur={(e) =>
                    handleAddressSelect(e.target.value, "destinationAddress")
                  }
                />
                <MapGL
                  initialViewState={mapView}
                  style={{ width: "100%", height: "300px" }}
                  mapStyle="mapbox://styles/mapbox/streets-v11"
                  mapboxAccessToken={MAPBOX_TOKEN}
                  onMove={(evt) => setMapView(evt.viewState)}
                >
                  {formData.destinationAddress.coords && (
                    <Marker
                      longitude={formData.destinationAddress.coords[0]}
                      latitude={formData.destinationAddress.coords[1]}
                    />
                  )}
                  {/* {marker && (
                    <Marker longitude={marker[0]} latitude={marker[1]} />
                  )} */}
                </MapGL>
              </div>
            )}
            {step === 3 && (
              <div>
                <p>
                  Durée estimée :
                  {formData.duration
                    ? `${formData.duration} minutes`
                    : "Calcul en cours..."}
                </p>
              </div>
            )}
            {/* Étape 4 : Date de départ */}
            {step === 4 && (
              <div>
                <label>Date de départ :</label>
                <input
                  type="date"
                  name="departureDate"
                  value={formData.departureDate.split("T")[0] || ""}
                  onChange={handleChange}
                />
              </div>
            )}

            {/* Étape 5 : Heure de départ */}
            {step === 5 && (
              <div>
                <label>Heure de départ :</label>
                <input
                  type="time"
                  name="departureTime"
                  value={formData.departureDate.split("T")[1] || ""}
                  onChange={handleChange}
                />
              </div>
            )}

            {/* Étape 6 : Véhicule */}
            {step === 6 && (
              <div>
                <label>Véhicule :</label>
                <select
                  name="vehicleId"
                  value={formData.vehicleId || ""}
                  onChange={handleChange}
                >
                  <option value="">Sélectionnez un véhicule</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.model} - {vehicle.registration_number}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Étape 7 : Nombre de passagers */}
            {step === 7 && (
              <div>
                <label>Nombre de places disponibles :</label>
                <input
                  type="number"
                  name="availableSeats"
                  value={formData.availableSeats}
                  onChange={handleChange}
                />
              </div>
            )}

            {/* Étape 8 : Nombre de crédits par passager */}
            {step === 8 && (
              <div>
                <label>Crédits par passager :</label>
                <input
                  type="number"
                  name="creditsPerPassenger"
                  value={formData.creditsPerPassenger}
                  onChange={handleChange}
                />
              </div>
            )}

            {/* Étape 9 : Description */}
            {step === 9 && (
              <div>
                <label>Description :</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>
            )}
          </div>
          {/* Navigation entre les étapes */}
          <div>
            {step > 1 && <button onClick={prevStep}>Précédent</button>}
            {step < 9 ? (
              <button onClick={nextStep} className="btn-solid">
                Continuer
              </button>
            ) : (
              <button
                type="submit"
                onClick={handleSubmit}
                className="btn-solid"
              >
                Publier
              </button>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default PublishRide;
