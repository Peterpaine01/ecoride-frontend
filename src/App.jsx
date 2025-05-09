import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useContext } from "react"
import "./App.scss"

import { AuthContext } from "./context/AuthContext"

import PrivateRoute from "./components/PrivateRoute"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// Pages
import Home from "./pages/Home"
import Contact from "./pages/Contact"
import PublishRide from "./pages/PublishRide"
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
import BookingSummary from "./pages/BookingSummary"

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

import LoginModal from "./components/LoginModal"

const App = () => {
  const { showLoginModal, closeLoginModal } = useContext(AuthContext)
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/publier-trajet"
            element={
              <PrivateRoute>
                <PublishRide />
              </PrivateRoute>
            }
          />
          <Route
            path="/profil"
            element={
              <PrivateRoute>
                <Profil />
              </PrivateRoute>
            }
          />
          <Route path="/se-connecter" element={<SignIn />} />
          <Route path="/creer-compte" element={<SignUp />} />

          <Route path="/qui-sommes-nous" element={<About />} />
          <Route path="/comment-fonctionne-ecoride" element={<HowItWorks />} />
          <Route path="/mentions-legales" element={<LegalNotices />} />

          <Route
            path="/vos-trajets"
            element={
              <PrivateRoute>
                <RidesSchedule />
              </PrivateRoute>
            }
          />
          <Route
            path="/vos-trajets-archive"
            element={
              <PrivateRoute>
                <RidesPast />
              </PrivateRoute>
            }
          />
          <Route path="/recherche-trajet" element={<RidesList />} />
          <Route path="/trajet/:id" element={<RideDetails />} />
          <Route path="/reservation/:rideId" element={<BookingSummary />} />

          <Route path="/avis" element={<OpinionList />} />
          <Route path="/vehicule/:id" element={<CarDetails />} />

          {/* ADMIN */}
          <Route
            path="/espace-admin"
            element={
              <PrivateRoute>
                <AdminHome />
              </PrivateRoute>
            }
          />
          <Route
            path="/staff"
            element={
              <PrivateRoute>
                <StaffList />
              </PrivateRoute>
            }
          />
          <Route
            path="/staff/:id"
            element={
              <PrivateRoute>
                <StaffDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/users"
            element={
              <PrivateRoute>
                <UsersList />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/:id"
            element={
              <PrivateRoute>
                <UserDetails />
              </PrivateRoute>
            }
          />

          {/* STAFF */}
          <Route
            path="/espace-staff"
            element={
              <PrivateRoute>
                <StaffHome />
              </PrivateRoute>
            }
          />
          <Route
            path="/litiges"
            element={
              <PrivateRoute>
                <DisputesList />
              </PrivateRoute>
            }
          />
          <Route
            path="/litige/:id"
            element={
              <PrivateRoute>
                <DisputeDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/avis-utilisateurs"
            element={
              <PrivateRoute>
                <OpinionsList />
              </PrivateRoute>
            }
          />
          <Route
            path="/avis/:id"
            element={
              <PrivateRoute>
                <OpinionDetails />
              </PrivateRoute>
            }
          />
        </Routes>
        <ToastContainer />
      </Router>
      {showLoginModal && <LoginModal onClose={closeLoginModal} />}
    </>
  )
}

export default App
