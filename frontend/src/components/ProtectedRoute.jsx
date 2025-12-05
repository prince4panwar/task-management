import React from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserStore } from "../store/userStore";
import { useThemeStore } from "../store/themeStore";
import { Moon, Sun } from "lucide-react";

const ProtectedRoute = ({ children }) => {
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
        className={`h-[70px] text-3xl font-bold sticky top-0 px-8 py-2 flex items-center bg-blue-500 text-white w-full ${
          theme === "light" ? "light" : "dark"
        }`}
      >
        <div className="w-1/3 flex justify-start">
          <Link
            className="text-lg hover:underline"
            onClick={() => navigate("/todos")}
          >
            Taskify
          </Link>
        </div>
        <div className="w-1/3 flex justify-center">
          <span className="font-bold text-2xl">Welcome {user?.name}</span>
        </div>
        <div className="w-1/3 flex justify-end items-center gap-4">
          <Avatar
            onClick={() => navigate("/update/username")}
            className="w-10 h-10"
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

          <Link className="text-sm hover:underline" onClick={onLogout}>
            Logout
          </Link>
        </div>
      </div>

      {children}
    </div>
  );
};

export default ProtectedRoute;
