import {
  CalendarClock,
  ChartNoAxesCombined,
  ClipboardPlus,
  Clock3,
  Flag,
  LayoutDashboard,
  LayoutList,
  User,
} from "lucide-react";

export const navItems = [
  { path: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { path: "/todos/create", label: "Create Tasks", Icon: ClipboardPlus },
  { path: "/todos", label: "All Tasks", Icon: LayoutList },
  {
    path: "/todos/analytics",
    label: "Tasks Analytics",
    Icon: ChartNoAxesCombined,
  },
  { path: "/todos/recent", label: "Recent Tasks", Icon: Clock3 },
  { path: "/todos/overdue", label: "Overdue Tasks", Icon: CalendarClock },
  { path: "/update/username", label: "Profile", Icon: User },
];
