import React, { useState, useEffect } from "react";
import TodoForm from "../components/TodoForm";
import Todos from "../components/Todos";
import axios from "axios";

function TodoPage() {
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [todos, setTodos] = useState([]);

  // Fetch all todos
  async function fetchTodos() {
    try {
      const response = await axios.get("http://localhost:3000/api/todos", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      });
      setTodos(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="flex">
      <TodoForm
        selectedTodo={selectedTodo}
        setSelectedTodo={setSelectedTodo}
        fetchTodos={fetchTodos} // pass fetch function
      />
      <Todos
        todos={todos}
        setSelectedTodo={setSelectedTodo}
        fetchTodos={fetchTodos} // pass to refresh after delete
      />
    </div>
  );
}

export default TodoPage;
