import { Routes, Route } from "react-router-dom"
import { useContext, Suspense, lazy } from "react"
import "./App.scss"
import "react-image-crop/dist/ReactCrop.css"

import { AuthContext } from "./context/AuthContext"

import PrivateRoute from "./components/PrivateRoute"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import LoginModal from "./components/LoginModal"

// Lazy import des pages
const Home = lazy(() => import("./pages/Home"))
const Contact = lazy(() => import("./pages/Contact"))
const PublishRide = lazy(() => import("./pages/PublishRide"))
const Profil = lazy(() => import("./pages/Profil"))
const EditProfil = lazy(() => import("./pages/EditProfil"))
const SignIn = lazy(() => import("./pages/SignIn"))
const SignUp = lazy(() => import("./pages/SignUp"))
const About = lazy(() => import("./pages/About"))
const HowItWorks = lazy(() => import("./pages/HowItWorks"))
const LegalNotices = lazy(() => import("./pages/LegalNotices"))
const RidesSchedule = lazy(() => import("./pages/RidesSchedule"))
const RidesPast = lazy(() => import("./pages/RidesPast"))
const RidesList = lazy(() => import("./pages/RidesList"))
const RideDetails = lazy(() => import("./pages/RideDetails"))
const RideBooking = lazy(() => import("./pages/RideBooking"))
const RideEdit = lazy(() => import("./pages/RideEdit"))
const BookingSummary = lazy(() => import("./pages/BookingSummary"))
const OpinionList = lazy(() => import("./pages/OpinionList"))
const CarDetails = lazy(() => import("./pages/CarDetails"))
const AddCar = lazy(() => import("./pages/AddCar"))
const ReviewForm = lazy(() => import("./pages/ReviewForm"))

// Admin
const AdminHome = lazy(() => import("./pages/admin/AdminHome"))
const StaffList = lazy(() => import("./pages/admin/StaffList"))
const StaffDetails = lazy(() => import("./pages/admin/StaffDetails"))
const StaffAdd = lazy(() => import("./pages/admin/StaffAdd"))
const StaffEdit = lazy(() => import("./pages/admin/StaffEdit"))
const UsersList = lazy(() => import("./pages/admin/UsersList"))
const UserDetails = lazy(() => import("./pages/admin/UserDetails"))

// Staff
const StaffHome = lazy(() => import("./pages/staff/StaffHome"))
const DisputesList = lazy(() => import("./pages/staff/DisputesList"))
const DisputeDetails = lazy(() => import("./pages/staff/DisputeDetails"))
const OpinionsList = lazy(() => import("./pages/staff/OpinionsList"))
const OpinionDetails = lazy(() => import("./pages/staff/OpinionDetails"))

const App = () => {
  const { showLoginModal, closeLoginModal } = useContext(AuthContext)

  return (
    <>
      <Suspense fallback={<div>Chargement...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/publier-trajet"
            element={
              <PrivateRoute>
                <PublishRide allowedRoles={["user"]} />
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
          <Route
            path="/modifier-profil/:id"
            element={
              <PrivateRoute>
                <EditProfil />
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
            path="/modifier-trajet/:id"
            element={
              <PrivateRoute>
                <RideEdit />
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
          <Route path="/trajet/:id" element={<RideBooking />} />
          <Route path="/recap-trajet/:id" element={<RideDetails />} />
          <Route path="/reservation/:rideId" element={<BookingSummary />} />

          <Route path="/publier-avis/:bookingId" element={<ReviewForm />} />
          <Route path="/avis" element={<OpinionList />} />
          <Route path="/vehicule/:id" element={<CarDetails />} />

          <Route
            path="/ajouter-vehicule"
            element={
              <PrivateRoute allowedRoles={["user"]}>
                <AddCar />
              </PrivateRoute>
            }
          />

          {/* ADMIN */}
          <Route
            path="/espace-admin"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
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
            path="/ajouter-staff"
            element={
              <PrivateRoute>
                <StaffAdd />
              </PrivateRoute>
            }
          />
          <Route
            path="/modifier-staff/:id"
            element={
              <PrivateRoute>
                <StaffEdit />
              </PrivateRoute>
            }
          />
          <Route
            path="/utilisateurs"
            element={
              <PrivateRoute>
                <UsersList />
              </PrivateRoute>
            }
          />
          <Route
            path="/utilisateur/:id"
            element={
              <PrivateRoute>
                <UserDetails />
              </PrivateRoute>
            }
          />

          {/* STAFF */}
          <Route
            path="/espace-webmaster"
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
      </Suspense>

      <ToastContainer />
      {showLoginModal && <LoginModal onClose={closeLoginModal} />}
    </>
  )
}

export default App
