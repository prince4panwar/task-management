import React, { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SearchProvider } from "./context/SearchContext";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import NotFound from "./components/NotFound";
import Loader from "./components/Loader";
import "./App.css";
import TodoStatusPriorityChart from "./pages/TodoStatusPriorityChart";
import ErrorState from "./components/ErrorState";
import OverdueTasks from "./pages/OverdueTasks";
import Notifications from "./components/Notifications";

const Register = lazy(() => import("./pages/Register.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Layout = lazy(() => import("./pages/Layout"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const TodoPage = lazy(() => import("./pages/TodoPage"));
const TodoDetails = lazy(() => import("./pages/TodoDetails"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const TodoStatusPieChart = lazy(() => import("./pages/TodoStatusChart"));
const TodoPriorityChart = lazy(() => import("./pages/TodoPriorityChart"));
const TodoForm = lazy(() => import("./components/TodoForm"));
const RecentTasks = lazy(() => import("./pages/RecentTasks"));

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
      {
        path: "/dashboard",
        element: <Dashboard />,
        errorElement: <ErrorState title="Failed to load dashboard" />,
      },
      {
        path: "/todos",
        element: <TodoPage />,
        errorElement: <ErrorState title="Failed to load tasks" />,
      },
      {
        path: "/todos/:todoId",
        element: <TodoDetails />,
        errorElement: <ErrorState title="Failed to load task details" />,
      },
      {
        path: "/update/username",
        element: <Profile />,
        errorElement: <ErrorState title="Failed to load profile" />,
      },
      {
        path: "/todos/analytics",
        element: <TodoStatusPriorityChart />,
        errorElement: <ErrorState title="Failed to load charts" />,
      },
      {
        path: "/todos/create",
        element: <TodoForm />,
        errorElement: <ErrorState title="Failed to load create tasks" />,
      },
      {
        path: "/todos/recent",
        element: <RecentTasks />,
        errorElement: <ErrorState title="Failed to load recent tasks" />,
      },
      {
        path: "/todos/overdue",
        element: <OverdueTasks />,
        errorElement: <ErrorState title="Failed to load overdue tasks" />,
      },
      {
        path: "/notifications",
        element: <Notifications />,
        errorElement: <ErrorState title="Failed to load notifications" />,
      },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <SearchProvider>
        <Suspense fallback={<Loader />}>
          <RouterProvider router={router} />
        </Suspense>
        <Toaster position="top-right" toastOptions={{ duration: 2000 }} />
      </SearchProvider>
    </QueryClientProvider>
  );
}

export default App;
