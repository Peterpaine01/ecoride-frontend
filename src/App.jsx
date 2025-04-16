import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import "./App.scss"

// Images
//import LogoHD from "../src/assets/logo-EcoRide.svg";

// Pages
import Home from "./pages/Home"
import Contact from "./pages/Contact"
import PublishRide from "./pages/PublishRide"
import PublishRideTest from "./pages/PublishRideTest"
import Profil from "./pages/Profil"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"

import About from "./pages/About"
import HowItWorks from "./pages/HowItWorks"
import LegalNotices from "./pages/LegalNotices"

import RidesSchedule from "./pages/RidesSchedule"
import RidesPast from "./pages/RidesPast"
import RidesList from "./pages/RidesList"
import RideDetails from "./pages/RideDetails"

import OpinionList from "./pages/OpinionList"
import CarDetails from "./pages/CarDetails"

// Admin pages
import AdminHome from "./pages/admin/AdminHome"
import StaffList from "./pages/admin/StaffList"
import StaffDetails from "./pages/admin/StaffDetails"
import UsersList from "./pages/admin/UsersList"
import UserDetails from "./pages/admin/UserDetails"

// Staff pages
import StaffHome from "./pages/staff/StaffHome"
import DisputesList from "./pages/staff/DisputesList"
import DisputeDetails from "./pages/staff/DisputeDetails"
import OpinionsList from "./pages/staff/OpinionsList"
import OpinionDetails from "./pages/staff/OpinionDetails"

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/publier-trajet" element={<PublishRide />} />
        <Route path="/publier-trajet-test" element={<PublishRideTest />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/se-connecter" element={<SignIn />} />
        <Route path="/creer-compte" element={<SignUp />} />

        <Route path="/qui-sommes-nous" element={<About />} />
        <Route path="/comment-fonctionne-ecoride" element={<HowItWorks />} />
        <Route path="/mentions-legales" element={<LegalNotices />} />

        <Route path="/vos-trajets" element={<RidesSchedule />} />
        <Route path="/vos-trajets-archive" element={<RidesPast />} />
        <Route path="/recherche-trajets" element={<RidesList />} />
        <Route path="/trajet/:id" element={<RideDetails />} />

        <Route path="/avis" element={<OpinionList />} />
        <Route path="/vehicule/:id" element={<CarDetails />} />

        {/* ADMIN */}
        <Route path="/espace-admin" element={<AdminHome />} />
        <Route path="/staff" element={<StaffList />} />
        <Route path="/staff/:id" element={<StaffDetails />} />
        <Route path="/users" element={<UsersList />} />
        <Route path="/user/:id" element={<UserDetails />} />

        {/* STAFF */}
        <Route path="/espace-staff" element={<StaffHome />} />
        <Route path="/litiges" element={<DisputesList />} />
        <Route path="/litige/:id" element={<DisputeDetails />} />
        <Route path="/avis-utilisateurs" element={<OpinionsList />} />
        <Route path="/avis/:id" element={<OpinionDetails />} />
      </Routes>
    </Router>
  )
}

export default App
