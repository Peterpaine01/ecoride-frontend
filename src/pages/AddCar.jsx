import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "../config/axiosConfig";

// Components
import Header from "../components/Header";
import Footer from "../components/Footer";
import Cover from "../components/Cover";

const AddCar = () => {
  const { user, login, logout, isAuthenticated } = useContext(AuthContext);
  console.log(user);
  const [userReviewsList, setUserReviewsList] = useState(false);

  return (
    <>
      <Header />
      <Cover />
      <h1>Add Car</h1>

      <Footer />
    </>
  );
};

export default AddCar;
