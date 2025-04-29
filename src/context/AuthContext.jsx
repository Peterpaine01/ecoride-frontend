import axios from "../config/axiosConfig"
import Cookies from "js-cookie"
import { createContext, useState, useEffect } from "react"
import { jwtDecode } from "jwt-decode"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  const [token, setToken] = useState(Cookies.get("token") || null)
  const [showLoginModal, setShowLoginModal] = useState(false)

  const openLoginModal = () => setShowLoginModal(true)
  const closeLoginModal = () => setShowLoginModal(false)

  const isAuthenticated = !!user

  useEffect(() => {
    console.log("Token au démarrage", token)
    if (token) {
      try {
        const decodedToken = jwtDecode(token)
        const userId = decodedToken.id

        fetchUser(userId)
      } catch (error) {
        console.error("Token invalid", error)
        logout()
      }
    }
  }, [token])

  const fetchUser = async (userIdFromParam) => {
    try {
      const decoded = jwtDecode(Cookies.get("token"))
      const userId = userIdFromParam || decoded.id

      if (!userId) return
      const response = await axios.get(`/user/${userId}`)
      setUser(response.data)
    } catch (error) {
      console.error("Error fetching user", error)
      logout()
    }
  }

  const login = async (email, password) => {
    try {
      const response = await axios.post(`/login`, {
        email,
        password,
      })
      const { token } = response.data

      Cookies.set("token", token, { expires: 365 })
      const decodedToken = jwtDecode(token)
      await fetchUser(decodedToken.id)
      return { success: true }
    } catch (error) {
      console.error(
        "Error connecting",
        error.response?.data?.error || error.message
      )
      return {
        success: false,
        message: error.response?.data?.error || "Erreur de connexion",
      }
    }
  }

  const logout = () => {
    Cookies.remove("token")
    setUser(null)
    setToken(null)
  }

  const refreshUser = async () => {
    try {
      fetchUser()
    } catch (error) {
      console.error(
        "Erreur lors du rafraîchissement des données utilisateur",
        error
      )
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        fetchUser,
        refreshUser,
        showLoginModal,
        openLoginModal,
        closeLoginModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
