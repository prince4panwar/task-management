import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserStore } from "../store/userStore";
import { useThemeStore } from "../store/themeStore";
import { Menu, Moon, Sun, X } from "lucide-react";

const ProtectedRoute = ({ children }) => {
  const [hamburger, setHamburger] = useState(true);
  const user = useUserStore((state) => state.user);
  const addUser = useUserStore((state) => state.addUser);
  const deleteUser = useUserStore((state) => state.deleteUser);
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const response = await axios.get(
        "http://localhost:3000/api/users/authenticate",
        {
          headers: { "x-access-token": token },
        }
      );
      addUser(response.data.data);
      return response.data;
    },
    enabled: !!token, // only runs if token exists
    retry: false,
  });

  function onLogout() {
    deleteUser();
    navigate("/login");
    toast.success("Logged out successfully");
    setTimeout(() => {
      localStorage.removeItem("token");
    }, 1);
  }

  // Loading UI
  if (isLoading) {
    return (
      <div className="bg-blue-400 text-center text-white">Loading Tasks...</div>
    );
  }

  // Not authenticated
  if (!token || isError || !data?.success) {
    toast.error("Please login first");
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="h-screen overflow-hidden">
      <div
        className={`h-[70px] text-3xl font-bold sticky top-0 sm:px-8 px-2 py-2 flex items-center bg-blue-500 text-white w-full ${
          theme === "light" ? "light" : "dark"
        }`}
      >
        <div className="w-1/3 flex justify-start">
          <Link
            className="sm:text-lg sm:block hidden text-sm hover:underline"
            onClick={() => navigate("/todos")}
          >
            Taskify
          </Link>
          {hamburger ? (
            <Menu
              className="sm:hidden"
              onClick={() => setHamburger(!hamburger)}
            />
          ) : (
            <X className="sm:hidden" onClick={() => setHamburger(!hamburger)} />
          )}
        </div>
        <div className="w-1/3 flex justify-center">
          <span className="font-bold sm:text-2xl text-sm">
            Welcome {user?.name}
          </span>
        </div>
        <div className="w-1/3 flex justify-end items-center sm:gap-4">
          <Avatar
            onClick={() => navigate("/update/username")}
            className="sm:w-10 sm:h-10 w-8 h-8"
          >
            <AvatarImage src={user?.pic} className="cursor-pointer" />
            <AvatarFallback>
              <img
                src="https://res.cloudinary.com/dsaiclywa/image/upload/v1763988872/user_qe0ygk.png"
                alt="profile image"
                className="cursor-pointer"
              />
            </AvatarFallback>
          </Avatar>

          <button
            className={`group cursor-pointer hover:underline transition-all p-1 rounded-full ${
              theme === "light" ? "hover:bg-yellow-400" : "hover:bg-slate-600"
            }`}
            onClick={toggleTheme}
          >
            {theme === "light" ? (
              <Sun className="transition-all duration-300 group-hover:-translate-y-1" />
            ) : (
              <Moon className="transition-all duration-300 group-hover:-translate-y-1" />
            )}
          </button>

          <Link
            className="sm:text-sm text-[11px] hover:underline"
            onClick={onLogout}
          >
            Logout
          </Link>
        </div>
      </div>

      {children}
    </div>
  );
};

export default ProtectedRoute;
