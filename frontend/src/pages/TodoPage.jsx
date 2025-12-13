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

import { useSearchParams } from "react-router-dom";
import DesktopSidebar from "@/components/DesktopSidebar";

function TodoPage() {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

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
      dueDate: "",
    },
  });

  const fetchTodos = async () => {
    const response = await axios.get(
      `http://localhost:3000/api/todos?page=${page}&limit=7`,
      {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      }
    );
    return response.data;
  };

  const {
    data: response,
    refetch,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["todos", page], // page change will refetch
    queryFn: fetchTodos,
  });

  useEffect(() => {
    if (response?.data) addAllTodo(response.data);
  }, [response]);

  return (
    <FormProvider {...methods}>
      {/* <div className="flex"> */}
      <TodoList
        todos={response?.data || []}
        pagination={response?.pagination}
        setSelectedTodo={setSelectedTodo}
        fetchTodos={refetch}
        isLoading={isLoading}
        isError={isError}
      />
      {/* </div> */}
    </FormProvider>
  );
}

export default TodoPage;
