import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Login from "./pages/Login.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from "./pages/Register.jsx";
import React from "react";
import TodoPage from "./pages/TodoPage.jsx";

const router = createBrowserRouter([
  { path: "/login", Component: Login },
  { path: "/", Component: Register },
  { path: "/todos", Component: TodoPage },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
