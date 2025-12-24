import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useThemeStore } from "@/store/themeStore";
import { useSidebarStore } from "@/store/sidebarStore";
import TodoPriorityPieChart from "./TodoPriorityChart";
import TodoStatusPieChart from "./TodoStatusChart";
import ChartCard from "@/components/ChartCard";
import RecentTasksSkeleton from "@/components/skeletons/RecentTasksSkeleton";
import ErrorState from "@/components/ErrorState";

const fetchTodoSummary = async () => {
  const res = await axios.get(
    "http://localhost:3000/api/todos/summary/status-priority",
    {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    }
  );
  return res.data.data;
};

function TodoStatusPriorityChart() {
  const { theme } = useThemeStore();
  const { sidebar } = useSidebarStore();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["todo-status-priority-summary"],
    queryFn: fetchTodoSummary,
  });

  if (isLoading) {
    return <RecentTasksSkeleton />;
  }

  if (isError) {
    return <ErrorState title="Failed to load chart data" />;
  }

  // Priority wise
  const lowPriority = [
    { label: "Pending", count: data.low.pending },
    { label: "In Progress", count: data.low.inProgress },
    { label: "Completed", count: data.low.completed },
  ];

  const mediumPriority = [
    { label: "Pending", count: data.medium.pending },
    { label: "In Progress", count: data.medium.inProgress },
    { label: "Completed", count: data.medium.completed },
  ];

  const highPriority = [
    { label: "Pending", count: data.high.pending },
    { label: "In Progress", count: data.high.inProgress },
    { label: "Completed", count: data.high.completed },
  ];

  // Status wise
  const pendingStatus = [
    { label: "Low", count: data.low.pending },
    { label: "Medium", count: data.medium.pending },
    { label: "High", count: data.high.pending },
  ];

  const inProgressStatus = [
    { label: "Low", count: data.low.inProgress },
    { label: "Medium", count: data.medium.inProgress },
    { label: "High", count: data.high.inProgress },
  ];

  const completedStatus = [
    { label: "Low", count: data.low.completed },
    { label: "Medium", count: data.medium.completed },
    { label: "High", count: data.high.completed },
  ];

  return (
    <div
      className={`${sidebar ? "sm:w-[80%]" : "sm:w-[95%]"} ${
        theme === "light" ? "bg-white" : "dark"
      } h-[calc(100vh-70px)] w-full p-4 space-y-10 overflow-auto`}
    >
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-blue-500">
          Task Analytics
        </h2>
        <p className="text-sm">Status & priority based task insights</p>
      </div>

      <div className="flex gap-4 max-md:flex-col">
        <div
          className={`rounded-2xl sm:p-5 p-3 shadow-md border-2 md:w-1/2 w-full
        ${theme === "light" ? "bg-white/80 backdrop-blur" : "bg-slate-800"}`}
        >
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Task Status Analysis</h2>
            <p className="text-sm opacity-70">
              Visual overview of task status distribution
            </p>
          </div>

          <div
            className="flex items-center justify-center rounded-xl border
          border-dashed border-slate-300 dark:border-slate-600 p-4"
          >
            <TodoStatusPieChart
              showLegend={true}
              showButton={false}
              showLabel={false}
              collapseHeight={false}
            />
          </div>
        </div>

        <div
          className={`rounded-2xl sm:p-5 p-3 shadow-md border-2 md:w-1/2 w-full
        ${theme === "light" ? "bg-white/80 backdrop-blur" : "bg-slate-800"}`}
        >
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Task Priority Analysis</h2>
            <p className="text-sm opacity-70">
              Visual overview of task priority distribution
            </p>
          </div>

          <div
            className="flex items-center justify-center rounded-xl border
          border-dashed border-slate-300 dark:border-slate-600 p-4"
          >
            <TodoPriorityPieChart
              showLegend={true}
              showButton={false}
              showLabel={false}
              collapseHeight={false}
            />
          </div>
        </div>
      </div>

      <div
        className={`rounded-2xl sm:p-5 p-3 shadow-md border-2 ${
          theme === "light" ? "bg-white/80 backdrop-blur" : "bg-slate-800"
        }`}
      >
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Tasks By Priority</h2>
          <p className="text-sm opacity-70">
            Breakdown of task statuses within each priority level to help
            identify workload distribution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ChartCard title="Low Priority" data={lowPriority} color="#4ade80" />
          <ChartCard
            title="Medium Priority"
            data={mediumPriority}
            color="#facc15"
          />
          <ChartCard
            title="High Priority"
            data={highPriority}
            color="#f87171"
          />
        </div>
      </div>

      <div
        className={`rounded-2xl sm:p-5 p-3 shadow-md border-2 ${
          theme === "light" ? "bg-white/80 backdrop-blur" : "bg-slate-800"
        }`}
      >
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Tasks By Status</h2>
          <p className="text-sm opacity-70">
            Comparison of task priorities across different workflow states for
            better planning and insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ChartCard
            title="Pending Tasks"
            data={pendingStatus}
            color="#f87171"
          />
          <ChartCard
            title="In-Progress Tasks"
            data={inProgressStatus}
            color="#facc15"
          />
          <ChartCard
            title="Completed Tasks"
            data={completedStatus}
            color="#4ade80"
          />
        </div>
      </div>
    </div>
  );
}

export default TodoStatusPriorityChart;
