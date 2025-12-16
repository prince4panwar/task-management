import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import React from "react";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import { useThemeStore } from "@/store/themeStore";
import ErrorMessage from "@/components/ErrorMessage";
import ImageUpload from "@/components/ImageUpload";
import { registerFormSchema } from "@/lib/schema";
import { Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Spinner } from "@/components/ui/spinner";

function Register() {
  const [fileName, setFileName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

  const createUserMutation = useMutation({
    mutationFn: async (data) => {
      return await axios.post("http://localhost:3000/api/users/signup", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: (response) => {
      toast.success("User created successfully");
      navigate("/login");
      console.log(response.data);
    },
    onError: (error) => {
      if (error.response?.data?.message === "Email is already in use") {
        toast.error("Email is already in use");
        setError("email", {
          type: "manual",
          message: "Email is already in use",
        });
      }
      console.log(error);
    },
  });

  const onSubmit = (data) => {
    if (data.pic && data.pic[0]) {
      data.pic = data.pic[0];
    }
    createUserMutation.mutate(data);
  };

  return (
    <div>
      <div
        className={`sm:h-[70px] text-3xl font-bold sticky top-0 p-4 flex justify-around bg-blue-500 text-white w-full ${
          theme === "light" ? "light" : "dark"
        }`}
      >
        <span className="font-bold sm:text-2xl text-lg">Taskify</span>
      </div>

      <div
        className={`h-[calc(100vh-70px)] flex justify-center items-center w-screen ${
          theme === "light" ? "light" : "dark-bg"
        }`}
      >
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className={`flex flex-col justify-center lg:w-1/4 w-full p-4 rounded shadow-[0px_5px_15px_2px_rgba(0,0,0,0.35)] ${
            theme === "light" ? "light" : "dark"
          }`}
        >
          <h1 className="sm:text-3xl text-xl font-bold mb-3 text-center text-blue-500">
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

            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className={`w-full border border-blue-600 text-blue-600 focus:outline-none p-2 mb-2 rounded font-bold ${
                  errors.password
                    ? "border-red-900 focus:ring focus:ring-red-900 text-red-900"
                    : "border-blue-600 focus:ring focus:ring-blue-600"
                }`}
                {...register("password")}
              />
              {showPassword ? (
                <EyeOff
                  onClick={() => setShowPassword((prev) => !prev)}
                  className={`absolute top-2.5 right-2 cursor-pointer ${
                    errors.password ? "text-red-900" : "text-blue-600"
                  }`}
                  size={21}
                />
              ) : (
                <Eye
                  onClick={() => setShowPassword((prev) => !prev)}
                  className={`absolute top-2.5 right-2 cursor-pointer ${
                    errors.password ? "text-red-900" : "text-blue-600"
                  }`}
                  size={21}
                />
              )}
            </div>

            <ErrorMessage message={errors.password?.message} />

            <ImageUpload
              register={register}
              fileName={fileName}
              setFileName={setFileName}
              name="pic"
              errors={errors.pic}
              labelName="Upload Profile Pic"
            />
            <ErrorMessage message={errors.pic?.message} />

            <button
              type="submit"
              disabled={createUserMutation.isPending}
              className="flex justify-center items-center gap-2 bg-blue-500 cursor-pointer font-bold hover:bg-blue-600 text-white p-2 rounded mt-2"
            >
              {createUserMutation.isPending ? (
                <>
                  <Spinner className="size-5" />
                  <span>Signing up...</span>
                </>
              ) : (
                "Sign up"
              )}
            </button>

            <button
              type="button"
              className="bg-blue-500 cursor-pointer font-bold hover:bg-blue-600 text-white p-2 rounded mt-2"
              onClick={() => navigate("/dashboard")}
            >
              My Tasks
            </button>

            <p className="text-sm px-1 mt-2 text-center">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-800"
              >
                Login
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default Register;
