import axios from "../config/axiosConfig";
import Cookies from "js-cookie";
import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");

    const fetchUser = async () => {
      try {
        const response = await axios.get(`/user/${userId}`);
        setUser(response.data.user);
      } catch (err) {
        console.log(err);
      }
    };

    if (token) {
      setIsAuthenticated(true);
      fetchUser();
    }
  }, [isAuthenticated]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/login`,
        {
          email,
          password,
        }
      );
      Cookies.set("token", response.data.token);
      setUserId(response.data.userId);
    } catch (err) {
      console.error(err.response.data.error);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    Cookies.remove("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
