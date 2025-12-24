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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useThemeStore } from "@/store/themeStore";
import { BASE_URL } from "@/config/api";

function DeleteTodoDialog({
  showIcon = false,
  btnName = "delete",
  todoId,
  btnClass,
  onDeletion,
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { theme } = useThemeStore();

  const deleteTodoMutation = useMutation({
    mutationFn: async () => {
      return axios.delete(`${BASE_URL}/api/todos/${todoId}`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      });
    },
    onSuccess: () => {
      toast.success("Task deleted successfully");
      queryClient.invalidateQueries(["todos"]); // refresh todo list
      navigate("/todos");
      onDeletion?.();
    },
    onError: () => {
      toast.error("Task not deleted successfully");
    },
  });

  const onDelete = () => deleteTodoMutation.mutate();

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
          {deleteTodoMutation.isPending ? "Deleting..." : btnName}
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent className={`${theme === "light" ? "light" : "dark"}`}>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure to delete this task?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. It will permanently delete your task.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white hover:text-white">
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            className="cursor-pointer bg-red-500 hover:bg-red-900"
            onClick={onDelete}
            disabled={deleteTodoMutation.isPending}
          >
            {deleteTodoMutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteTodoDialog;
