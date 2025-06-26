

import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { Navigate, useNavigate } from "react-router-dom";
import Loginpage from "../src/pages/Loginpage";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  // Check user authentication status
  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check");
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    checkAuth();
  }, []);

  // Connect to socket and handle online users
  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;

    const newSocket = io(backendUrl, {
      query: { userId: userData._id },
    });

    newSocket.connect();
    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });
  };

  // Login and connect socket
  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentials);
      if (data.success) {
        setAuthUser(data.userData);
        connectSocket(data.userData);

        localStorage.setItem("token", data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        setToken(data.token);

        toast.success("Login successful");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  // Logout and disconnect socket
  const navigate=useNavigate();
  const logout = async () => {
    try {
    //   const { data } = await axios.get("/auth/logout");
    const success =true;
      if (success) {
        setAuthUser(null);
        setOnlineUsers([]);
        localStorage.removeItem("token");
        setToken(null);

        if (socket) {
          socket.disconnect();
          setSocket(null);
        }

        delete axios.defaults.headers.common["Authorization"];
        toast.success("Logout successful");
      }
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };




const updateProfile = async (body) => {
  try {
    const { data } = await axios.put("/api/auth/update-profile", body);
    if (data.success) {
      setAuthUser(data.user);
      toast.success("Profile updated successfully");
    }
  } catch (err) {
    toast.error(err.response?.data?.message || "Something went wrong");
  }
};

  const value = {
    axios,
    authUser,
    onlineUsers,
    setAuthUser,
    setOnlineUsers,
    socket,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
