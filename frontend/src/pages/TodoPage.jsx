import React, { useEffect, useState } from "react";
import TodoForm from "../components/TodoForm";
import TodoList from "../components/TodoList";
import axios from "axios";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTaskFormSchema } from "@/lib/schema";
import { useQuery } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useAllTodoStore } from "@/store/allTodoStore";

function TodoPage() {
  const addAllTodo = useAllTodoStore((state) => state.addAllTodo);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const isMobile = useIsMobile();

  const methods = useForm({
    mode: "all",
    resolver: zodResolver(createTaskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "pending",
      image: "",
    },
  });

  const {
    data: todos = [],
    refetch,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  useEffect(() => {
    addAllTodo(todos);
  }, [todos]);

  async function fetchTodos() {
    const response = await axios.get("http://localhost:3000/api/todos", {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    });
    return response.data.data;
  }

  return (
    <FormProvider {...methods}>
      <div className="flex">
        {isMobile ? null : (
          <TodoForm
            selectedTodo={selectedTodo}
            setSelectedTodo={setSelectedTodo}
          />
        )}
        <TodoList
          todos={todos}
          setSelectedTodo={setSelectedTodo}
          fetchTodos={refetch} // refresh after delete
          loading={isLoading}
          error={isError}
        />
      </div>
    </FormProvider>
  );
}

export default TodoPage;
