import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import React from "react";

const schema = z.object({
  name: z
    .string()
    .nonempty("Name must be required")
    .min(3, "Name must be at least 3 characters or more"),
  email: z
    .string()
    .nonempty("Email must be required")
    .email("Email is not valid"),
  password: z
    .string()
    .nonempty("Password must be required")
    .min(8, "Password must be at least 8 characters long"),
});

function Register() {
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
    createUser();
  }, [data]);

  async function createUser() {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/signup",
        data
      );
      navigate("/login");
      console.log(response.data);
    } catch (error) {
      if (error.response.data.message == "Email is already in use") {
        setError("email", {
          type: "manual",
          message: "Email is already in use",
        });
      }
      console.log(error);
    }
  }
  const onSubmit = (data) => {
    setData(data);
  };

  return (
    <div className="flex flex-col align-center justify-center p-2">
      <h1 className="text-3xl font-bold mb-3">Sign Up</h1>
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
          type="text"
          placeholder="username..."
          className="border p-2 mb-2 rounded font-bold"
          {...register("name")}
        />
        {errors.name && (
          <span className="text-red-900 pb-3 ps-1 text-xs font-bold">
            {errors.name.message}
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
          className="bg-blue-500 cursor-pointer font-bold hover:bg-blue-600 text-white p-2 rounded mb-2"
        >
          Create Account
        </button>
        <button
          type="submit"
          onClick={() => navigate("/login")}
          className="bg-blue-500 cursor-pointer font-bold hover:bg-blue-600 text-white p-2 rounded"
        >
          Log In
        </button>
      </form>
    </div>
  );
}

export default Register;
