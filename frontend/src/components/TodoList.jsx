import React, { useState } from "react";
import { motion } from "motion/react";
import "../App.css";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useThemeStore } from "@/store/themeStore";
import DeleteTodoDialog from "./DeleteTodoDialog";
import CreateTodoDialog from "./CreateTodoDialog";
import { AlertTriangle } from "lucide-react";
import { useSearchContext } from "@/context/SearchContext";
import Pagination from "./Pagination";
import { useSidebarStore } from "@/store/sidebarStore";
import TasksSkeleton from "./skeletons/TasksSkeleton";
import ErrorState from "./ErrorState";
import TodoFilters from "./TodoFilters";

function TodosList({
  todos,
  fetchTodos,
  isLoading,
  isError,
  pagination,
  page,
}) {
  const { search } = useSearchContext();
  const { theme } = useThemeStore();
  const navigate = useNavigate();
  const { sidebar } = useSidebarStore();

  const filtered = todos.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.status.toLowerCase().includes(search.toLowerCase()) ||
      t.priority.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return <TasksSkeleton />;
  }
  if (isError) {
    return <ErrorState title="Error To Fetch Tasks" />;
  }

  return (
    <div
      className={`h-[calc(100vh-110px)] w-full overflow-y-auto overflow-x-hidden custom-scroll ${
        sidebar ? "md:w-[80%]" : "md:w-[95%]"
      }         ${theme === "light" ? "bg-white mt-0.5" : "bg-slate-700"}`}
    >
      <TodoFilters />
      <div className="sm:p-1 sm:pt-0">
        <div
          className={`sm:h-[55px] z-10 text-md font-bold sm:mb-1.5 mb-1 sticky sm:rounded-b-lg top-0 sm:p-4 px-1 py-3 flex sm:gap-4 justify-around bg-blue-500 text-white shadow-lg`}
        >
          <span className="w-1/20 text-center text-xs sm:text-base hidden sm:block">
            S.No.
          </span>
          <span className="w-1/4 text-center text-xs sm:text-base">Title</span>
          <span className="w-1/4 text-center text-xs sm:text-base">Status</span>
          <span className="w-1/4 text-center text-xs sm:text-base sm:block hidden">
            Created
          </span>
          <span className="w-1/4 text-center text-xs sm:text-base">
            Priority
          </span>
          <span className="w-1/4 text-center text-xs sm:text-base">Due</span>
          <span className="w-1/4 text-center text-xs sm:text-base">
            Actions
          </span>
        </div>

        {filtered?.length === 0 && (
          <div className="h-[calc(100vh-250px)] text-blue-500 text-center w-full flex justify-center flex-col items-center text-3xl font-bold">
            <AlertTriangle className="text-blue-500" size={200} />
            <p className={` ${theme === "light" ? "light" : ""}`}>
              No Tasks Found.
            </p>
          </div>
        )}

        <div className="px-0.5 max-sm:py-0.5">
          {filtered?.map((todo, index) => (
            <motion.div
              key={todo._id}
              whileHover={{ scale: 1.0019 }}
              whileTap={{ scale: 0.999 }}
              initial={{ opacity: 0, y: -300 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center w-full sm:gap-4 p-1 sm:mb-1.5 mb-1 rounded-2xl cursor-pointer px-1 border-2 ${
                theme === "light"
                  ? "light shadow hover:shadow-md border-slate-200"
                  : "dark border border-slate-400 hover:border-blue-600"
              }`}
              onClick={() => navigate(`/todos/${todo._id}`)}
            >
              <span className="hidden sm:block w-1/20 text-center font-bold text-blue-600 sm:text-base text-[10px]">
                {Number(page) > 0
                  ? (Number(page) - 1) * 10 + (Number(index) + 1)
                  : Number(index) + 1}
                .
              </span>

              <div className="w-1/4">
                <p className="text-center font-semibold sm:text-base text-[10px]">
                  {todo.title?.length > 25
                    ? todo.title.slice(0, 25) + "..."
                    : todo.title}
                </p>
              </div>

              <div className="w-1/4 text-center">
                <Badge
                  className={`sm:px-3 sm:py-1 text-xs ${
                    (todo.status === "pending" && "bg-red-600") ||
                    (todo.status === "completed" && "bg-green-700") ||
                    (todo.status === "in-progress" && "bg-yellow-500")
                  } text-white sm:text-[11px] text-[9px]`}
                >
                  {todo.status.charAt(0).toUpperCase() + todo.status.slice(1)}
                </Badge>
              </div>

              <p className="w-1/4 sm:text-base text-[10px] text-center font-semibold sm:block hidden">
                {new Date(todo.createdAt).toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  // hour: "2-digit",
                  // minute: "2-digit",
                  // hour12: true,
                })}
              </p>

              <div className="w-1/4 text-center">
                <Badge
                  className={`sm:px-3 sm:py-1 text-xs ${
                    todo.priority === "low"
                      ? "bg-green-500/25 text-green-700"
                      : todo.priority === "medium"
                      ? "bg-yellow-500/20 text-yellow-700"
                      : "bg-red-500/20 text-red-600"
                  }  sm:text-[11px] text-[9px]`}
                >
                  {/* {todo.priority?.charAt(0).toUpperCase() +
                    todo.priority?.slice(1)} */}
                  {todo?.priority}
                </Badge>
              </div>

              <p className="w-1/4 sm:text-base text-[10px] text-center font-semibold">
                {new Date(todo.dueDate).toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  // hour: "2-digit",
                  // minute: "2-digit",
                  // hour12: true,
                })}
              </p>

              <div
                onClick={(e) => e.stopPropagation()}
                className="w-1/4 flex flex-col gap-1 justify-center items-center"
              >
                <CreateTodoDialog
                  btnName="Edit"
                  btnClass="sm:text-base text-[10px] sm:px-7.5 px-5 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg cursor-pointer font-bold"
                  todoId={todo._id}
                />

                <DeleteTodoDialog
                  showIcon={false}
                  btnName="Delete"
                  btnClass="sm:text-base text-[10px] sm:px-5 px-3 py-1 bg-red-500 hover:bg-red-700 text-white rounded-lg cursor-pointer font-bold"
                  todoId={todo._id}
                  onDeletion={fetchTodos}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <Pagination pagination={pagination} />
    </div>
  );
}

export default TodosList;
