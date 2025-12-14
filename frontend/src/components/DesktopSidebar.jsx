import { useThemeStore } from "@/store/themeStore";
import { useUserStore } from "@/store/userStore";
import {
  ChartNoAxesCombined,
  CircleChevronLeft,
  ClipboardPlus,
  LayoutList,
  User,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useSidebarStore } from "@/store/sidebarStore";

function DesktopSidebar() {
  const { theme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useUserStore((state) => state.user);
  const { sidebar, toggleSidebar } = useSidebarStore();

  const isActive = (path) => location.pathname === path;

  const baseClasses = `flex lg:gap-4 gap-1 items-center cursor-pointer font-bold text-white lg:p-2 p-1 rounded transition-all lg:text-base text-xs ${
    sidebar ? "justify-start" : "justify-center"
  }`;
  const activeClasses = "bg-blue-700";
  const inactiveClasses = "bg-blue-400 hover:bg-blue-500";

  return (
    <aside
      className={`relative hidden sm:flex flex-col gap-2 align-center
        lg:p-3 p-1 h-[calc(100vh-70px)] mt-0.5 bg-slate-300
        transition-[width] duration-300 ease-in-out
        ${theme === "light" ? "light" : "dark"}
        ${sidebar ? "w-[20%]" : "w-[5%]"}
      `}
    >
      <CircleChevronLeft
        className={`absolute top-0 -right-2.5 text-white bg-blue-500
          rounded-full cursor-pointer z-100
          transition-transform duration-600
          ${sidebar ? "rotate-0" : "rotate-180"}
          md:w-6 md:h-6 w-5 h-5
        `}
        onClick={toggleSidebar}
      />

      {sidebar && (
        <span className="px-4 sm:text-lg font-semibold text-sm">
          Welcome {user?.name}
        </span>
      )}

      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={`${baseClasses} ${
              isActive("/todos") ? activeClasses : inactiveClasses
            }`}
            onClick={() => navigate("/todos")}
          >
            <LayoutList className="max-lg:w-4 max-lg:h-4 lg:w-5 lg:h-5" />
            {sidebar && <span>Dashboard</span>}
          </button>
        </TooltipTrigger>
        {!sidebar && (
          <TooltipContent side="right" align="center">
            <p>All Tasks</p>
          </TooltipContent>
        )}
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={`${baseClasses} ${
              isActive("/todos/create") ? activeClasses : inactiveClasses
            }`}
            onClick={() => navigate("/todos/create")}
          >
            <ClipboardPlus className="max-lg:w-4 max-sm:h-4 lg:w-5 lg:h-5" />
            {sidebar && <span>Create Tasks</span>}
          </button>
        </TooltipTrigger>
        {!sidebar && (
          <TooltipContent side="right" align="center">
            <p>Create Tasks</p>
          </TooltipContent>
        )}
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={`${baseClasses} ${
              isActive("/todos/status/summary")
                ? activeClasses
                : inactiveClasses
            }`}
            onClick={() => navigate("/todos/status/summary")}
          >
            <ChartNoAxesCombined className="max-lg:w-4 max-sm:h-4 lg:w-5 lg:h-5" />
            {sidebar && <span>Tasks Summary</span>}
          </button>
        </TooltipTrigger>
        {!sidebar && (
          <TooltipContent side="right" align="center">
            <p>Tasks summary</p>
          </TooltipContent>
        )}
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={`${baseClasses} ${
              isActive("/update/username") ? activeClasses : inactiveClasses
            }`}
            onClick={() => navigate("/update/username")}
          >
            <User className="max-lg:w-4 max-sm:h-4 lg:w-5 lg:h-5" />
            {sidebar && <span>Profile</span>}
          </button>
        </TooltipTrigger>
        {!sidebar && (
          <TooltipContent side="right" align="center">
            <p>User Profile</p>
          </TooltipContent>
        )}
      </Tooltip>
    </aside>
  );
}

export default DesktopSidebar;
