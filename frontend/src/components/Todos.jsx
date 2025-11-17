import React from "react";
import axios from "axios";
import { motion } from "motion/react";

function Todos({ todos, setSelectedTodo, fetchTodos }) {
  async function deleteTodo(_id) {
    try {
      await axios.delete(`http://localhost:3000/api/todos/${_id}`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      });
      fetchTodos(); // refresh after delete
    } catch (error) {
      console.log(error);
    }
  }

  async function handleEdit(_id) {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/todos/${_id}`,
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      );
      setSelectedTodo(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div
      className="w-2/3 overflow-auto mt-3 p-4 pt-1"
      style={{
        height: "calc(100vh - 70px)",
      }}
    >
      {/* <h1 className="text-3xl font-bold mb-3 sticky top-0 p-4 flex justify-around bg-blue-500 text-white">
        Todos
      </h1> */}
      {todos.length === 0 && (
        <p className="text-gray-500 text-center w-full mt-5 text-xl font-bold">
          No todos yet.
        </p>
      )}
      {todos.map((todo, index) => (
        <motion.div
          key={todo._id}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2, type: "spring" }}
          className="flex items-center w-full p-2 mb-2 rounded shadow-[0px_2px_2px_2px_rgba(0,0,0,0.35)]"
        >
          <div className="w-2/3">
            {/* <h1 className="font-bold">{todo.userId.name}</h1> */}
            {/* <p className="font-semibold">{todo.userId.email}</p> */}
            <p className="font-bold text-blue-500">
              {index + 1}. {todo.content}
            </p>
          </div>
          <div className="w-1/3 flex flex-col gap-2 justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-1 w-1/3 bg-green-500 text-white rounded cursor-pointer font-bold"
              onClick={() => handleEdit(todo._id)}
            >
              Edit
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-1 w-1/3 bg-red-400 text-white rounded cursor-pointer font-bold"
              onClick={() => deleteTodo(todo._id)}
            >
              Delete
            </motion.button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default Todos;
