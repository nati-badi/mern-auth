import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  axios.defaults.withCredentials = true;

  const getAuthStatus = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`);

      if (data.success) {
        getUserData();
      } else {
        setUserData(null);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setUserData(null);
      } else {
        toast.error(error.message);
      }
    }
  };

  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/users/get-user-data`);

      if (data.success) {
        setUserData(data);
        setIsLoggedIn(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setUserData(null);
      } else {
        toast.error(error.message);
      }
    }
  };

  useEffect(() => {
    getAuthStatus();
  }, []);

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
