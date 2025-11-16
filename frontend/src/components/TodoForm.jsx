import React, { useEffect } from "react";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  content: z
    .string()
    .nonempty("Todo is required")
    .min(5, "At least 5 characters"),
});

function TodoForm({ selectedTodo, setSelectedTodo, fetchTodos }) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedTodo) {
      setValue("content", selectedTodo.content);
    } else {
      reset();
    }
  }, [selectedTodo, setValue, reset]);

  async function onSubmit(data) {
    try {
      if (selectedTodo) {
        await axios.patch(
          `http://localhost:3000/api/todos/${selectedTodo._id}`,
          data,
          {
            headers: {
              "x-access-token": localStorage.getItem("token"),
            },
          }
        );
      } else {
        await axios.post("http://localhost:3000/api/todos", data, {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        });
      }

      // Refresh UI
      fetchTodos();
      setSelectedTodo(null);
      reset();
    } catch (error) {
      console.log(error);
    }
  }

  function onLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div className="flex flex-col align-center p-3 w-1/3 bg-blue-100 mt-3">
      <h1 className="text-3xl font-bold mb-3 text-blue-600 text-center">
        {selectedTodo ? "Edit Todo" : "Add Todo"}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <input
          type="text"
          placeholder="Todo..."
          className="border border-blue-600 text-blue-600 focus:ring focus:ring-blue-600 focus:outline-none bg-white p-2 mb-2 rounded font-bold"
          {...register("content")}
        />
        {errors.content && (
          <span className="text-red-900 pb-3 ps-1 text-xs font-bold">
            {errors.content.message}
          </span>
        )}

        <button
          type="submit"
          className={`cursor-pointer font-bold text-white p-2 rounded transition-all ${
            selectedTodo
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {selectedTodo ? "Update Todo" : "Add Todo"}
        </button>

        <button
          type="submit"
          className="cursor-pointer font-bold text-white p-2 rounded transition-all 
              bg-blue-500 hover:bg-blue-600 mt-2"
          onClick={onLogout}
        >
          Log out
        </button>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-500 cursor-pointer font-bold hover:bg-blue-600 text-white p-2 rounded mt-2"
        >
          Create Account
        </button>
      </form>
    </div>
  );
}

export default TodoForm;
