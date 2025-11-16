import React from "react";
import axios from "axios";

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
    <div className="w-2/3 h-160 overflow-auto">
      {/* <h1 className="text-3xl font-bold mb-3 sticky top-0 p-4 flex justify-around bg-blue-500 text-white">
        Todos
      </h1> */}
      {todos.length === 0 && (
        <p className="text-gray-500 text-center w-full mt-5 text-xl font-bold">
          No todos yet.
        </p>
      )}

      {todos.map((todo, index) => (
        <div
          key={todo._id}
          className="flex items-center w-full p-2 border border-black mb-2 rounded"
        >
          <div className="w-2/3">
            {/* <h1 className="font-bold">{todo.userId.name}</h1> */}
            {/* <p className="font-semibold">{todo.userId.email}</p> */}
            <p className="font-bold text-blue-500">
              {index + 1}. {todo.content}
            </p>
          </div>
          <div className="w-1/3 flex flex-col gap-2 justify-center items-center">
            <button
              className="px-5 py-1 w-1/3 bg-green-400 cursor-pointer hover:bg-green-500 text-white rounded transition-all font-bold"
              onClick={() => handleEdit(todo._id)}
            >
              Edit
            </button>
            <button
              className="px-5 py-1 w-1/3 bg-red-400 cursor-pointer hover:bg-red-500 text-white rounded transition-all font-bold"
              onClick={() => deleteTodo(todo._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Todos;
