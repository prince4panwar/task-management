import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import toast from "react-hot-toast";

const schema = z.object({
  name: z
    .string()
    .nonempty("Name must be required")
    .min(3, "Name must be at least 3 characters or more"),
});

function Username() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!username) {
      return;
    }
    updateUsername(username);
  }, [username]);

  const onSubmit = (data) => {
    setUsername(data);
  };

  async function updateUsername(username) {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/users/authenticate",
        {
          headers: { "x-access-token": token },
        }
      );
      const one = await axios.patch(
        `http://localhost:3000/api/users/${response.data.data.id}`,
        username,
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      );
      toast.success("Username updated successfully");
      navigate("/todos");
      console.log(one);
    } catch (error) {
      toast.success("Username not updated successfully");
      console.log(error);
    }
  }
  return (
    <div className="flex flex-col justify-start items-center h-screen p-3 bg-blue-100">
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="w-1/3 mt-4"
      >
        <h1 className="text-3xl font-bold mb-3 text-blue-600 text-center">
          Update Username
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <input
            type="text"
            placeholder="New Username"
            className={`border border-blue-600 text-blue-600 focus:outline-none p-2 mb-3 rounded font-bold ${
              errors.name
                ? "border-red-900 focus:ring focus:ring-red-900 text-red-900"
                : "border-blue-600 focus:ring focus:ring-blue-600"
            }`}
            {...register("name")}
          />
          {errors.name && (
            <span className="text-red-900 pb-3 ps-1 text-xs font-bold">
              {errors.name.message}
            </span>
          )}

          <button
            type="submit"
            className="cursor-pointer font-bold text-white p-2 rounded transition-all bg-blue-500 hover:bg-blue-600"
          >
            Update Username
          </button>
          <button
            type="button"
            className="cursor-pointer font-bold text-white p-2 rounded transition-all 
              bg-blue-500 hover:bg-blue-600 mt-2"
            onClick={() => navigate("/todos")}
          >
            My Tasks
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default Username;
