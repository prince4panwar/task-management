import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserStore } from "../store/userStore";
import { useThemeStore } from "@/store/themeStore";

const schema = z.object({
  name: z
    .string()
    .nonempty("Name must be required")
    .min(3, "Name must be at least 3 characters or more"),
  pic: z.any(),
});

function Profile() {
  const user = useUserStore((state) => state.user);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user.name,
    },
  });
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const { theme } = useThemeStore();

  useEffect(() => {
    if (!profile) {
      return;
    }
    updateProfile(profile);
  }, [profile]);

  const onSubmit = (data) => {
    if (data.pic && data.pic[0]) {
      data.pic = data.pic[0];
    }
    setProfile(data);
  };

  async function updateProfile(profile) {
    try {
      const response = await axios.patch(
        `http://localhost:3000/api/users/${user.id}`,
        profile,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-access-token": localStorage.getItem("token"),
          },
        }
      );
      toast.success("Profile updated successfully");
      navigate("/todos");
      console.log(response);
    } catch (error) {
      toast.success("Profile not updated successfully");
      console.log(error);
    }
  }
  return (
    <div
      className={`flex flex-col justify-start items-center h-screen p-3 bg-blue-100 ${
        theme === "light" ? "light" : "dark-bg"
      }`}
    >
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className={`w-1/3 mt-4 p-4 rounded-2xl ${
          theme === "light" ? "light" : "dark"
        }`}
      >
        {/* <h1 className="text-3xl font-bold mb-3 text-blue-600 text-center">
          Update Profile
        </h1> */}
        <div className="w-full flex items-center justify-center">
          <img
            src={
              user.pic ??
              "https://res.cloudinary.com/dsaiclywa/image/upload/v1763988872/user_qe0ygk.png"
            }
            alt="Profile Pic"
            height={50}
            width={200}
            className="rounded-3xl mb-4"
          />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <Label htmlFor="picture" className="text-blue-600">
            Username :
          </Label>
          <input
            type="text"
            placeholder="New Username"
            className={`border border-blue-600 text-blue-600 focus:outline-none p-2 mb-1 mt-2 rounded font-bold ${
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

          <Label htmlFor="picture" className="text-blue-600 mt-3">
            Profile Pic :
          </Label>
          <Input
            type="file"
            className="text-blue-600 border border-blue-600 mt-2 mb-3 rounded cursor-pointer"
            {...register("pic")}
          />
          <button
            type="submit"
            className="cursor-pointer font-bold text-white p-2 rounded transition-all bg-blue-500 hover:bg-blue-600"
          >
            Update Account
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="bg-blue-500 cursor-pointer font-bold hover:bg-blue-600 text-white p-2 rounded mt-2"
          >
            Create Account
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

export default Profile;
