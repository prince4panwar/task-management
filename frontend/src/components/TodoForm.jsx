import React, { useEffect } from "react";
import axios from "axios";
import { useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
// import { Textarea } from "./ui/textarea";

function TodoForm({ selectedTodo, setSelectedTodo, fetchTodos }) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const navigate = useNavigate();

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
      reset();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex flex-col align-center p-3 w-1/3 bg-blue-100 mt-1">
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
          {errors.title && (
            <span className="text-red-900 pb-3 ps-1 text-xs font-bold">
              {errors.title.message}
            </span>
          )}

          <textarea
            placeholder="Task Description"
            {...register("description")}
            className={`border border-blue-600 text-blue-600 focus:outline-none p-2 mb-2 rounded font-bold h-20 max-h-32 overflow-y-auto resize-none custom-scroll ${
              errors.description
                ? "border-red-900 focus:ring focus:ring-red-900 text-red-900 placeholder-red-900"
                : "border-blue-600 focus:ring focus:ring-blue-600"
            }`}
          />
          {errors.description && (
            <span className="text-red-900 pb-3 ps-1 text-xs font-bold">
              {errors.description.message}
            </span>
          )}
          <Select
            value={watch("status")} // bind value
            onValueChange={(value) => {
              setValue("status", value, { shouldValidate: true });
            }} // update RHF
          >
            <SelectTrigger className="w-full border rounded py-5 border-blue-600 font-bold text-blue-600 focus:outline-none">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-blue-600 text-white">
              <SelectGroup>
                <SelectItem
                  value="pending"
                  className="hover:bg-blue-100 hover:text-blue-600 cursor-pointer font-bold"
                >
                  Pending
                </SelectItem>
                <SelectItem
                  value="completed"
                  className="hover:bg-blue-100 hover:text-blue-600 cursor-pointer font-bold"
                >
                  Completed
                </SelectItem>
                <SelectItem
                  value="in-progress"
                  className="hover:bg-blue-100 hover:text-blue-600 cursor-pointer font-bold"
                >
                  In-Progress
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Input
            type="file"
            className="text-blue-600 border border-blue-600 mt-2 rounded cursor-pointer"
            {...register("image")}
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
