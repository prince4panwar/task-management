import React, { useEffect } from "react";
import TodoList from "../components/TodoList";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useAllTodoStore } from "@/store/allTodoStore";
import { useSearchParams } from "react-router-dom";
import { BASE_URL } from "@/config/api";

function TodoPage() {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const status = searchParams.get("status");
  const priority = searchParams.get("priority");

  const addAllTodo = useAllTodoStore((state) => state.addAllTodo);

  const fetchTodos = async () => {
    const response = await axios.get(`${BASE_URL}/api/todos`, {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
      params: {
        page,
        limit: 10,
        ...(status && { status }),
        ...(priority && { priority }),
      },
    });

    return response.data;
  };

  const {
    data: response,
    refetch,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["todos", page],
    queryFn: fetchTodos,
  });

  useEffect(() => {
    if (response?.data) addAllTodo(response.data);
  }, [response]);

  return (
    <TodoList
      todos={response?.data || []}
      pagination={response?.pagination}
      fetchTodos={refetch}
      isLoading={isLoading}
      isError={isError}
    />
  );
}

export default TodoPage;
