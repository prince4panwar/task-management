import React, { useEffect } from "react";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  name: z.string().nonempty("Name is required").min(3, "At least 3 characters"),
  email: z.string().nonempty("Email is required").email("Invalid email"),
  content: z
    .string()
    .nonempty("Content is required")
    .min(8, "At least 8 characters"),
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

  useEffect(() => {
    if (selectedTodo) {
      setValue("name", selectedTodo.name);
      setValue("email", selectedTodo.email);
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

  return (
    <div className="flex flex-col align-center p-2 w-1/3">
      <h1 className="text-3xl font-bold mb-3">
        {selectedTodo ? "Edit Todo" : "Add Todo"}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <input
          type="text"
          placeholder="Email..."
          className="border p-2 mb-2 rounded font-bold"
          {...register("email")}
        />
        {errors.email && (
          <span className="text-red-900 pb-3 ps-1 text-xs font-bold">
            {errors.email.message}
          </span>
        )}

        <input
          type="text"
          placeholder="Name..."
          className="border p-2 mb-2 rounded font-bold"
          {...register("name")}
        />
        {errors.name && (
          <span className="text-red-900 pb-3 ps-1 text-xs font-bold">
            {errors.name.message}
          </span>
        )}

        <input
          type="text"
          placeholder="Content..."
          className="border p-2 mb-2 rounded font-bold"
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
      </form>
    </div>
  );
}

export default TodoForm;
