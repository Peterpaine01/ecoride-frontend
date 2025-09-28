import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

import { toast } from "react-toastify"

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, authLoading, user } = useContext(AuthContext)

  if (authLoading) {
    return null
  }

  if (!isAuthenticated) {
    toast.info("Pour accéder à cette page, merci de vous connecter.")
    return <Navigate to="/se-connecter" replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role_label)) {
    return <Navigate to="/sans-issue" replace />
  }

  return children
}

export default PrivateRoute
