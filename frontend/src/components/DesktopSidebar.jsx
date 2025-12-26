import { useThemeStore } from "@/store/themeStore";
import { CircleChevronLeft } from "lucide-react";
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useSidebarStore } from "@/store/sidebarStore";
import { navItems } from "@/lib/staticData";

function DesktopSidebar() {
  const { theme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebar, toggleSidebar } = useSidebarStore();

  const isActive = (path) => location.pathname === path;

  const baseClasses = `
    relative group flex items-center gap-3
    cursor-pointer font-medium
    lg:p-2.5 p-2 rounded-sm
    transition-all duration-300
    ${sidebar ? "justify-start" : "justify-center"}
  `;

  const activeClasses = `
    bg-gradient-to-r from-blue-600 to-blue-600
    text-white shadow-lg
    before:absolute before:left-0 before:top-1/2
    before:h-6 before:w-1 before:-translate-y-1/2
    before:rounded-full before:bg-white
  `;

  const inactiveClasses = `
    text-slate-600 dark:text-slate-300
    hover:bg-blue-500/15 dark:hover:bg-white/10
    hover:text-blue-600 dark:hover:text-white
  `;

  const iconClasses = "transition-transform duration-300 group-hover:scale-105";

  return (
    <aside
      className={`
        relative hidden sm:flex flex-col gap-1
        lg:py-3 p-2 h-[calc(100vh-70px)]
        transition-all duration-700
        backdrop-blur-xl z-20
        ${
          theme === "light"
            ? "dark-bg border-r border-slate-200 shadow-md"
            : "bg-slate-950 border-r border-slate-800"
        }
        ${sidebar ? "min-w-[20%]" : "min-w-[5%]"}
      `}
    >
      <CircleChevronLeft
        className={`z-20
          absolute top-4.5 -right-3 border-2 border-white
          rounded-full cursor-pointer
          transition-transform duration-500
          ${sidebar ? "rotate-0" : "rotate-180"}
          md:w-6 md:h-6 w-6 h-6
          ${
            theme === "light"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-slate-700 text-white"
          }
        `}
        onClick={toggleSidebar}
      />
      {navItems.map(({ path, label, Icon }) => (
        <Tooltip key={path}>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => navigate(path)}
              className={`
                ${baseClasses}
                ${isActive(path) ? activeClasses : inactiveClasses}
              `}
            >
              <Icon className={`lg:w-5.5 lg:h-5.5 w-4 h-4 ${iconClasses}`} />
              {sidebar && <span className="truncate">{label}</span>}
            </button>
          </TooltipTrigger>

          {!sidebar && (
            <TooltipContent side="right" align="center">
              <p>{label}</p>
            </TooltipContent>
          )}
        </Tooltip>
      ))}
    </aside>
  );
}

export default DesktopSidebar;
