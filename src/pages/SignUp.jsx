import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

import { Circle, Eye, EyeOff, Lock, Unlock, User, Mail } from "react-feather";

// Components
import Header from "../components/Header";
import Cover from "../components/Cover";
import Footer from "../components/Footer";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    gender: "",
    isDriver: false,
    rgpg: false,
  });
  const [validationPassword, setValidationPassword] = useState({
    pwLength: false,
    uppercase: false,
    lowercase: false,
    number: false,
    symbol: false,
  });

  const showValidationPassword = () => {};

  return (
    <>
      <Header />
      <Cover />

      <main>
        <div className="container">
          <div className="section flex-column align-center">
            <h1>Créer un compte</h1>
            <form className="user-connect framed flex-column">
              <div className="input-group">
                <label for="user" className="label-hidden">
                  Nom d'utilisateur
                </label>
                <div className="icon-input-container">
                  <User size={20} className="input-icon-left" />
                  <input
                    type="text"
                    autocomplete="off"
                    id="user"
                    placeholder="3 caractères minimum"
                    maxlength="24"
                  />
                </div>
              </div>

              <div className="input-group">
                <label for="email" className="label-hidden">
                  Entrez votre email
                </label>
                <div className="icon-input-container">
                  <Mail size={20} className="input-icon-left" />
                  <input
                    type="text"
                    autocomplete="off"
                    id="email"
                    placeholder="Adresse email"
                  />
                </div>
                <span className="error-msg">Rentrez un email valide.</span>
              </div>
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
                    placeholder="Mot de passe"
                    className="password-input"
                    onChange={() => {
                      showValidationPassword();
                    }}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <div className="check-pw">
                  <p className="flex-row align-center gap-5">
                    <Circle size={20} /> 9 caractères minimum
                  </p>
                  <p className="flex-row align-center gap-5">
                    <Circle size={20} /> 1 lettre majuscule minimum
                  </p>
                  <p className="flex-row align-center gap-5">
                    <Circle size={20} /> 1 lettre minuscule minimum
                  </p>
                  <p className="flex-row align-center gap-5">
                    <Circle size={20} /> 1 chiffre minimum
                  </p>
                  <p className="flex-row align-center gap-5">
                    <Circle size={20} /> 1 caractère spéciale minimum
                  </p>
                </div>
              </div>
              <div className="input-group">
                <label for="gender" className="label-hidden">
                  genre de l'utilisateur
                </label>
                <div className="inline-input flex-row space-between align-center gap-5">
                  <p>
                    Je m’identifie comme <sup>*</sup>{" "}
                  </p>
                  <select name="gender" id="gender">
                    <option value="">homme</option>
                    <option value="dog">femme</option>
                    <option value="cat">autre</option>
                  </select>
                </div>
              </div>
              <fieldset className="input-group">
                <p>
                  Avec EcoRide, je veux : <sup>*</sup>
                </p>
                <div className="input-checkbox-container flex-row gap-5">
                  <input type="checkbox" id="passenger" name="scales" checked />
                  <label for="passenger">
                    participer à des trajets en tant que passager
                  </label>
                </div>
                <div className="input-checkbox-container flex-row gap-5">
                  <input type="checkbox" id="driver" name="scales" />
                  <label for="driver">
                    proposer mon véhicule et mes talents de conducteur
                  </label>
                </div>
              </fieldset>
              <div className="input-group ">
                <div className="input-checkbox-container flex-row gap-5">
                  <input type="checkbox" id="passenger" name="scales" checked />
                  <label for="passenger">
                    J’accepte la
                    <Link to="/mentions-legales">
                      <strong>politique de confidentialité des données</strong>
                    </Link>
                    <sup>*</sup>
                  </label>
                </div>
              </div>

              <button type="submit" className="btn-solid">
                S'inscrire
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default SignUp;
