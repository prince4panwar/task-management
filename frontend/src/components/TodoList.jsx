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

function TodosList({ todos, setSelectedTodo, fetchTodos }) {
  const { reset } = useFormContext();
  const navigate = useNavigate();
  const { theme } = useThemeStore();

  async function handleEdit(_id) {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/todos/${_id}`,
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      );
      setSelectedTodo(response.data.data);
      reset();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div
      className={`w-2/3 overflow-auto p-2 pt-0 mt-1 custom-scroll`}
      style={{
        height: "calc(100vh - 70px)",
      }}
    >
      <div
        className={`z-10 text-md font-bold mb-2.5 sticky rounded top-0 p-4 flex gap-4 justify-around bg-blue-500 text-white`}
        style={{
          height: "55px",
        }}
      >
        <span className="w-1/20 text-center">S.No.</span>
        <span className="w-1/4 text-center">Title</span>
        <span className="w-1/4 text-center">Status</span>
        <span className="w-1/4 text-center">Date & Time</span>
        <span className="w-1/4 text-center">Actions</span>
      </div>
      {todos?.length === 0 && (
        <p
          className={`text-gray-500 text-center w-full flex justify-center items-center text-3xl font-bold ${
            theme === "light" ? "light" : "dark"
          }`}
          style={{
            height: "calc(100vh - 150px)",
          }}
        >
          No Tasks yet.
        </p>
      )}
      <div className="px-1">
        {todos?.map((todo, index) => (
          <motion.div
            key={todo._id}
            whileHover={{ scale: 1.009 }}
            whileTap={{ scale: 0.99 }}
            initial={{ opacity: 0, y: -800 }}
            animate={{ opacity: 1, y: 0 }}
            // transition={{ delay: 0.2 }}
            // transition={{ delay: index * 0.2, type: "spring" }}
            className={`flex items-center w-full gap-4 p-2 mb-2.5 rounded shadow-[0px_2px_2px_2px_rgba(0,0,0,0.35)] cursor-pointer px-1 ${
              theme === "light" ? "light" : "dark"
            }`}
            onClick={() => navigate(`/todos/${todo._id}`)}
          >
            <span className="w-1/20 text-center font-bold text-blue-600">
              {index + 1}.
            </span>
            <div className="w-1/4">
              <p className="text-center font-semibold">
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
                } text-white`}
              >
                {todo.status.charAt(0).toUpperCase() + todo.status.slice(1)}
              </Badge>
            </div>
            <p className="w-1/4 text-center font-semibold">
              {/* {new Date(todo.createdAt).toLocaleString()} */}
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
              <motion.button
                className="px-5 py-1 w-1/2 bg-green-500 hover:bg-green-600 text-white rounded cursor-pointer font-bold"
                onClick={(e) => {
                  // e.stopPropagation();
                  handleEdit(todo._id);
                }}
              >
                Edit
              </motion.button>
              <DeleteTodoDialog
                showIcon={false}
                btnName="Delete"
                btnClass="px-5 py-1 w-1/2 bg-red-500 hover:bg-red-700 text-white rounded cursor-pointer font-bold"
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
