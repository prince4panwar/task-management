import React from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { MoveLeft } from "lucide-react";
import { motion } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { useSidebarStore } from "@/store/sidebarStore";

const COLORS = ["#E7000B", "#F0B100", "#0D542B"]; // pending, inProgress, completed

const TodoStatusPieChart = () => {
  const navigate = useNavigate();
  const { sidebar } = useSidebarStore();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["status-summary"],
    queryFn: async () => {
      const response = await axios.get(
        "http://localhost:3000/api/todos/status/summary",
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      );
      return response.data.data;
    },
  });

  if (isLoading)
    return (
      <p className="text-center text-blue-500 font-semibold">Loading...</p>
    );

  if (isError)
    return (
      <p className="text-center text-red-600 font-semibold">
        Failed to load chart data
      </p>
    );

  const statusData = [
    { name: "Pending", value: data?.pending },
    { name: "In Progress", value: data?.inProgress },
    { name: "Completed", value: data?.completed },
  ];

  return (
    <div
      className={`w-full h-[calc(100vh-70px)] overflow-y-auto overflow-x-hidden ${
        sidebar ? "sm:w-[80%]" : "sm:w-[95%]"
      }`}
    >
      <div className="w-full h-[370px]">
        <h2 className="sm:text-3xl text-2xl text-blue-500 font-bold mb-4 sm:mt-10 mt-2 text-center">
          Tasks Summary
        </h2>
        <h3 className="sm:text-lg text-sm text-blue-500 font-semibold text-center sm:mt-2 sm:mb-4 mb-2">
          Total Tasks: {data?.total}
        </h3>

        <ResponsiveContainer>
          <PieChart>
            <Pie
              dataKey="value"
              data={statusData}
              cx="50%"
              cy="50%"
              innerRadius={100}
              outerRadius={140}
              fill="#8884d8"
              label
            >
              {statusData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>

        <div className="flex justify-center sm:w-full sm:mt-6 mt-3">
          <motion.button
            whileTap={{ scale: 0.8 }}
            type="button"
            className="group flex items-center gap-2 cursor-pointer font-bold text-white py-2 px-4 rounded transition-all
             bg-blue-500 hover:bg-blue-600 sm:mt-2"
            onClick={() => navigate("/todos")}
          >
            <MoveLeft className="transition-all duration-300 group-hover:-translate-x-2" />
            My Tasks
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default TodoStatusPieChart;
