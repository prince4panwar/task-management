import React, { useEffect, useState } from "react";
import axios from "axios";
import { useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import { useThemeStore } from "@/store/themeStore";
import ErrorMessage from "./ErrorMessage";
import ImageUpload from "./ImageUpload";

function TodoForm({ selectedTodo, setSelectedTodo, fetchTodos }) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useFormContext();
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    if (selectedTodo) {
      setValue("title", selectedTodo.title);
      setValue("description", selectedTodo.description);
      setValue("status", selectedTodo.status);
    } else {
      reset();
    }
  }, [selectedTodo, setValue, reset]);

  async function onSubmit(data) {
    if (data.image && data.image[0]) {
      data.image = data.image[0];
    }
    try {
      if (selectedTodo) {
        await axios.patch(
          `http://localhost:3000/api/todos/${selectedTodo._id}`,
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              "x-access-token": localStorage.getItem("token"),
            },
          }
        );
        toast.success("Task updated successfully");
      } else {
        await axios.post("http://localhost:3000/api/todos", data, {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-access-token": localStorage.getItem("token"),
          },
        });
        toast.success("Task created successfully");
      }

      // Refresh UI
      fetchTodos();
      setSelectedTodo(null);
      setFileName("");
      reset();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div
      className={`flex flex-col align-center p-3 w-1/3 mt-1 bg-blue-100 ${
        theme === "light" ? "light" : "dark"
      }`}
    >
      <motion.div
        initial={{ y: 300 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h1
          className={`text-3xl font-bold mb-3 text-center ${
            selectedTodo ? "text-yellow-500" : "text-blue-600"
          }`}
        >
          {selectedTodo ? "Edit Task" : "Add Task"}
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <input
            type="text"
            placeholder="Task Title"
            className={`border border-blue-600 text-blue-600 focus:outline-none p-2 mb-2 rounded font-bold ${
              errors.title
                ? "border-red-900 focus:ring focus:ring-red-900 text-red-900 placeholder-red-900"
                : "border-blue-600 focus:ring focus:ring-blue-600"
            }`}
            {...register("title")}
          />
          <ErrorMessage message={errors.title?.message} />

          <textarea
            placeholder="Task Description"
            {...register("description")}
            className={`border border-blue-600 text-blue-600 focus:outline-none p-2 mb-2 rounded font-bold h-20 max-h-32 overflow-y-auto resize-none custom-scroll ${
              errors.description
                ? "border-red-900 focus:ring focus:ring-red-900 text-red-900 placeholder-red-900"
                : "border-blue-600 focus:ring focus:ring-blue-600"
            }`}
          />
          <ErrorMessage message={errors.description?.message} />

          <select
            {...register("status")}
            className="w-full border rounded p-2 mb-2 border-blue-600 font-bold text-blue-600 focus:outline-none focus:ring focus:ring-blue-60 cursor-pointer appearance-none"
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="in-progress">In-Progress</option>
          </select>

          <ImageUpload
            register={register}
            fileName={fileName}
            setFileName={setFileName}
          />

          <button
            type="submit"
            className={`cursor-pointer font-bold text-white p-2 rounded transition-all mt-4 ${
              selectedTodo
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {selectedTodo ? "Update Task" : "Add Task"}
          </button>
          {selectedTodo && (
            <button
              type="submit"
              className={`cursor-pointer font-bold text-white p-2 rounded transition-all mt-2 bg-red-500 hover:bg-red-800`}
              onClick={() => {
                setSelectedTodo(null);
                setFileName("");
                reset();
              }}
            >
              Cancel Update
            </button>
          )}
          <button
            type="button"
            className="cursor-pointer font-bold text-white p-2 rounded transition-all 
              bg-blue-500 hover:bg-blue-600 mt-2"
            onClick={() => navigate("/todos/status/summary")}
          >
            Tasks Summary
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default TodoForm;
