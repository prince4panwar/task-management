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

const router = createBrowserRouter([
  { path: "/", Component: Register },
  { path: "/login", Component: Login },
  {
    path: "/todos/:todoId",
    element: (
      <ProtectedRoute>
        <TodoDetails />
      </ProtectedRoute>
    ),
  },
  {
    path: "/update/username",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/todos",
    element: (
      <ProtectedRoute>
        <TodoPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/todos/status/summary",
    element: (
      <ProtectedRoute>
        <TodoStatusPieChart />
      </ProtectedRoute>
    ),
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 1500,
        }}
      />
    </>
  );
}

export default App;
