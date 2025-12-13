import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import { useThemeStore } from "@/store/themeStore";
import ErrorMessage from "./ErrorMessage";
import ImageUpload from "./ImageUpload";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "./ui/spinner";
import { createTaskFormSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";

function TodoForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    mode: "all",
    resolver: zodResolver(createTaskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
      status: "pending",
      image: "",
    },
  });

  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const [fileName, setFileName] = useState("");

  const queryClient = useQueryClient();

  const createTodoMutation = useMutation({
    mutationFn: async (data) => {
      return axios.post("http://localhost:3000/api/todos", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-access-token": localStorage.getItem("token"),
        },
      });
    },
    onSuccess: () => {
      toast.success("Task created successfully");
      queryClient.invalidateQueries(["todos"]);
      navigate("/todos");
    },
  });

  const onSubmit = async (data) => {
    if (data.image && data.image[0]) data.image = data.image[0];

    createTodoMutation.mutate(data, {
      onSuccess: () => {
        setFileName("");
        reset();
      },
    });
  };

  return (
    <div
      className={`h-[calc(100vh-70px)] w-full mt-0.5 sm:pt-7 bg-blue-100 overflow-auto ${
        theme === "light" ? "light" : "dark-bg"
      }`}
    >
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className={`sm:w-2/4 w-full max-sm:h-full px-4 py-8 sm:rounded-2xl m-auto sm:shadow-[0px_0px_50px_10px_rgba(0,0,0,0.35)] ${
          theme === "light" ? "light" : "dark"
        }`}
      >
        <h1 className={`text-3xl font-bold mb-3 text-center text-blue-600`}>
          Create Task
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

          <input
            type="datetime-local"
            className={`border border-blue-600 text-blue-600 focus:outline-none p-2 mb-2 rounded font-bold cursor-pointer ${
              errors.dueDate
                ? "border-red-900 focus:ring focus:ring-red-900 text-red-900 placeholder-red-900"
                : "border-blue-600 focus:ring focus:ring-blue-600"
            }`}
            onClick={(e) => e.target.showPicker()}
            {...register("dueDate")}
          />
          <ErrorMessage message={errors.dueDate?.message} />

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
            errors={errors.image}
            labelName="Upload Task Image"
          />
          <ErrorMessage message={errors.image?.message} />

          <button
            type="submit"
            disabled={createTodoMutation.isPending}
            className={`flex gap-2 justify-center items-center cursor-pointer font-bold text-white p-2 rounded transition-all mt-4 bg-blue-500 hover:bg-blue-600`}
          >
            {createTodoMutation.isPending ? (
              <>
                <Spinner className="size-5" />
                <span>Creating... </span>
              </>
            ) : (
              "Create Task"
            )}
          </button>

          {isDirty && (
            <button
              type="button"
              className={`cursor-pointer font-bold text-white p-2 rounded transition-all mt-2 bg-red-500 hover:bg-red-800`}
              onClick={() => {
                setFileName("");
                reset();
              }}
            >
              Cancel
            </button>
          )}

          <button
            type="button"
            className="cursor-pointer font-bold text-white p-2 rounded transition-all 
              bg-blue-500 hover:bg-blue-600 mt-2"
            onClick={() => navigate("/todos")}
          >
            My Tasks
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default TodoForm;
