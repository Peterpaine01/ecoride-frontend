import axios from "../config/axiosConfig";
import Cookies from "js-cookie";
import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(Cookies.get("token") || null);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;

        setIsAuthenticated(true);
        fetchUser(userId);
      } catch (error) {
        console.error("Token invalid", error);
        logout();
      }
    }
  }, [isAuthenticated, token]);

  const fetchUser = async (userId) => {
    console.log(userId);
    try {
      const response = await axios.get(`/user/${userId}`);
      setUser(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching user", error);
      logout();
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`/login`, {
        email,
        password,
      });
      const { token } = response.data;

      Cookies.set("token", token);
      const decodedToken = jwtDecode(token);
      setIsAuthenticated(true);
      fetchUser(decodedToken.id);
    } catch (error) {
      console.error(
        "Error connecting",
        error.response?.data?.error || error.message
      );
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    Cookies.remove("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
