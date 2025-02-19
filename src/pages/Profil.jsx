import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "../config/axiosConfig";

// Components
import Header from "../components/Header";
import Footer from "../components/Footer";
import Cover from "../components/Cover";

const Profil = () => {
  const { user, login, logout, isAuthenticated } = useContext(AuthContext);
  console.log(user);
  const [userReviewsList, setUserReviewsList] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/reviews-driver/${user.account_id}`
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          console.log("Reviews data:", data.reviews);

          setUserReviewsList(data.reviews || []);
        } catch (error) {
          console.error("Error fetching reviews:", error);
        }
      }
    };

    fetchData();
  }, []);

  const renderStars = (note) => {
    const fullStar = "⭐"; // Icône étoile pleine
    const emptyStar = "☆"; // Icône étoile vide
    return fullStar.repeat(note) + emptyStar.repeat(5 - note);
  };

  console.log("userReviewsList", userReviewsList);
  const reviewsDataTest = [
    {
      title: "Bien !",
      note: 4,
      comment: "J'ai adoré",
      wasRideOk: true,
      isPublished: true,
    },
    {
      title: "Excellent !",
      note: 5,
      comment: "J'ai adoré",
      wasRideOk: true,
      isPublished: true,
    },
    {
      title: "Voyage sympa",
      note: 3,
      comment: "J'ai adoré",
      wasRideOk: true,
      isPublished: true,
    },
    {
      title: "Voyage sympa",
      note: 3,
      comment: "J'ai adoré",
      wasRideOk: true,
      isPublished: false,
    },
  ];

  // if (!user) {
  //   return <p>Loading</p>;
  // }

  // console.log("token", Cookies.get("token"));

  return (
    <>
      <Header />
      <Cover />
      {user ? (
        <main>
          <div className="container profile">
            <div className="section profile-header">
              <div className="flex-row gap-15">
                <div className="profil-icon user-logged">
                  <img src={user.photo} alt={`Photo de ${user.username}`} />
                </div>
                <div className="profile">
                  <h1>{user.username}</h1>
                  <p>{user.credits} crédits</p>
                </div>
              </div>

              <Link className="edit-profile btn-solid">Modifier le profil</Link>
            </div>
            <div className="section filters-layout flex-row">
              <aside className="sidebar one-third-column">
                <h2>Compte</h2>
                <nav className="menu">
                  <ul>
                    <li>
                      <a href="#">Mot de passe</a>
                    </li>
                    <li>
                      <a href="#">Conditions générales</a>
                    </li>
                    <li>
                      <a href="#">Protections des données</a>
                    </li>
                    <li>
                      <a href="#">Fermer le compte</a>
                    </li>
                  </ul>
                </nav>
                <Link
                  onClick={logout}
                  to={"/se-connecter"}
                  className="btn-solid"
                >
                  Se déconnecter
                </Link>
              </aside>
              <div className="user-infos">
                <h2>Présentez-vous</h2>
                <div className="row">
                  <section className="profile-info">
                    <p>{user.email}</p>
                    <p>
                      At vero eos et accusamus et iusto odio dignissimos ducimus
                      qui blanditiis praesentium voluptatum deleniti atque
                      corrupti quos dolores.
                    </p>
                  </section>
                  <section className="ecoride">
                    <h3>SUR ECORIDE</h3>
                    {user.is_driver && <p> Je suis chauffeur</p>}
                    <p> Je suis passager</p>
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
                  </section>
                </div>
                <div className="row">
                  <section className="preferences">
                    <h3>VOS PRÉFÉRENCES</h3>
                    <ul>
                      {user && user.driverInfos.accept_smoking ? (
                        <li>cigarette accepté</li>
                      ) : (
                        <li>🚭 Pas de cigarette</li>
                      )}
                      {user && user.driverInfos.accept_animals ? (
                        <li>🐾 J'aime les animaux</li>
                      ) : (
                        <li>Pas d'animaux</li>
                      )}
                      <li>💬 J'aime discuter</li>
                      <li>🎵 J'adore la musique</li>
                    </ul>
                  </section>
                  <section className="vehicles flex-column">
                    <h3>VOS VÉHICULES</h3>
                    {user &&
                      user.driverInfos.cars.map((car) => {
                        return (
                          <Link key={car.id} className="vehicle">
                            🚗 {car.model} - {car.color}
                          </Link>
                        );
                      })}

                    <button>Ajouter un véhicule</button>
                  </section>
                </div>
                <div className="row">
                  <section className="reviews">
                    <h3>AVIS</h3>
                    <div className="last-reviews">
                      {reviewsDataTest
                        .filter((review) => review.isPublished)
                        .slice(0, 2)
                        .map((review, index) => (
                          <article
                            className="review"
                            key={index}
                            style={{
                              borderBottom: "1px solid #ddd",
                              padding: "10px 0",
                            }}
                          >
                            <h4>{review.title}</h4>
                            <p>{renderStars(review.note)}</p>
                            <p>{review.comment}</p>
                          </article>
                        ))}
                    </div>
                  </section>
                </div>
                <Link>Tous les avis </Link>
              </div>
            </div>
          </div>
        </main>
      ) : (
        <p>Loading</p>
      )}

      <Footer />
    </>
  );
};

export default Profil;
