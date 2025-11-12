import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React from "react";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  email: z
    .string()
    .nonempty("Email must be required")
    .email("Email is not valid"),
  password: z
    .string()
    .nonempty("Password must be required")
    .min(8, "Password must be at least 8 characters long"),
});

function Login() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
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
        setError("email", {
          type: "manual",
          message: "Email not found",
        });
      }

      if (error.response.data.message == "Invalid password") {
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
    <div className="flex flex-col align-center justify-center p-2">
      <h1 className="text-3xl font-bold mb-3">Log In</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-1/4">
        <input
          type="text"
          placeholder="email..."
          className="border p-2 mb-2 rounded font-bold"
          {...register("email")}
        />
        {errors.email && (
          <span className="text-red-900 pb-3 ps-1 text-xs font-bold">
            {errors.email.message}
          </span>
        )}
        <input
          type="password"
          placeholder="********"
          className="border p-2 mb-2 rounded font-bold"
          {...register("password")}
        />
        {errors.password && (
          <span className="text-red-900 pb-3 ps-1 text-xs font-bold">
            {errors.password.message}
          </span>
        )}
        <button
          type="submit"
          className="bg-blue-500 cursor-pointer font-bold hover:bg-blue-600 text-white p-2 rounded"
        >
          Log In
        </button>

        <button
          className="bg-blue-500 cursor-pointer font-bold hover:bg-blue-600 text-white p-2 rounded mt-2"
          onClick={() => navigate("/")}
        >
          Create Account
        </button>

        <button
          className="bg-blue-500 cursor-pointer font-bold hover:bg-blue-600 text-white p-2 rounded mt-2"
          onClick={() => navigate("/todos")}
        >
          My Todos
        </button>
      </form>
    </div>
  );
}

export default Login;
