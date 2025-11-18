import React, { useState, useEffect } from "react";
import TodoForm from "../components/TodoForm";
import Todos from "../components/Todos";
import axios from "axios";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  content: z
    .string()
    .nonempty("Task must be required")
    .min(5, "Task must be at least 5 characters long"),
});

function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const methods = useForm({ resolver: zodResolver(schema) });

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
    <FormProvider {...methods}>
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
    </FormProvider>
  );
}

export default TodoPage;
