import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "motion/react";
import { useSidebarStore } from "@/store/sidebarStore";
import { useThemeStore } from "@/store/themeStore";
import RecentTasks from "./RecentTasks";
import TodoStatusPieChart from "./TodoStatusChart";
import { useUserStore } from "@/store/userStore";
import { Flag } from "lucide-react";
import TodoPriorityPieChart from "./TodoPriorityChart";
import { useNavigate } from "react-router-dom";
import ExportExcelButton from "@/components/ExportExcelButton";
import { BASE_URL } from "@/config/api";

function Dashboard() {
  const { sidebar } = useSidebarStore();
  const user = useUserStore((state) => state.user);
  const { theme } = useThemeStore();
  const navigate = useNavigate();

  const fetchStatusSummary = async () => {
    const res = await axios.get(`${BASE_URL}/api/todos/status/summary`, {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    });
    return res.data.data;
  };

  const fetchPrioritySummary = async () => {
    const res = await axios.get(`${BASE_URL}/api/todos/priority/summary`, {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    });
    return res.data.data;
  };

  const { data: status } = useQuery({
    queryKey: ["task-summary"],
    queryFn: fetchStatusSummary,
  });

  const { data: priority } = useQuery({
    queryKey: ["priority-summary"],
    queryFn: fetchPrioritySummary,
  });

  const statusStats = [
    {
      label: "Total Tasks",
      value: status?.total || 0,
      gradient: "from-blue-500 to-blue-700",
      link: "/todos",
    },
    {
      label: "Pending",
      value: status?.pending || 0,
      gradient: "from-red-500 to-red-700",
      link: "/todos?status=pending",
    },
    {
      label: "Completed",
      value: status?.completed || 0,
      gradient: "from-green-500 to-green-700",
      link: "/todos?status=completed",
    },
    {
      label: "In Progress",
      value: status?.inProgress || 0,
      gradient: "from-yellow-400 to-yellow-600",
      link: "/todos?status=in-progress",
    },
  ];

  const priorityStats = [
    {
      label: "Low Priority",
      value: priority?.low || 0,
      color: "text-green-600",
      bg: "bg-green-500/15",
      link: "/todos?priority=low",
    },
    {
      label: "Medium Priority",
      value: priority?.medium || 0,
      color: "text-yellow-600",
      bg: "bg-yellow-500/20",
      link: "/todos?priority=medium",
    },
    {
      label: "High Priority",
      value: priority?.high || 0,
      color: "text-red-600",
      bg: "bg-red-500/15",
      link: "/todos?priority=high",
    },
  ];

  return (
    <div
      className={`h-[calc(100vh-70px)] overflow-y-auto custom-scroll
      sm:px-4 sm:py-4 p-1.5 transition-all w-full
      ${sidebar ? "sm:w-[80%]" : "sm:w-[95%]"}
      ${theme === "light" ? "light" : "dark"}`}
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-blue-500">
            Dashboard
          </h1>
          <h2 className="sm:block hidden text-xl font-bold tracking-tight text-blue-500 opacity-80">
            Welcome {user?.name} 👋
          </h2>
        </div>
        <p className="text-sm opacity-70 mt-1">
          Track your progress and manage tasks efficiently
        </p>
        <div className="w-full flex sm:justify-end mt-2">
          <ExportExcelButton />
        </div>
      </motion.div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {statusStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.12 }}
            whileHover={{ y: -4 }}
            className={`rounded-2xl p-5 text-white shadow-lg cursor-pointer
              bg-linear-to-br ${stat.gradient}`}
            onClick={() => navigate(stat.link)}
          >
            <p className="text-sm font-medium opacity-90">{stat.label}</p>
            <p className="text-4xl font-bold mt-2">{stat.value}</p>
          </motion.div>
        ))}
      </div>
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Task Priority Overview</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {priorityStats.map((priority, index) => (
            <motion.div
              key={priority.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className={`rounded-2xl p-5 border-2 cursor-pointer hover:shadow-lg
                ${
                  theme === "light"
                    ? "bg-white border-slate-200"
                    : "bg-slate-800 border-slate-700"
                }`}
              onClick={() => navigate(priority.link)}
            >
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-full ${priority.bg}`}>
                  <Flag className={`w-5 h-5 ${priority.color}`} />
                </div>
                <span className="text-3xl font-bold">{priority.value}</span>
              </div>

              <p className="mt-3 text-sm font-medium opacity-80">
                {priority.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`rounded-2xl border-2 p-3 shadow-md
            ${
              theme === "light"
                ? "bg-white/80 backdrop-blur"
                : "bg-slate-800/80 backdrop-blur"
            }`}
        >
          <div className="flex items-center justify-between mb-3 sm:px-2">
            <h2 className="text-xl font-semibold">Recent Tasks</h2>
            <p className="text-sm opacity-70">
              Quick access to your latest tasks
            </p>
          </div>

          <RecentTasks
            limit={3}
            collapseHeight={false}
            widthFull={true}
            showTitle={false}
            className="rounded-2xl"
          />
        </motion.div>
      </div>

      <div className="flex gap-4 max-sm:flex-col">
        <div
          className={`rounded-2xl sm:p-5 p-3 shadow-md border-2 sm:w-1/2 w-full
        ${theme === "light" ? "bg-white/80 backdrop-blur" : "bg-slate-800"}`}
        >
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Task Status Summary</h2>
            <p className="text-sm opacity-70">
              Visual overview of task status distribution
            </p>
          </div>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-center rounded-xl border
          border-dashed border-slate-300 dark:border-slate-600 p-4"
          >
            <TodoStatusPieChart
              showLegend={false}
              showButton={false}
              showLabel={false}
              collapseHeight={false}
            />
          </motion.div>
        </div>

        <div
          className={`rounded-2xl sm:p-5 p-3 shadow-md border-2 sm:w-1/2 w-full
        ${theme === "light" ? "bg-white/80 backdrop-blur" : "bg-slate-800"}`}
        >
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Task Priority Summary</h2>
            <p className="text-sm opacity-70">
              Visual overview of task priority distribution
            </p>
          </div>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-center rounded-xl border
          border-dashed border-slate-300 dark:border-slate-600 p-4"
          >
            <TodoPriorityPieChart
              showLegend={false}
              showButton={false}
              showLabel={false}
              collapseHeight={false}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
