import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "motion/react";
import { useSidebarStore } from "@/store/sidebarStore";
import { useThemeStore } from "@/store/themeStore";
import RecentTasks from "./RecentTasks";
import TodoStatusPieChart from "./TodoStatusPieChart";
import { useUserStore } from "@/store/userStore";

function Dashboard() {
  const { sidebar } = useSidebarStore();
  const user = useUserStore((state) => state.user);
  const { theme } = useThemeStore();

  const fetchSummary = async () => {
    const res = await axios.get(
      "http://localhost:3000/api/todos/status/summary",
      {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      }
    );
    return res.data.data;
  };

  const { data } = useQuery({
    queryKey: ["task-summary"],
    queryFn: fetchSummary,
  });

  const stats = [
    {
      label: "Total Tasks",
      value: data?.total || 0,
      gradient: "from-blue-500 to-blue-700",
    },
    {
      label: "Pending",
      value: data?.pending || 0,
      gradient: "from-red-500 to-red-700",
    },
    {
      label: "Completed",
      value: data?.completed || 0,
      gradient: "from-green-500 to-green-700",
    },
    {
      label: "In Progress",
      value: data?.inProgress || 0,
      gradient: "from-yellow-400 to-yellow-600",
    },
  ];

  return (
    <div
      className={`h-[calc(100vh-70px)] overflow-y-auto custom-scroll
      px-4 py-4 transition-all mt-0.5
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
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.12 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className={`rounded-2xl p-5 text-white shadow-lg
              bg-linear-to-br ${stat.gradient}`}
          >
            <p className="text-sm font-medium opacity-90">{stat.label}</p>
            <p className="text-4xl font-bold mt-2">{stat.value}</p>
          </motion.div>
        ))}
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
          <div className="flex items-center justify-between mb-3 px-2">
            <h2 className="text-xl font-semibold">Recent Tasks</h2>
            <p className="text-sm opacity-70">
              Quick access to your latest tasks
            </p>
          </div>
          <RecentTasks
            limit={3}
            collapseHeight={false}
            widthFull={true}
            className="rounded-2xl"
          />
        </motion.div>
      </div>

      <div
        className={`rounded-2xl p-5 shadow-md border-2
        ${
          theme === "light"
            ? "bg-white/80 backdrop-blur"
            : "bg-slate-800/80 backdrop-blur"
        }`}
      >
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Task Summary</h2>
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
    </div>
  );
}

export default Dashboard;
