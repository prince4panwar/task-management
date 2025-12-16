import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MoveLeft, Calendar, Clock, ImageIcon } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import EditTodoDialog from "@/components/EditTodoDialog";
import { useTodoStore } from "@/store/todoStore";
import DeleteTodoDialog from "@/components/DeleteTodoDialog";
import { useQuery } from "@tanstack/react-query";
import { useSidebarStore } from "@/store/sidebarStore";
import { Badge } from "@/components/ui/badge";

function TodoDetails() {
  const { todoId } = useParams();
  const { theme } = useThemeStore();
  const todo = useTodoStore((state) => state.todo);
  const addTodo = useTodoStore((state) => state.addTodo);
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(false);
  const { sidebar } = useSidebarStore();

  const { isLoading, isError, refetch } = useQuery({
    queryKey: ["todoDetails", todoId],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:3000/api/todos/${todoId}`,
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      );
      addTodo(response.data.data);
      return response.data.data;
    },
  });

  useEffect(() => {
    if (!isEdit) refetch();
  }, [isEdit, refetch]);

  if (isLoading)
    return (
      <p className="text-center mt-20 text-2xl font-semibold animate-pulse">
        Loading task details...
      </p>
    );

  if (isError)
    return (
      <p className="text-center mt-20 text-2xl font-semibold text-red-500">
        Error fetching todo
      </p>
    );

  return (
    <div
      className={`flex sm:flex-row flex-col gap-4 h-[calc(100vh-70px)] px-3 py-4 w-full sm:overflow-hidden overflow-auto
        ${theme === "light" ? "light" : "dark-bg"}
        ${sidebar ? "sm:w-[80%]" : "sm:w-[95%]"}
      `}
    >
      {/* LEFT: CONTENT */}
      <div
        className={`sm:w-2/3 rounded-2xl shadow-2xl overflow-x-hidden overflow-y-auto custom-scroll
          ${theme === "light" ? "light" : "dark"}
        `}
      >
        <div
          className={`flex items-center justify-between px-4 py-2 sticky top-0 ${
            theme === "light"
              ? "light border-2 border-b-slate-300  bg-white"
              : "dark border border-b-white"
          }`}
        >
          <h1 className="text-2xl font-bold">{todo?.title}</h1>

          <Badge
            className={`px-3 py-1 text-xs rounded-full
              ${
                todo?.status === "pending"
                  ? "bg-red-500"
                  : todo?.status === "completed"
                  ? "bg-green-600"
                  : "bg-yellow-500 text-black"
              }
            `}
          >
            {todo?.status?.toUpperCase()}
          </Badge>
        </div>

        <div className="prose max-w-none text-sm sm:text-base overflow-x-hidden overflow-y-auto custom-scroll px-4 py-2">
          {todo?.description}
        </div>
      </div>

      {/* RIGHT: META */}
      <div
        className={`sm:w-1/3 rounded-2xl p-4 shadow-xl flex flex-col gap-6 overflow-x-hidden custom-scroll overflow-y-auto
          ${theme === "light" ? "light border-2" : "dark"}
        `}
      >
        {/* Image */}
        {todo?.image ? (
          <Link to={todo.image} target="_blank">
            <img
              src={todo.image}
              alt="Todo"
              className="rounded-xl object-cover shadow hover:scale-[1.02] transition"
            />
          </Link>
        ) : (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <ImageIcon className="w-4 h-4" />
            No image attached
          </div>
        )}

        {/* Dates */}
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500" />
            <span>
              <b>Created:</b>{" "}
              {new Date(todo?.createdAt).toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-orange-500" />
            <span>
              <b>Due:</b>{" "}
              {new Date(todo?.dueDate).toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col gap-3 pt-4">
          <button
            type="button"
            className="group flex items-center justify-center gap-2
              bg-blue-500 hover:bg-blue-600 text-white
              py-2 rounded-xl font-semibold transition"
            onClick={() => navigate(-1)}
          >
            <MoveLeft className="w-5 h-5 group-hover:-translate-x-1 transition" />
            My Tasks
          </button>

          <EditTodoDialog
            isIcon
            setIsEdit={setIsEdit}
            btnClass="flex items-center justify-center gap-2
              bg-green-600 hover:bg-green-700 text-white
              py-2 rounded-xl font-semibold transition"
          />

          <DeleteTodoDialog
            showIcon
            todoId={todoId}
            btnName="Delete Task"
            btnClass="flex items-center justify-center gap-2
              bg-red-500 hover:bg-red-700 text-white
              py-2 rounded-xl font-semibold transition"
          />
        </div>
      </div>
    </div>
  );
}

export default TodoDetails;
