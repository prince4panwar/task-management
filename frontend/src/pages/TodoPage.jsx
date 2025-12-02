import React, { useState, useEffect } from "react";
import TodoForm from "../components/TodoForm";
import TodoList from "../components/TodoList";
import axios from "axios";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTaskFormSchema } from "@/lib/schema";

function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const methods = useForm({
    resolver: zodResolver(createTaskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "pending",
      image: "",
    },
  });

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
        <TodoList
          todos={todos}
          setSelectedTodo={setSelectedTodo}
          fetchTodos={fetchTodos} // pass to refresh after delete
        />
      </div>
    </FormProvider>
  );
}

export default TodoPage;
