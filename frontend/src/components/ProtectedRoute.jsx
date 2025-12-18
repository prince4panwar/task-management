import React from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserStore } from "../store/userStore";
import { useThemeStore } from "../store/themeStore";
import { CircleUserRound, Moon, Sun } from "lucide-react";
import { MobileSidebar } from "./MobileSidebar";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useSearchContext } from "@/context/SearchContext";

const ProtectedRoute = ({ children }) => {
  const { search, setSearch } = useSearchContext();
  const user = useUserStore((state) => state.user);
  const addUser = useUserStore((state) => state.addUser);
  const deleteUser = useUserStore((state) => state.deleteUser);
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isMobile = useIsMobile();

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
      <p className="text-center m-auto text-4xl font-semibold">Loading...</p>
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
        className={`h-[70px] text-3xl font-bold sticky top-0 sm:px-8 p-2 gap-0.5 flex items-center bg-blue-500 text-white w-full ${
          theme === "light" ? "light" : "dark"
        }`}
      >
        <div className="sm:w-1/3 w-2/8 flex justify-start">
          <Link
            className="sm:text-lg sm:block hidden text-sm hover:underline"
            onClick={() => navigate("/todos")}
          >
            Taskify
          </Link>
          {isMobile && <MobileSidebar />}
        </div>
        <div className="sm:w-1/3 w-6/8 flex justify-end">
          <input
            type="search"
            placeholder="Search tasks..."
            className={`border focus:outline-none w-full px-2 sm:py-1 py-2 ml-auto rounded bg-white font-semibold sm:text-lg text-sm focus:ring focus:ring-blue-600 ${
              theme === "light" ? "text-blue-600" : "dark border-blue-600"
            }`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="sm:w-1/3 w-2/8 flex justify-end items-center sm:gap-3 gap-1  max-sm:flex-row-reverse max-sm:justify-start">
          <Avatar
            onClick={() => navigate("/update/username")}
            className="sm:w-10 sm:h-10 w-9 h-9"
          >
            <AvatarImage src={user?.pic} className="cursor-pointer" />
            <AvatarFallback>
              <CircleUserRound className="bg-slate-500 cursor-pointer text-white rounded-full w-20 h-20" />
            </AvatarFallback>
          </Avatar>

          <button
            className={`group cursor-pointer hover:underline transition-all p-1 rounded-full ${
              theme === "dark" ? "hover:bg-yellow-400" : "hover:bg-slate-600"
            }`}
            onClick={toggleTheme}
          >
            {theme === "light" ? (
              <Moon className="transition-all duration-300 group-hover:-translate-y-1 max-sm:w-5 max-sm:h-5" />
            ) : (
              <Sun className="transition-all duration-300 group-hover:-translate-y-1 max-sm:w-5 max-sm:h-5" />
            )}
          </button>

          <Link
            className="sm:text-sm text-[11px] hover:underline hidden sm:block"
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
