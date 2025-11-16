import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading
  const [user, setUser] = useState(null);
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
  }, [token]);

  // While checking token validity, show a loader
  if (isAuthenticated === null) {
    return <div className="bg-blue-400 text-center text-white">Loading...</div>;
  }

  // If not authenticated, redirect
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, render protected children
  return (
    <div className="pe-2 h-screen overflow-hidden">
      <div className="text-3xl font-bold sticky top-0 p-4 flex justify-around bg-blue-500 text-white w-full h-20">
        <span className="font-bold"> {user?.name}'s Todos</span>
      </div>
      {children}
    </div>
  );
};

export default ProtectedRoute;
