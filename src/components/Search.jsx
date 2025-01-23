import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";

// Images
import LogoHD from "../assets/logo-EcoRide-secondary.svg";
import { Flag, Calendar, Users, Search } from "react-feather";

// Je récupère les props
const SearchBlock = () => {
  return (
    <>
      <div className="search-block">
        <form>
          <div className="search-left">
            <div className="input-group">
              <label htmlFor="" className="label-hidden">
                Départ
              </label>
              <Flag />
              <input
                type="text"
                name="start-ride"
                id="start-ride"
                autoComplete
                placeholder="Départ"
              />
            </div>
            <div className="input-group">
              <label for="end-ride" className="label-hidden">
                Destination
              </label>
              <Flag />
              <input
                type="text"
                name="end-ride"
                id="end-ride"
                autoComplete
                placeholder="Destination"
              />
            </div>
          </div>

          <div className="search-right">
            <button type="button">
              <Calendar /> Aujourd'hui
            </button>
            <button type="button">
              <Users /> 1 passager
            </button>
            <button type="submit" aria-disabled="false">
              <Search />
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default SearchBlock;
