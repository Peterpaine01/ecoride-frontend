import { Link, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "../config/axiosConfig";

// Components
import Header from "../components/Header";
import Cover from "../components/Cover";
import Footer from "../components/Footer";
import RideCard from "../components/RideCard";
import { Key } from "react-feather";

const RidesList = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [ridesList, setRidesList] = useState();

  const searchQuery = {
    departureCity: searchParams.get("departureCity"),
    destinationCity: searchParams.get("destinationCity"),
    departureDate: searchParams.get("departureDate"),
    availableSeats: parseInt(searchParams.get("availableSeats"), 10) || 1,
  };

  useEffect(() => {
    const fetchData = async () => {
      if (searchQuery) {
        try {
          const response = await axios.get("/search-rides", {
            params: searchQuery,
          });
          console.log("Rides data:", response.data.rides);

          setRidesList(response.data.rides);
        } catch (error) {
          console.error("Error fetching rides:", error);
        }
      }
    };

    fetchData();
  }, []);

  const getDate = (date) => {
    const formattedDate = new Date(Date.parse(date));

    const options = {
      weekday: "short",
      day: "numeric",
      month: "long",
      year: "numeric",
    };

    return formattedDate
      .toLocaleDateString("fr-FR", options)
      .replace(/^./, (c) => c.toUpperCase());
  };
  console.log(searchQuery);

  return (
    <>
      <Header />
      <Cover />
      <main>
        <div className="container">
          <div className="section flex-row ">
            <aside className="one-third-column">
              <div className="filter-header">
                <h2>Filtrer</h2>
                <a href="#" class="reset">
                  tout effacer
                </a>
              </div>
              <form>
                <div className="input-group">
                  <h3>Votre voyage</h3>
                  <label>Prix max (en crédits)</label>
                  <div class="counter">
                    <button>-</button>
                    <span>4</span>
                    <button>+</button>
                  </div>

                  <label>Durée max</label>
                  <select>
                    <option>--:--</option>
                  </select>
                </div>
                <div className="input-group">
                  <h3>Votre conducteur</h3>
                  <label>Note minimal</label>
                  <div class="counter">
                    <button>-</button>
                    <span>3</span>
                    <button>+</button>
                  </div>

                  <label>Genre</label>
                  <select>
                    <option>Indifférent</option>
                    <option>Homme</option>
                    <option>Femme</option>
                  </select>
                </div>
                <div className="input-group">
                  <h3>Vos préférences</h3>
                  <div class="toggle">
                    <label>
                      Voyage écologique <small>Voiture électrique</small>
                    </label>
                    <input type="checkbox" />
                  </div>

                  <div class="toggle">
                    <label>Véhicule non fumeur</label>
                    <input type="checkbox" checked />
                  </div>

                  <div class="toggle">
                    <label>Pas d’animaux</label>
                    <input type="checkbox" />
                  </div>
                </div>
              </form>
            </aside>
            <div className="results-search">
              <h1>{getDate(searchQuery.departureDate)}</h1>

              <div className="results-list flex-column gap-15">
                {ridesList ? (
                  ridesList.map((ride) => {
                    console.log("ride", ride);
                    return <RideCard key={ride._id} ride={ride} />;
                  })
                ) : (
                  <p>Pas de trajet trouvé avec ces critères.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default RidesList;
