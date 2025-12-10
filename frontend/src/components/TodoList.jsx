import React from "react";
import axios from "axios";
import { motion } from "motion/react";
import "../App.css";
import { useFormContext } from "react-hook-form";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useThemeStore } from "@/store/themeStore";
import DeleteTodoDialog from "./DeleteTodoDialog";
import { useMutation } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/useIsMobile";
import CreateTodoDialog from "./CreateTodoDialog";
import { AlertTriangle } from "lucide-react";
import { useSearchContext } from "@/context/SearchContext";

function TodosList({ todos, setSelectedTodo, fetchTodos, isLoading, isError }) {
  const { search } = useSearchContext();
  const { reset } = useFormContext();
  const { theme } = useThemeStore();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const filtered = todos.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.status.toLowerCase().includes(search.toLowerCase())
  );

  const handleEditMutation = useMutation({
    mutationFn: async (_id) => {
      const response = await axios.get(
        `http://localhost:3000/api/todos/${_id}`,
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      );
      return response.data.data;
    },
    onSuccess: (data) => {
      setSelectedTodo(data);
      reset();
    },
    onError: () => toast.error("Error fetching todo"),
  });

  const handleEdit = (_id) => {
    handleEditMutation.mutate(_id);
  };

  if (isLoading) return <p className="text-center">Loading...</p>;
  if (isError) return <p className="text-center">Error fetching todo</p>;

  return (
    <div
      className={`sm:w-2/3 w-full h-[calc(100vh-70px)] overflow-auto sm:p-2 sm:pt-0 mt-1 custom-scroll`}
    >
      <div
        className={`z-10 sm:h-[55px] text-md font-bold sm:mb-2.5 mb-1 sticky sm:rounded top-0 sm:p-4 px-1 py-3 flex sm:gap-4 justify-around bg-blue-500 text-white max-sm:shadow-[0px_2px_2px_4px_rgba(0,0,0,0.35)]`}
      >
        <span className="w-1/20 text-center text-xs sm:text-base hidden sm:block">
          S.No.
        </span>
        <span className="w-1/4 text-center text-xs sm:text-base">Title</span>
        <span className="w-1/4 text-center text-xs sm:text-base">Status</span>
        <span className="w-1/4 text-center text-xs sm:text-base">
          Date & Time
        </span>
        <span className="w-1/4 text-center text-xs sm:text-base">Actions</span>
      </div>
      {filtered?.length === 0 && (
        <div className="h-[calc(100vh-250px)] text-blue-500 text-center w-full flex justify-center flex-col items-center text-3xl font-bold">
          <AlertTriangle className="text-blue-500" size={200} />
          <p className={` ${theme === "light" ? "light" : "dark"}`}>
            No Tasks Found.
          </p>
        </div>
      )}
      <div className="px-1">
        {filtered?.map((todo, index) => (
          <motion.div
            key={todo._id}
            whileHover={{ scale: 1.009 }}
            whileTap={{ scale: 0.9991 }}
            initial={{ opacity: 0, y: -800 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center w-full sm:gap-4 p-2 mb-2.5 rounded shadow-[0px_2px_2px_2px_rgba(0,0,0,0.35)] cursor-pointer px-1 ${
              theme === "light" ? "light" : "dark"
            }`}
            onClick={() => navigate(`/todos/${todo._id}`)}
          >
            <span className="hidden sm:block w-1/20 text-center font-bold text-blue-600 sm:text-base text-[10px]">
              {index + 1}.
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
                className={`${
                  (todo.status === "pending" && "bg-red-600") ||
                  (todo.status === "completed" && "bg-green-900") ||
                  (todo.status === "in-progress" && "bg-yellow-500")
                } text-white sm:text-[11px] text-[9px]`}
              >
                {todo.status.charAt(0).toUpperCase() + todo.status.slice(1)}
              </Badge>
            </div>
            <p className="w-1/4 sm:text-base text-[10px] text-center font-semibold">
              {new Date(todo.createdAt).toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                // second: "2-digit",
                hour12: false,
              })}
            </p>
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-1/4 flex flex-col gap-2 justify-center items-center"
            >
              {isMobile ? (
                <CreateTodoDialog
                  btnName="Edit"
                  btnClass="sm:text-base text-[10px] sm:px-7.5 px-5 py-1 bg-green-500 hover:bg-green-600 text-white rounded cursor-pointer font-bold"
                  todoId={todo._id}
                />
              ) : (
                <motion.button
                  className="sm:text-base text-[10px] sm:px-7.5 px-5 py-1 bg-green-500 hover:bg-green-600 text-white rounded cursor-pointer font-bold"
                  onClick={(e) => {
                    handleEdit(todo._id);
                  }}
                >
                  Edit
                </motion.button>
              )}
              <DeleteTodoDialog
                showIcon={false}
                btnName="Delete"
                btnClass="sm:text-base text-[10px] sm:px-5 px-3 py-1 bg-red-500 hover:bg-red-700 text-white rounded cursor-pointer font-bold"
                todoId={todo._id}
                onDeletion={fetchTodos}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default TodosList;
