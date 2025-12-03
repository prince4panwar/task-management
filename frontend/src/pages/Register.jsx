import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import React from "react";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import { useThemeStore } from "@/store/themeStore";
import ErrorMessage from "@/components/ErrorMessage";
import ImageUpload from "@/components/ImageUpload";
import { registerFormSchema } from "@/lib/schema";

function Register() {
  const [fileName, setFileName] = useState("");
  const navigate = useNavigate();
  const { theme } = useThemeStore();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    mode: "all",
    resolver: zodResolver(registerFormSchema),
  });

  async function createUser(data) {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/signup",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("User created successfully");
      navigate("/login");
      console.log(response.data);
    } catch (error) {
      if (error.response.data.message == "Email is already in use") {
        toast.error("Email is already in use");
        setError("email", {
          type: "manual",
          message: "Email is already in use",
        });
      }
      console.log(error);
    }
  }

  const onSubmit = (data) => {
    if (data.pic && data.pic[0]) {
      data.pic = data.pic[0];
    }
    createUser(data);
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
            Create Account
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
              type="text"
              placeholder="Username"
              className={`border border-blue-600 text-blue-600 focus:outline-none p-2 mb-2 rounded font-bold ${
                errors.name
                  ? "border-red-900 focus:ring focus:ring-red-900 text-red-900"
                  : "border-blue-600 focus:ring focus:ring-blue-600"
              }`}
              {...register("name")}
            />
            <ErrorMessage message={errors.name?.message} />

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

            <ImageUpload
              register={register}
              fileName={fileName}
              setFileName={setFileName}
              name="pic"
              errors={errors.pic}
            />
            <ErrorMessage message={errors.pic?.message} />

            <p className="text-sm text-gray-600 px-1">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-800"
              >
                Login
              </Link>
            </p>

            <button
              type="submit"
              className="bg-blue-500 cursor-pointer font-bold hover:bg-blue-600 text-white p-2 rounded mt-3"
            >
              Sign up
            </button>
            {/* <button
              type="button"
              onClick={() => navigate("/login")}
              className="bg-blue-500 cursor-pointer font-bold hover:bg-blue-600 text-white p-2 rounded"
            >
              Log In
            </button> */}

            <button
              type="button"
              onClick={() => navigate("/todos")}
              className="bg-blue-500 cursor-pointer font-bold hover:bg-blue-600 text-white p-2 rounded mt-2"
            >
              My Tasks
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default Register;
