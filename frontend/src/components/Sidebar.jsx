import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useThemeStore } from "@/store/themeStore";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/userStore";
import toast from "react-hot-toast";

export function Sidebar() {
  const user = useUserStore((state) => state.user);
  const deleteUser = useUserStore((state) => state.deleteUser);
  const { theme } = useThemeStore();
  const navigate = useNavigate();

  function onLogout() {
    deleteUser();
    navigate("/login");
    toast.success("Logged out successfully");
    setTimeout(() => {
      localStorage.removeItem("token");
    }, 1);
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="p-1 border rounded cursor-pointer">
          <Menu />
        </button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className={`${theme === "light" ? "light" : "dark"}`}
      >
        <SheetHeader>
          <SheetTitle>Taskify</SheetTitle>
          <SheetDescription> Welcome {user?.name}</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-2 px-3">
          <SheetClose asChild>
            <button
              type="button"
              className="cursor-pointer font-bold text-white p-2 rounded transition-all bg-blue-500 hover:bg-blue-600"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </button>
          </SheetClose>

          <SheetClose asChild>
            <button
              type="button"
              className="cursor-pointer font-bold text-white p-2 rounded transition-all bg-blue-500 hover:bg-blue-600"
              onClick={() => navigate("/todos")}
            >
              All Tasks
            </button>
          </SheetClose>

          <SheetClose asChild>
            <button
              type="button"
              className="cursor-pointer font-bold text-white p-2 rounded transition-all bg-blue-500 hover:bg-blue-600"
              onClick={() => navigate("/todos/create")}
            >
              Create Tasks
            </button>
          </SheetClose>

          <SheetClose asChild>
            <button
              type="button"
              className="cursor-pointer font-bold text-white p-2 rounded transition-all bg-blue-500 hover:bg-blue-600"
              onClick={() => navigate("/todos/status/summary")}
            >
              Tasks Summary
            </button>
          </SheetClose>

          <SheetClose asChild>
            <button
              type="button"
              className="cursor-pointer font-bold text-white p-2 rounded transition-all bg-blue-500 hover:bg-blue-600"
              onClick={() => navigate("/todos/recent")}
            >
              Recent Tasks
            </button>
          </SheetClose>
        </div>

        <SheetFooter>
          {/* <SheetClose asChild> */}
          <button
            type="button"
            className="cursor-pointer font-bold text-white p-2 rounded transition-all bg-red-500 hover:bg-red-600"
            onClick={onLogout}
          >
            Logout
          </button>
          {/* </SheetClose> */}

          <SheetClose asChild>
            <button
              type="button"
              className="cursor-pointer font-bold text-white p-2 rounded transition-all bg-red-500 hover:bg-red-600"
            >
              Close
            </button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
