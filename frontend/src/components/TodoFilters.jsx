import { useThemeStore } from "@/store/themeStore";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

function TodoFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { theme } = useThemeStore();

  const initialSearch = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const priority = searchParams.get("priority") || "";
  const [localSearch, setLocalSearch] = useState(initialSearch);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        if (!localSearch) params.delete("search");
        else params.set("search", localSearch);
        return params;
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, [localSearch, setSearchParams]);

  const updateParam = (key, value) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.delete("page"); // Reset to first page on filter change
      if (!value) params.delete(key); // Remove param if value is empty
      else params.set(key, value);
      return params;
    });
  };

  return (
    <div
      className={`z-10 text-md font-bold mb-0.5 sm:py-1 sm:px-1 flex sm:gap-1 gap-0.5 text-blue-500 shadow-lg ${
        theme === "light" ? "bg-white" : "bg-slate-900"
      }`}
    >
      <input
        type="text"
        placeholder="Search Title..."
        className="sm:w-1/3 w-2/4 border rounded sm:p-2 p-1 border-blue-600 font-bold focus:outline-none focus:ring cursor-pointer sm:text-sm text-xs"
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
      />

      <select
        className="sm:w-1/3 w-1/4 border rounded sm:p-2 p-1 border-blue-600 font-bold focus:outline-none focus:ring cursor-pointer appearance-none sm:text-sm text-xs"
        value={status}
        onChange={(e) => updateParam("status", e.target.value)}
      >
        <option value="">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
        <option value="in-progress">In-Progress</option>
      </select>

      <select
        className="sm:w-1/3 w-1/4 border rounded sm:p-2 p-1 border-blue-600 font-bold focus:outline-none focus:ring cursor-pointer appearance-none sm:text-sm text-xs"
        value={priority}
        onChange={(e) => updateParam("priority", e.target.value)}
      >
        <option value="">All Priorities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </div>
  );
}

export default TodoFilters;
