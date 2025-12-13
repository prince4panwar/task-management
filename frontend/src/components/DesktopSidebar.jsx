import { useThemeStore } from "@/store/themeStore";
import { useUserStore } from "@/store/userStore";
import {
  ChartNoAxesCombined,
  ClipboardPlus,
  LayoutList,
  User,
} from "lucide-react";
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function DesktopSidebar() {
  const { theme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useUserStore((state) => state.user);

  const isActive = (path) => location.pathname === path;

  const baseClasses =
    "flex lg:gap-4 gap-1 items-center cursor-pointer font-bold text-white lg:p-2 p-1 rounded transition-all lg:text-base text-xs";
  const activeClasses = "bg-blue-700";
  const inactiveClasses =
    "bg-blue-400 hover:bg-blue-500 transition-all duration-300 -translate-x-2";

  return (
    <div
      className={`hidden sm:flex flex-col gap-2 align-center p-3 h-[calc(100vh-70px)] w-[20%] mt-1 bg-slate-300 ${
        theme === "light" ? "light" : "dark"
      }`}
    >
      <span className="font-semibold lg:text-lg text-sm">
        Welcome {user?.name}
      </span>

      <button
        type="button"
        className={`${baseClasses} ${
          isActive("/todos") ? activeClasses : inactiveClasses
        }`}
        onClick={() => navigate("/todos")}
      >
        <LayoutList className="max-lg:w-4 max-lg:h-4 lg:w-5 lg:h-5" />
        Dashboard
      </button>

      <button
        type="button"
        className={`${baseClasses} ${
          isActive("/todos/create") ? activeClasses : inactiveClasses
        }`}
        onClick={() => navigate("/todos/create")}
      >
        <ClipboardPlus className="max-lg:w-4 max-sm:h-4 lg:w-5 lg:h-5" />
        Create Tasks
      </button>

      <button
        type="button"
        className={`${baseClasses} ${
          isActive("/todos/status/summary") ? activeClasses : inactiveClasses
        }`}
        onClick={() => navigate("/todos/status/summary")}
      >
        <ChartNoAxesCombined className="max-lg:w-4 max-sm:h-4 lg:w-5 lg:h-5" />
        Tasks Summary
      </button>

      <button
        type="button"
        className={`${baseClasses} ${
          isActive("/update/username") ? activeClasses : inactiveClasses
        }`}
        onClick={() => navigate("/update/username")}
      >
        <User className="max-lg:w-4 max-sm:h-4 lg:w-5 lg:h-5" />
        Profile
      </button>
    </div>
  );
}

export default DesktopSidebar;
