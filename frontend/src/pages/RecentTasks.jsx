import { useThemeStore } from "@/store/themeStore";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, Flag } from "lucide-react";
import { useSidebarStore } from "@/store/sidebarStore";
import { useSearchContext } from "@/context/SearchContext";

function RecentTasks({
  limit,
  collapseHeight = true,
  widthFull = false,
  showTitle = true,
  className,
}) {
  const { search } = useSearchContext();
  const { theme } = useThemeStore();
  const { sidebar } = useSidebarStore();
  const navigate = useNavigate();

  const fetchRecentTodos = async () => {
    const response = await axios.get(`http://localhost:3000/api/recent/todos`, {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    });
    return response.data.data;
  };

  const {
    data: todos,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["recent-todos"],
    queryFn: fetchRecentTodos,
  });

  const filtered = todos?.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.status.toLowerCase().includes(search.toLowerCase()) ||
      t.priority.toLowerCase().includes(search.toLowerCase())
  );

  const visibleTodos = limit ? filtered?.slice(0, limit) : filtered;

  if (isLoading) {
    return (
      <p className="text-center m-auto text-4xl font-semibold">Loading...</p>
    );
  }

  if (isError) {
    return (
      <p className="text-center m-auto text-2xl font-semibold text-red-500">
        Failed to load recent tasks
      </p>
    );
  }

  return (
    <div
      className={`${
        collapseHeight ? "h-[calc(100vh-70px)]" : ""
      } w-full sm:px-2 sm:py-2 overflow-y-auto overflow-x-hidden custom-scroll
      ${!widthFull ? (sidebar ? "sm:w-[80%]" : "sm:w-[95%]") : "w-full"}
      ${theme === "light" ? "bg-white" : "bg-slate-800 backdrop-blur"}
      ${className}`}
    >
      {showTitle && (
        <h2 className="sm:text-3xl text-2xl text-blue-600 font-bold sm:mb-6 mb-4 text-center">
          Recent Tasks
        </h2>
      )}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visibleTodos?.map((todo, index) => (
          <motion.div
            key={todo._id}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            // transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/todos/${todo._id}`)}
            className={`group cursor-pointer rounded-2xl border-2
              p-5 shadow-md transition-all duration-50
              hover:shadow-xl hover:border-blue-500/50
              ${
                theme === "light"
                  ? "bg-white border-slate-200"
                  : "bg-slate-900 border-slate-700"
              }
            `}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Badge
                  className={`flex items-center gap-1 text-[11px] px-3 py-1 rounded-full
                    ${
                      todo.status === "pending"
                        ? "bg-red-500"
                        : todo.status === "completed"
                        ? "bg-green-700"
                        : "bg-yellow-500"
                    }
                  `}
                >
                  <span className="w-2 h-2 rounded-full bg-white/90" />
                  {todo.status.charAt(0).toUpperCase() + todo.status.slice(1)}
                </Badge>
                <Badge
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold
                  ${
                    todo.priority === "low"
                      ? "bg-green-500/15 text-green-600"
                      : todo.priority === "medium"
                      ? "bg-yellow-500/20 text-yellow-700"
                      : "bg-red-500/15 text-red-600"
                  }
                  group-hover:shadow-sm transition-all`}
                >
                  <Flag className="w-3 h-3" />
                  {todo.priority}
                </Badge>
              </div>

              <span className="text-xs text-muted-foreground">
                #{index + 1}
              </span>
            </div>

            <h3
              className={`font-semibold text-lg leading-tight mb-1 group-hover:text-blue-600 transition-colors ${
                theme === "light" ? "text-black" : "text-white"
              }`}
            >
              {todo.title?.length > 40
                ? todo.title.slice(0, 40) + "..."
                : todo.title}
            </h3>

            <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
              {todo.description}
            </p>

            <div className="flex flex-col gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>
                  Created{" "}
                  {new Date(todo.createdAt).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  Due{" "}
                  {new Date(todo.dueDate).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default RecentTasks;
