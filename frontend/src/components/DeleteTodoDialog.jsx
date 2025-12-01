import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import axios from "axios";
import { Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function DeleteTodoDialog({
  showIcon = false,
  btnName = "delete",
  todoId,
  btnClass,
  onDeletion,
}) {
  const navigate = useNavigate();

  async function deleteTodo() {
    try {
      await axios.delete(`http://localhost:3000/api/todos/${todoId}`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      });
      toast.success("Task deleted successfully");
    } catch (error) {
      toast.error("Task not deleted successfully");
      console.log(error);
    }
  }

  function onDelete() {
    deleteTodo();
    navigate("/todos");
    onDeletion();
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          className={`${btnClass || ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          {showIcon && (
            <Trash
              size={19}
              className="transition-all duration-300 group-hover:-translate-x-1"
            />
          )}
          {btnName}
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure to delete this task?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your task
            and remove your task from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white hover:text-white">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="cursor-pointer bg-red-500 hover:bg-red-900"
            onClick={onDelete}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteTodoDialog;
