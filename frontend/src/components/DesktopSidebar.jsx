import { useThemeStore } from "@/store/themeStore";
import {
  ChartNoAxesCombined,
  CircleChevronLeft,
  ClipboardPlus,
  Clock3,
  Flag,
  LayoutDashboard,
  LayoutList,
  User,
} from "lucide-react";
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useSidebarStore } from "@/store/sidebarStore";

function DesktopSidebar() {
  const { theme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();
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
        transition-all duration-1000
        ${theme === "light" ? "light" : "dark"}
        ${sidebar ? "min-w-[20%]" : "min-w-[5%]"}
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
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={`${baseClasses} ${
              isActive("/dashboard") ? activeClasses : inactiveClasses
            }`}
            onClick={() => navigate("/dashboard")}
          >
            <LayoutDashboard className="max-lg:w-4 max-lg:h-4 lg:w-5 lg:h-5" />
            {sidebar && <span>Dashboard</span>}
          </button>
        </TooltipTrigger>
        {!sidebar && (
          <TooltipContent side="right" align="center">
            <p>Dashboard</p>
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
            {sidebar && <span>Status Summary</span>}
          </button>
        </TooltipTrigger>
        {!sidebar && (
          <TooltipContent side="right" align="center">
            <p>Status summary</p>
          </TooltipContent>
        )}
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={`${baseClasses} ${
              isActive("/todos/priority/summary")
                ? activeClasses
                : inactiveClasses
            }`}
            onClick={() => navigate("/todos/priority/summary")}
          >
            <Flag className="max-lg:w-4 max-sm:h-4 lg:w-5 lg:h-5" />
            {sidebar && <span>Priority Summary</span>}
          </button>
        </TooltipTrigger>
        {!sidebar && (
          <TooltipContent side="right" align="center">
            <p>Priority summary</p>
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
            {sidebar && <span>All Tasks</span>}
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
              isActive("/todos/recent") ? activeClasses : inactiveClasses
            }`}
            onClick={() => navigate("/todos/recent")}
          >
            <Clock3 className="max-lg:w-4 max-sm:h-4 lg:w-5 lg:h-5" />
            {sidebar && <span>Recent Tasks</span>}
          </button>
        </TooltipTrigger>
        {!sidebar && (
          <TooltipContent side="right" align="center">
            <p>Recent Tasks</p>
          </TooltipContent>
        )}
      </Tooltip>
    </aside>
  );
}

export default DesktopSidebar;
