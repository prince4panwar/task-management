import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "motion/react";
import toast from "react-hot-toast";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const verifyUser = async () => {
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:3000/api/users/authenticate",
          {
            headers: { "x-access-token": token },
          }
        );
        // toast.success("Logged in successfully");
        setUser(response.data.data);
        if (response.data.success) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    verifyUser();
  }, [token, navigate]);

  // While checking token validity, show a loader
  if (isAuthenticated === null) {
    return <div className="bg-blue-400 text-center text-white">Loading...</div>;
  }

  // If not authenticated, redirect
  if (!isAuthenticated) {
    toast.error("Please login first");
    return <Navigate to="/login" replace />;
  }

  // Otherwise, render protected children
  return (
    <div className="h-screen overflow-hidden">
      <div
        className="text-3xl font-bold sticky top-0 p-4 flex justify-center gap-4 bg-blue-500 text-white w-full"
        style={{
          height: "70px",
        }}
      >
        <span className="font-bold"> {user?.name}'s Tasks</span>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="bg-green-900 hover:bg-green-800 py-2 px-3 text-xs font-bold rounded cursor-pointer"
          onClick={() => navigate("/update/username")}
        >
          Update Username
        </motion.button>
      </div>
      {children}
    </div>
  );
};

export default ProtectedRoute;
