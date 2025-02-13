import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState, useContext } from "react";
import axios from "../config/axiosConfig";
import { AuthContext } from "../context/AuthContext";

// Components
import Header from "../components/Header";
import Cover from "../components/Cover";
import Footer from "../components/Footer";

import {
  Circle,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Mail,
  CheckCircle,
} from "react-feather";

const SignIn = () => {
  const { user, login, logout, isAuthenticated } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [validationEmail, setValidationEmail] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updatedFormData = {
        ...prev,
        [name]: value,
      };
      if (name === "email") checkEmail(updatedFormData.email);

      return updatedFormData;
    });
  };

  const checkEmail = (email = "") => {
    const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    setValidationEmail(regexEmail.test(email));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (!validationEmail) {
      setErrorMessage("Veuillez entrer une adresse e-mail valide.");
      return;
    }

    try {
      await login(formData.email, formData.password);
      navigate("/");
    } catch (error) {
      console.log(error.response.status);
      console.log(error.message);
      if (error.response && error.response.data) {
        setErrorMessage("Une erreur est survenue, veuillez réessayer.");
      } else {
        setErrorMessage("Impossible de se connecter au serveur.");
      }
    }
  };

  console.log("formData -> ", formData);

  return (
    <>
      <Header />
      <Cover />

      <main>
        <div className="container">
          <div className="section flex-column align-center">
            <h1>Se connecter</h1>
            <form
              className="user-connect framed flex-column"
              onSubmit={handleSubmit}
            >
              <div className="input-group">
                <label for="email" className="label-hidden">
                  Entrez votre email
                </label>
                <div className="icon-input-container">
                  <Mail size={20} className="input-icon-left" />
                  <input
                    type="email"
                    autocomplete="off"
                    id="email"
                    name="email"
                    placeholder="Adresse email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {!validationEmail && (
                <span className="error-msg">Email invalide.</span>
              )}
              <div className="input-group password-container">
                <label for="password" className="label-hidden">
                  Mot de passe
                </label>
                <div className="icon-input-container password-container">
                  {showPassword ? (
                    <Unlock size={20} className="input-icon-left" />
                  ) : (
                    <Lock size={20} className="input-icon-left" />
                  )}
                  <input
                    type={showPassword ? "text" : "password"}
                    autocomplete="off"
                    id="password"
                    name="password"
                    placeholder="Mot de passe"
                    className="password-input"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {/* Message d'erreur */}
                {errorMessage && <p className="error-msg">{errorMessage}</p>}
              </div>

              <button type="submit" className="btn-solid">
                Accéder
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default SignIn;
