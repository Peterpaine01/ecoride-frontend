// src/components/PrivateRoute.jsx
import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext)

  return isAuthenticated ? children : <Navigate to="/se-connecter" replace />
}

export default PrivateRoute
