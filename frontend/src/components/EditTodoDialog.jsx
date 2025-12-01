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
import { SquarePen } from "lucide-react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTodoStore } from "@/store/todoStore";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ErrorMessage from "./ErrorMessage";
import ImageUpload from "./ImageUpload";

const schema = z.object({
  title: z
    .string()
    .nonempty("Title must be required")
    .min(5, "Title must be at least 5 characters long")
    .max(125, "Title must be at most 125 characters long"),
  description: z
    .string()
    .nonempty("Description must be required")
    .min(5, "Description must be at least 5 characters long"),
  status: z.string(),
  image: z.any(),
});

function EditTodoDialog({ setIsEdit }) {
  const { userId } = useParams();
  const todo = useTodoStore((state) => state.todo);
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: todo.title,
      description: todo.description,
      status: todo.status,
      image: "",
    },
  });

  useEffect(() => {
    if (todo) {
      reset({
        title: todo.title || "",
        description: todo.description || "",
        status: todo.status || "",
        image: "",
      });
    }
  }, [todo, reset]);

  async function editTodo(data) {
    try {
      await axios.patch(`http://localhost:3000/api/todos/${userId}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-access-token": localStorage.getItem("token"),
        },
      });
      setIsEdit(true);
      setOpen(false);
      toast.success("Task updated successfully");
    } catch (error) {
      console.log(error);
    }
  }

  function onSubmit(data) {
    if (data.image && data.image[0]) {
      data.image = data.image[0];
    }
    setFileName("");
    editTodo(data);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="group flex items-center gap-2 cursor-pointer font-semibold text-white py-2 px-4 rounded transition-all
             bg-green-700 hover:bg-green-700 mt-2"
        >
          <SquarePen
            size={19}
            className="transition-all duration-300 group-hover:-translate-x-1"
          />
          Edit Task
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="font-semibold text-2xl">
            Edit Task
          </DialogTitle>
          <DialogDescription className="font-semibold text-md">
            Make changes to your task here.
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

          <DialogFooter>
            <DialogClose asChild>
              <button
                className="group flex items-center gap-1 cursor-pointer font-bold text-white py-2 px-4 rounded transition-all
             bg-red-500 hover:bg-red-800 mt-2"
              >
                Cancel
              </button>
            </DialogClose>
            <button
              type="submit"
              className="group flex items-center gap-1 cursor-pointer font-bold text-white py-2 px-4 rounded transition-all
            bg-blue-500 hover:bg-blue-600 mt-2"
            >
              Save changes
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditTodoDialog;
