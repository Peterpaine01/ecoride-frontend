import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, authLoading } = useContext(AuthContext)

  if (authLoading) {
    return null
  }

  if (isAuthenticated) {
    return children
  }

  return <Navigate to="/se-connecter" replace />
}

export default PrivateRoute
