import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

// Components
import Header from "../components/Header";
import Cover from "../components/Cover";
import Footer from "../components/Footer";

const PublishRide = () => {
  return (
    <>
      <Header />
      <Cover />
      <main>
        <div className="container">
          <h1>Nouveau trajet</h1>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PublishRide;
