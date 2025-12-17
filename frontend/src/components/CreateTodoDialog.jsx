import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ErrorMessage from "./ErrorMessage";
import ImageUpload from "./ImageUpload";
import { createTaskFormSchema } from "@/lib/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "./ui/spinner";
import { useThemeStore } from "@/store/themeStore";
import { useAllTodoStore } from "@/store/allTodoStore";
import { formatLocalDateTime } from "@/lib/helper";

function CreateTodoDialog({ btnClass, btnName = "Edit Task", todoId }) {
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const allTodo = useAllTodoStore((state) => state.allTodo);

  const { theme } = useThemeStore();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createTaskFormSchema),
    mode: "all",
    defaultValues: {
      title: "",
      description: "",
      status: "pending",
      priority: "medium",
      image: "",
      dueDate: "",
    },
  });

  // Auto-fill form when editing
  useEffect(() => {
    if (btnName === "Edit" && open && todoId) {
      const selected = allTodo.find((t) => t._id === todoId);
      if (selected) {
        reset({
          title: selected.title,
          description: selected.description,
          status: selected.status,
          priority: selected.priority,
          dueDate: formatLocalDateTime(selected.dueDate),
          image: "",
        });
      }
    }
  }, [todoId, open, btnName, allTodo, reset]);

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
    },
  });

  const updateTodoMutation = useMutation({
    mutationFn: async (data) => {
      return axios.patch(`http://localhost:3000/api/todos/${todoId}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-access-token": localStorage.getItem("token"),
        },
      });
    },
    onSuccess: () => {
      toast.success("Task updated successfully");
      queryClient.invalidateQueries(["todos"]);
    },
  });

  const onSubmit = async (data) => {
    if (data.image && data.image[0]) data.image = data.image[0];

    if (btnName === "Edit") {
      updateTodoMutation.mutate(data, {
        onSuccess: () => {
          setFileName("");
          reset();
          setOpen(false);
        },
      });
    } else {
      createTodoMutation.mutate(data, {
        onSuccess: () => {
          setFileName("");
          reset();
          setOpen(false);
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className={btnClass}
          onClick={() =>
            !todoId &&
            reset({
              title: "",
              description: "",
              status: "pending",
              priority: "medium",
              image: "",
              dueDate: "",
            })
          }
        >
          {btnName}
        </button>
      </DialogTrigger>
      <DialogContent
        className={`sm:max-w-[525px] ${theme === "light" ? "light" : "dark"}`}
      >
        <DialogHeader>
          <DialogTitle className="font-semibold text-2xl">
            {btnName === "Edit" ? "Edit Task" : "Create Task"}
          </DialogTitle>
          <DialogDescription className="font-semibold text-md">
            {btnName === "Edit"
              ? "Edit your task here."
              : "Create your task here."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            placeholder="Task Title"
            className={`w-full border border-blue-600 text-blue-600 focus:outline-none p-2 mb-2 rounded font-bold ${
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
            className={`w-full border border-blue-600 text-blue-600 focus:outline-none p-2 mb-2 rounded font-bold h-20 max-h-32 overflow-y-auto resize-none custom-scroll ${
              errors.description
                ? "border-red-900 focus:ring focus:ring-red-900 text-red-900 placeholder-red-900"
                : "border-blue-600 focus:ring focus:ring-blue-600"
            }`}
          />
          <ErrorMessage message={errors.description?.message} />

          <input
            type="datetime-local"
            className={`w-full border border-blue-600 text-blue-600 focus:outline-none p-2 mb-2 rounded font-bold cursor-pointer ${
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

          <select
            {...register("priority")}
            className="w-full border rounded p-2 mb-2 border-blue-600 font-bold text-blue-600 focus:outline-none focus:ring focus:ring-blue-60 cursor-pointer appearance-none"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <ImageUpload
            register={register}
            fileName={fileName}
            setFileName={setFileName}
            errors={errors.image}
            labelName="Upload Task Image"
          />
          <ErrorMessage message={errors.image?.message} />

          <DialogFooter>
            <DialogClose asChild>
              <button
                className="group flex items-center justify-center gap-1 cursor-pointer font-bold text-white py-2 px-4 rounded transition-all
             bg-red-500 hover:bg-red-800 sm:mt-2"
              >
                Cancel
              </button>
            </DialogClose>
            <button
              type="submit"
              disabled={
                createTodoMutation.isPending || updateTodoMutation.isPending
              }
              className="group flex items-center justify-center gap-1 cursor-pointer font-bold text-white py-2 px-4 rounded transition-all
            bg-blue-500 hover:bg-blue-600 mt-2"
            >
              {createTodoMutation.isPending || updateTodoMutation.isPending ? (
                <>
                  <Spinner className="size-5" />
                  <span>
                    {btnName === "Edit" ? "Updating..." : "Creating..."}
                  </span>
                </>
              ) : btnName === "Edit" ? (
                "Update Task"
              ) : (
                "Create Task"
              )}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateTodoDialog;
