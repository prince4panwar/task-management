import React, { useEffect, useState } from "react";
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

const COLORS = ["#E7000B", "#F0B100", "#0D542B"]; // pending, inProgress, completed

const TodoStatusPieChart = () => {
  const [totalTodos, setTotalTodos] = useState(0);
  const [statusData, setStatusData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/todos/status/summary",
          {
            headers: {
              "x-access-token": localStorage.getItem("token"),
            },
          }
        );

        const { pending, inProgress, completed, total } = response.data.data;

        setTotalTodos(total);
        setStatusData([
          { name: "Pending", value: pending },
          { name: "In Progress", value: inProgress },
          { name: "Completed", value: completed },
        ]);
      } catch (error) {
        console.log("Error fetching chart data:", error);
      }
    };

    fetchStatus();
  }, []);

  return (
    <div className="w-full h-[350px] ">
      <h2 className="text-3xl text-blue-500 font-bold mb-4 mt-10 text-center">
        Tasks Summary
      </h2>
      <h3 className="text-lg text-blue-500 font-semibold text-center mt-2 mb-4">
        Total Tasks: {totalTodos}
      </h3>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            dataKey="value"
            data={statusData}
            cx="50%"
            cy="50%"
            outerRadius={120}
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
      <div className="flex justify-center w-screen mt-6">
        <motion.button
          whileTap={{ scale: 0.8 }}
          type="button"
          className="group flex items-center gap-2 cursor-pointer font-bold text-white py-2 px-4 rounded transition-all
             bg-blue-500 hover:bg-blue-600 mt-2"
          onClick={() => navigate("/todos")}
        >
          <MoveLeft className="transition-all duration-300 group-hover:-translate-x-2" />
          My Tasks
        </motion.button>
      </div>
    </div>
  );
};

export default TodoStatusPieChart;
