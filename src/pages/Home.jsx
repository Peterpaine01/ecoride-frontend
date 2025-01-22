import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

// Components
import Header from "../components/Header";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <>
      <Header />
      <main>
        <div className="container">
          <div className="section">
            <h1>Bienvenue sur EcoRide !</h1>
          </div>
          <div className="section flex-row two-column">
            <div className="block-left">
              <div className="block-img">
                <img
                  src="/images/side-view-blurry-woman-waiting-near-car.png"
                  alt="borne de rechargement pour voiture electrique"
                />
              </div>
            </div>
            <div className="block-right">
              <h2>Mobilité écoresponsable</h2>

              <p>
                Chez EcoRide, nous croyons en une mobilité plus respectueuse de
                l’environnement et accessible à toutes et tous. Inspirés par les
                initiatives du quotidien, nous mettons le covoiturage au service
                de la planète. En favorisant le partage des trajets, nous
                réduisons les émissions de CO₂ tout en limitant le nombre de
                voitures sur les routes.
              </p>

              <p>
                Notre plateforme privilégie les véhicules électriques ou
                hybrides pour des trajets encore plus écologiques. De plus, nous
                encourageons les utilisateurs à adopter des comportements
                responsables grâce à des incitations et récompenses pour les
                voyages verts Avec EcoRide, chaque trajet est une opportunité de
                contribuer à la lutte contre le changement climatique tout en
                créant des liens entre les passagers.{" "}
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
