import axios from "../config/axiosConfig"
import Cookies from "js-cookie"
import { createContext, useState, useEffect } from "react"
import { jwtDecode } from "jwt-decode"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  const [token, setToken] = useState(Cookies.get("token") || null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)

  const openLoginModal = () => setShowLoginModal(true)
  const closeLoginModal = () => setShowLoginModal(false)

  const isAuthenticated = !!user

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          const decodedToken = jwtDecode(token)
          await fetchUser(decodedToken.id)
        } catch (error) {
          console.error("Token invalid", error)
          logout()
        }
      }
      setAuthLoading(false)
    }

    initializeAuth()
  }, [token])

  const fetchUser = async (userIdFromParam) => {
    try {
      const decoded = jwtDecode(Cookies.get("token"))
      const userId = userIdFromParam || decoded.id
      const accountType = decoded.account_type

      if (!userId || !accountType) return

      const endpoint =
        accountType === "user" ? `/user/${userId}` : `/staff-member/${userId}`

      const response = await axios.get(endpoint)
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
        authLoading,
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
