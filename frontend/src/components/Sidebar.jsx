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

export function Sidebar() {
  const { theme } = useThemeStore();
  const navigate = useNavigate();

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
        </SheetHeader>

        <div className="flex flex-col gap-2 px-3">
          <SheetClose asChild>
            <button
              type="button"
              className="cursor-pointer font-bold text-white p-2 rounded transition-all bg-blue-500 hover:bg-blue-600"
              onClick={() => navigate("/todos")}
            >
              My Tasks
            </button>
          </SheetClose>

          <SheetClose asChild>
            <button
              type="button"
              className="cursor-pointer font-bold text-white p-2 rounded transition-all bg-blue-500 hover:bg-blue-600"
              onClick={() => navigate("/todos")}
            >
              Create Task
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
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <button
              type="button"
              className="cursor-pointer font-bold text-white p-2 rounded transition-all bg-red-500 hover:bg-red-600 mt-2"
            >
              Close
            </button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
