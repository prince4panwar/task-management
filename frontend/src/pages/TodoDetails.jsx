import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MoveLeft } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import EditTodoDialog from "@/components/EditTodoDialog";
import { useTodoStore } from "@/store/todoStore";

function TodoDetails() {
  const { userId } = useParams();
  const { theme } = useThemeStore();
  const todo = useTodoStore((state) => state.todo);
  const addTodo = useTodoStore((state) => state.addTodo);
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, [isEdit]);

  async function fetchTodos() {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/todos/${userId}`,
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      );
      addTodo(response.data.data);
      setIsEdit(false);
    } catch (error) {
      console.log(error);
    }
  }

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
          style={{ "max-height": "75vh" }}
          className={`rounded-xl bg-blue-200 p-4 overflow-x-hidden overflow-y-auto custom-scroll ${
            theme === "light" ? "light" : "dark"
          }`}
        >
          <p className="font-bold">{todo?.description}</p>
        </div>
      </div>
      <div
        className={`flex flex-col items-start gap-8 p-4 rounded-xl w-1/3 bg-slate-300 ${
          theme === "light" ? "light" : "dark"
        }`}
        style={{ "max-height": "85vh" }}
      >
        {todo?.image && <img src={todo?.image} alt="image" width={300} />}
        <div>
          <p
            className={`font-bold pb-2  ${
              theme === "light" ? "text-blue-600" : "text-white"
            }`}
          >
            {todo?.status?.charAt(0).toUpperCase() + todo?.status?.slice(1)}
          </p>
          <p
            className={`font-bold pb-2 ${
              theme === "light" ? "text-blue-600" : "text-white"
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
          <div className="flex gap-3">
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default TodoDetails;
