import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

// Components
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const UsersList = () => {
  return (
    <>
      <Header />
      <main>
        <div className="container">
          <h1>Users List</h1>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default UsersList;
