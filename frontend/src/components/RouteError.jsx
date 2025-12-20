import React from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { useSidebarStore } from "@/store/sidebarStore";
import { useThemeStore } from "@/store/themeStore";

function RouteError({
  title = "Something went wrong",
  message = "The page failed to load. Please try again.",
}) {
  const { sidebar } = useSidebarStore();
  const { theme } = useThemeStore();
  return (
    <div
      className={`h-[calc(100vh-70px)] w-full flex items-center justify-center px-4  ${
        sidebar ? "sm:w-[80%]" : "sm:w-[95%]"
      }
      ${theme === "light" ? "light" : "bg-slate-800"}`}
    >
      <div
        className={`w-full max-w-md rounded-2xl bg-white p-8 text-center  ${
          theme === "light" ? "light shadow-xl" : "dark"
        }`}
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-7 w-7 text-red-600" />
        </div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="mt-2 text-sm text-gray-500">{message}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-md transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <RefreshCcw className="h-4 w-4" />
          Retry
        </button>
      </div>
    </div>
  );
}

export default RouteError;
