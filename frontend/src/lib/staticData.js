import {
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
  {
    path: "/todos/status/summary",
    label: "Status Summary",
    Icon: ChartNoAxesCombined,
  },
  {
    path: "/todos/priority/summary",
    label: "Priority Summary",
    Icon: Flag,
  },
  { path: "/update/username", label: "Profile", Icon: User },
  { path: "/todos", label: "All Tasks", Icon: LayoutList },
  { path: "/todos/recent", label: "Recent Tasks", Icon: Clock3 },
];
