import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { axiosReq, axiosRes } from "../api/axiosDefault";
import { useHistory } from "react-router";
import jwt_decode from "jwt-decode";

export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const access = localStorage.getItem("access");
    const refresh = localStorage.getItem("refresh");
    return access && refresh ? { access, refresh } : null;
  });
  const history = useHistory();

  const handleMount = async () => {
    try {
      const { data } = await axiosRes.get("api/user/");
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      setCurrentUser(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleMount();
  }, []);

  useEffect(() => {
    const refreshToken = async () => {
      if (!currentUser || !currentUser.refresh) {
        return;
      }
    
      try {
        const { data } = await axios.post("/api/token/refresh/", {
          refresh: currentUser.refresh,
        });
        localStorage.setItem("access", data.access);
        setCurrentUser({ ...currentUser, access: data.access });
      } catch (error) {
        console.log("refreshToken error:", error);
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setCurrentUser(null);
        history.push("/signin");
      }
    };
  
    const decodedToken = currentUser && currentUser.access ? jwt_decode(currentUser.access) : null;
    const expiresIn = decodedToken ? decodedToken.exp * 1000 - Date.now() : 0;

    console.log("currentUser:", currentUser); // Log 3
    console.log("decodedToken:", decodedToken); // Log 3
    console.log("expiresIn:", expiresIn); // Log 3
  
    if (expiresIn < 5000) {
      refreshToken();
    } else {
      const timer = setTimeout(refreshToken, expiresIn - 5000);
  
      return () => {
        clearTimeout(timer);
      };
    }
  }, [currentUser, history]);

  useMemo(() => {
    axiosReq.interceptors.request.use(
      async (config) => {
        try {
          await axios.post("/api/token/refresh/");
        } catch (err) {
          setCurrentUser((prevCurrentUser) => {
            if (prevCurrentUser) {
              history.push("/signin");
            }
            return null;
          });
          return config;
        }
        return config;
      },
      (err) => {
        return Promise.reject(err);
      }
    );

    axiosRes.interceptors.response.use(
      (response) => response,
      async (err) => {
        if (err.response?.status === 401) {
          try {
            await axios.post("/api/token/refresh/");
          } catch (err) {
            setCurrentUser((prevCurrentUser) => {
              if (prevCurrentUser) {
                history.push("/signin");
              }
              return null;
            });
          }
          return axios(err.config);
        }
        return Promise.reject(err);
      }
    );
  }, [history]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};