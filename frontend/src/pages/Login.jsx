import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import { useThemeStore } from "@/store/themeStore";
import ErrorMessage from "@/components/ErrorMessage";
import { loginFormSchema } from "@/lib/schema";

function Login() {
  const [data, setData] = useState(null);
  const { theme } = useThemeStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginFormSchema),
  });

  useEffect(() => {
    if (!data) {
      return;
    }
    loginUser();
  }, [data]);

  async function loginUser() {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/signin",
        data
      );
      console.log(response);
      if (response.data.success) {
        localStorage.setItem("token", response.data.data);
        navigate("/todos");
      }
    } catch (error) {
      console.log(error);
      if (error.response.data.message == "User not found") {
        toast.error("Please create account");
        setError("email", {
          type: "manual",
          message: "Email not found",
        });
      }

      if (error.response.data.message == "Invalid password") {
        toast.error("Invalid password");
        setError("password", {
          type: "manual",
          message: "Invalid password",
        });
      }
    }
  }
  const onSubmit = (data) => {
    setData(data);
  };

  return (
    <div>
      <div
        className={`text-3xl font-bold sticky top-0 p-4 flex justify-around bg-blue-500 text-white w-full ${
          theme === "light" ? "light" : "dark"
        }`}
        style={{
          height: "70px",
        }}
      >
        <span className="font-bold">Taskify</span>
      </div>
      <div
        className={`flex justify-center items-center w-screen ${
          theme === "light" ? "light" : "dark-bg"
        }`}
        style={{
          height: "calc(100vh - 70px)",
        }}
      >
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className={`flex flex-col justify-center w-1/4 p-4 rounded shadow-[0px_5px_15px_2px_rgba(0,0,0,0.35)] ${
            theme === "light" ? "light" : "dark"
          }`}
        >
          <h1 className="text-3xl font-bold mb-3 text-center text-blue-500">
            Login
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <input
              type="text"
              placeholder="Email"
              className={`border border-blue-600 text-blue-600 focus:outline-none p-2 mb-2 rounded font-bold ${
                errors.email
                  ? "border-red-900 focus:ring focus:ring-red-900 text-red-900"
                  : "border-blue-600 focus:ring focus:ring-blue-600"
              }`}
              {...register("email")}
            />
            <ErrorMessage message={errors.email?.message} />

            <input
              type="password"
              placeholder="Password"
              className={`border border-blue-600 text-blue-600 focus:outline-none p-2 mb-2 rounded font-bold ${
                errors.password
                  ? "border-red-900 focus:ring focus:ring-red-900 text-red-900"
                  : "border-blue-600 focus:ring focus:ring-blue-600"
              }`}
              {...register("password")}
            />
            <ErrorMessage message={errors.password?.message} />

            <button
              type="submit"
              className="bg-blue-500 cursor-pointer font-bold hover:bg-blue-600 text-white p-2 rounded mt-3"
            >
              Login
            </button>

            <button
              type="button"
              className="bg-blue-500 cursor-pointer font-bold hover:bg-blue-600 text-white p-2 rounded mt-2"
              onClick={() => navigate("/")}
            >
              Create Account
            </button>

            <button
              type="button"
              className="bg-blue-500 cursor-pointer font-bold hover:bg-blue-600 text-white p-2 rounded mt-2"
              onClick={() => navigate("/todos")}
            >
              My Tasks
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
