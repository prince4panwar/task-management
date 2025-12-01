import { AlertTriangle, MoveLeft } from "lucide-react";
import { motion } from "motion/react";
import React from "react";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-screen h-screen items-center gap-2">
      <AlertTriangle className="text-red-500" size={400} />
      <span className="text-5xl font-semibold text-blue-500">Not Found</span>
      <motion.button
        className="group flex items-center justify-center gap-2 px-4 py-2 mt-6 text-lg bg-blue-500 hover:bg-blue-600 text-white rounded cursor-pointer font-bold"
        onClick={() => {
          navigate(-1);
        }}
      >
        <MoveLeft className="transition-all duration-300 group-hover:-translate-x-1" />
        <span>Go Back</span>
      </motion.button>
    </div>
  );
}

export default NotFound;
