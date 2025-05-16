import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, authLoading, user } = useContext(AuthContext)

  if (authLoading) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to="/se-connecter" replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role_label)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

export default PrivateRoute
