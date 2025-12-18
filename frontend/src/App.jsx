import "./App.css";
import React from "react";
import TodoPage from "./pages/TodoPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";
import { Toaster } from "react-hot-toast";
import TodoDetails from "./pages/TodoDetails";
import TodoStatusPieChart from "./pages/TodoStatusPieChart";
import NotFound from "./components/NotFound";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SearchProvider } from "./context/SearchContext";
import TodoForm from "./components/TodoForm";
import Layout from "./pages/Layout";
import RecentTasks from "./pages/RecentTasks";
import Dashboard from "./pages/Dashboard";
import TodoPriorityChart from "./pages/TodoPriorityChart";

const router = createBrowserRouter([
  { path: "/", Component: Register },
  { path: "/login", Component: Login },
  {
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/todos", element: <TodoPage /> },
      { path: "/todos/:todoId", element: <TodoDetails /> },
      { path: "/update/username", element: <Profile /> },
      { path: "/todos/status/summary", element: <TodoStatusPieChart /> },
      { path: "/todos/priority/summary", element: <TodoPriorityChart /> },
      { path: "/todos/create", element: <TodoForm /> },
      { path: "/todos/recent", element: <RecentTasks /> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false, // default: true
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <SearchProvider>
        <RouterProvider router={router} />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 1500,
          }}
        />
      </SearchProvider>
      {/* <ReactQueryDevtools initialIsOpen={true} /> */}
    </QueryClientProvider>
  );
}

export default App;
