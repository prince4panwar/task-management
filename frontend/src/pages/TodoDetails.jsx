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

  if (isLoading) return <p className="text-center">Loading...</p>;
  if (isError) return <p className="text-center">Error fetching todo</p>;

  return (
    <div
      className={`flex gap-4 h-full px-4 py-6 ${
        theme === "light" ? "light" : "dark-bg"
      }`}
    >
      <div className="w-2/3">
        <p
          className={`font-bold p-4 bg-blue-200 rounded-xl mb-4 ${
            theme === "light" ? "light" : "dark"
          }`}
        >
          {todo?.title}
        </p>
        <div
          className={`max-h-[75vh] rounded-xl bg-blue-200 p-4 overflow-x-hidden overflow-y-auto custom-scroll ${
            theme === "light" ? "light" : "dark"
          }`}
        >
          <p className="font-bold">{todo?.description}</p>
        </div>
      </div>
      <div
        className={`max-h-[85vh] flex flex-col items-start gap-8 p-4 rounded-xl w-1/3 bg-blue-200 ${
          theme === "light" ? "light" : "dark"
        }`}
      >
        <Link to={todo?.image} target="_blank" rel="noopener noreferrer">
          {todo?.image && <img src={todo?.image} alt="image" width={300} />}
        </Link>
        <div>
          <p
            className={`font-bold pb-2 ${
              theme === "light" ? "text-black" : "text-white"
            }`}
          >
            {todo?.status?.charAt(0).toUpperCase() + todo?.status?.slice(1)}
          </p>
          <p
            className={`font-bold pb-2 ${
              theme === "light" ? "text-black" : "text-white"
            }`}
          >
            {new Date(todo?.createdAt).toLocaleString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </p>
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              className="group flex items-center gap-1 cursor-pointer font-semibold text-white py-2 px-4 rounded transition-all
              bg-blue-500 hover:bg-blue-600 mt-2"
              onClick={() => navigate("/todos")}
            >
              <MoveLeft className="transition-all duration-300 group-hover:-translate-x-2" />
              My Tasks
            </button>

            <EditTodoDialog setIsEdit={setIsEdit} />

            <DeleteTodoDialog
              showIcon={true}
              btnName="Delete Task"
              todoId={todoId}
              btnClass="group flex items-center gap-2 cursor-pointer font-semibold text-white py-2 px-4 rounded transition-all
              bg-red-500 hover:bg-red-700 mt-2 "
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TodoDetails;
