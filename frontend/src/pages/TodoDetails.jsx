import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { MoveLeft } from "lucide-react";

function TodoDetails() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [todo, setTodo] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/todos/${userId}`,
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      );
      setTodo(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="flex gap-4 px-4 py-6">
      <div className="w-2/3">
        <p className="font-bold p-4 bg-blue-200 rounded-xl mb-4">
          {todo?.title}
        </p>
        <div
          style={{ "max-height": "75vh" }}
          className="rounded-xl bg-blue-200 p-4 overflow-x-hidden overflow-y-auto custom-scroll"
        >
          <p className="font-bold">{todo?.description}</p>
        </div>
      </div>
      <div className="flex flex-col items-start gap-8 p-4 rounded-xl w-1/3 bg-slate-300">
        {todo?.image && <img src={todo?.image} alt="image" width={300} />}
        <div>
          <p className="font-bold text-blue-600 pb-2">
            {todo?.status.charAt(0).toUpperCase() + todo?.status.slice(1)}
          </p>
          <p className="font-bold text-blue-600 pb-2">
            {new Date(todo?.createdAt).toLocaleString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </p>
          <motion.button
            whileTap={{ scale: 0.8 }}
            type="button"
            className="group flex items-center gap-1 cursor-pointer font-bold text-white py-2 px-4 rounded transition-all
             bg-blue-500 hover:bg-blue-600 mt-2"
            onClick={() => navigate("/todos")}
          >
            <MoveLeft className="transition-all duration-300 group-hover:-translate-x-2" />
            My Tasks
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default TodoDetails;
