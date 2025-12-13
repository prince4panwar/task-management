import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MoveLeft } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import EditTodoDialog from "@/components/EditTodoDialog";
import { useTodoStore } from "@/store/todoStore";
import DeleteTodoDialog from "@/components/DeleteTodoDialog";
import { useQuery } from "@tanstack/react-query";

function TodoDetails() {
  const { todoId } = useParams();
  const { theme } = useThemeStore();
  const todo = useTodoStore((state) => state.todo);
  const addTodo = useTodoStore((state) => state.addTodo);
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(false);

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

  // When editing is done, refetch todo data
  useEffect(() => {
    if (isEdit === false) {
      refetch();
    }
  }, [isEdit, refetch]);

  if (isLoading)
    return (
      <p className="text-center m-auto text-4xl font-semibold">Loading...</p>
    );
  if (isError)
    return (
      <p className="text-center m-auto text-4xl font-semibold">
        Error fetching todo
      </p>
    );

  return (
    <div
      className={`flex sm:flex-row flex-col sm:overflow-hidden overflow-auto sm:gap-4 gap-1 h-[calc(100vh-70px)] sm:px-4 p-1 sm:py-2 w-full mt-1 ${
        theme === "light" ? "light" : "dark-bg"
      }`}
    >
      <div className="sm:w-2/3">
        <p
          className={`font-bold sm:p-4 p-2 bg-blue-200 sm:rounded-xl rounded-sm text-sm sm:text-base sm:mb-4 mb-1 ${
            theme === "light" ? "light" : "dark"
          }`}
        >
          {todo?.title}
        </p>
        <div
          className={`sm:max-h-[75vh] max-h-[50vh] sm:rounded-xl rounded-sm bg-blue-200 sm:p-4 p-2 overflow-x-hidden overflow-y-auto custom-scroll ${
            theme === "light" ? "light" : "dark"
          }`}
        >
          <p className="font-bold text-sm sm:text-base">{todo?.description}</p>
        </div>
      </div>
      <div
        className={`max-h-[85vh] flex flex-col items-start sm:gap-8 gap-3 sm:p-4 p-2 sm:rounded-xl rounded-sm sm:w-1/3 bg-blue-200 ${
          theme === "light" ? "light" : "dark"
        }`}
      >
        <Link to={todo?.image} target="_blank" rel="noopener noreferrer">
          {todo?.image && <img src={todo?.image} alt="image" width={300} />}
        </Link>
        <div className="w-full sm:w-auto">
          <p
            className={`font-semibold pb-2 ${
              theme === "light" ? "text-black" : "text-white"
            }`}
          >
            <b>Status {" : "}</b>
            {todo?.status?.charAt(0).toUpperCase() + todo?.status?.slice(1)}
          </p>
          <p
            className={`font-semibold  pb-2 ${
              theme === "light" ? "text-black" : "text-white"
            }`}
          >
            <b>Creation Date {" : "}</b>
            {new Date(todo?.createdAt).toLocaleString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </p>

          <p
            className={`font-semibold pb-2 ${
              theme === "light" ? "text-black" : "text-white"
            }`}
          >
            <b>Due Date {" : "}</b>
            {new Date(todo?.dueDate).toLocaleString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </p>
          <div className="flex lg:flex-row sm:flex-wrap flex-col sm:gap-1 sm:mt-4">
            <button
              type="button"
              className="group flex items-center justify-center sm:gap-2 gap-4 cursor-pointer font-semibold text-white py-2 px-3 rounded transition-all
              bg-blue-500 hover:bg-blue-600 mt-2 text-base"
              onClick={() => navigate("/todos")}
            >
              <MoveLeft className="transition-all duration-300 group-hover:-translate-x-1" />
              My Tasks
            </button>

            <EditTodoDialog
              isIcon
              setIsEdit={setIsEdit}
              btnClass="group flex items-center justify-center sm:gap-2 gap-4 cursor-pointer font-semibold text-white py-2 px-3 rounded transition-all
             bg-green-700 hover:bg-green-700 mt-2 "
            />

            <DeleteTodoDialog
              showIcon={true}
              btnName="Delete Task"
              todoId={todoId}
              btnClass="group flex items-center justify-center sm:gap-2 gap-4 cursor-pointer font-semibold text-white py-2 px-3 rounded transition-all
              bg-red-500 hover:bg-red-700 mt-2 "
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TodoDetails;
