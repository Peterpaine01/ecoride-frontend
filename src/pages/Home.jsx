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
            <div className="block-left align-center">
              <div className="block-img">
                <img
                  src="/images/side-view-blurry-woman-waiting-near-car.png"
                  alt="borne de rechargement pour voiture electrique"
                />
              </div>
              <div className="note">
                <p>
                  <span className="material-symbols-outlined eco-icon">
                    eco
                  </span>
                  Voyage éco-responsable
                </p>
              </div>
            </div>
            <div className="block-right">
              <h2>Mobilité éco-responsable</h2>

              <p>
                Chez EcoRide, nous croyons en une mobilité plus respectueuse de
                l’environnement et accessible à toutes et tous. Inspirés par les
                initiatives du quotidien, nous mettons le covoiturage au service
                de la planète. En favorisant le partage des trajets, nous
                réduisons les émissions de CO<sup>2</sup> tout en limitant le
                nombre de voitures sur les routes.
              </p>

              <p>
                Notre plateforme privilégie les véhicules électriques ou
                hybrides pour des trajets encore plus écologiques. De plus, nous
                encourageons les utilisateurs à adopter des comportements
                responsables grâce à des incitations et récompenses pour les
                voyages verts Avec EcoRide, chaque trajet est une opportunité de
                contribuer à la lutte contre le changement climatique tout en
                créant des liens entre les passagers.
              </p>
            </div>
          </div>
          <div className="section">
            <div className="slogan">
              <p>
                <em>
                  Ensemble, faisons de la mobilité durable une réalité au
                  quotidien.
                </em>
              </p>
            </div>
          </div>
          <div className="section flex-row two-column framed">
            <div className="block-left">
              <div className="">
                <h2>Comment fonctionne EcoRide ?</h2>
                <img
                  src="/images/icon-EcoRide-primary.svg"
                  alt="borne de rechargement pour voiture electrique"
                />
              </div>
            </div>
            <div className="block-right">
              <p>
                À la création de leur compte, chaque utilisateur reçoit 20
                crédits offerts. Les conducteurs proposant de partager leur
                véhicule fixent le nombre de crédits nécessaires par passager
                pour un trajet. La plateforme prélève une commission de 2
                crédits par passager, afin de garantir le bon fonctionnement du
                service. Au début du trajet, le conducteur indique son démarrage
                via l’application, puis le clôture une fois arrivé à
                destination. Les passagers doivent ensuite valider le bon
                déroulement du trajet sur la plateforme. Une fois cette
                validation effectuée, les crédits convenus sont attribués au
                conducteur. Avec EcoRide, simplicité et transparence sont au
                cœur de chaque trajet partagé.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
