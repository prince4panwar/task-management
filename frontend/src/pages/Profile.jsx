import React, { useState } from "react";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useUserStore } from "../store/userStore";
import { useThemeStore } from "@/store/themeStore";
import ImageUpload from "@/components/ImageUpload";
import ErrorMessage from "@/components/ErrorMessage";
import { profileUpdateFormSchema } from "@/lib/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Spinner } from "@/components/ui/spinner";
import { useSidebarStore } from "@/store/sidebarStore";
import { CircleUserRound } from "lucide-react";

function Profile() {
  const user = useUserStore((state) => state.user);
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileUpdateFormSchema),
    mode: "all",
    defaultValues: {
      name: user.name,
    },
  });

  const [fileName, setFileName] = useState("");
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const { sidebar } = useSidebarStore();

  const updateProfileMutation = useMutation({
    mutationFn: async (payload) => {
      return axios.patch(
        `http://localhost:3000/api/users/${user.id}`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-access-token": localStorage.getItem("token"),
          },
        }
      );
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries(["authUser"]);
      navigate("/dashboard");
    },
    onError: () => {
      toast.error("Profile not updated successfully");
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);

    if (data.pic && data.pic[0]) {
      formData.append("pic", data.pic[0]);
    }

    updateProfileMutation.mutate(formData);
  };

  return (
    <div
      className={`flex flex-col justify-start items-center h-[calc(100vh-70px)] w-full sm:pt-2 bg-blue-100 ${
        theme === "light" ? "bg-white" : "bg-slate-700"
      }
      ${sidebar ? "sm:w-[80%]" : "sm:w-[95%]"}`}
    >
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className={`sm:w-2/4 w-full max-sm:h-full sm:mt-4 p-4 sm:rounded-2xl overflow-auto ${
          theme === "light" ? "light sm:shadow-2xl" : "dark"
        }`}
      >
        <div className="w-full flex items-center justify-center">
          {user.pic ? (
            <Link to={user.pic} target="_blank" rel="noopener noreferrer">
              <img
                src={user.pic}
                alt="Profile Pic"
                height={50}
                width={200}
                className="rounded-full mb-4 cursor-pointer"
              />
            </Link>
          ) : (
            <CircleUserRound className="bg-slate-500 text-white rounded-full w-50 h-50" />
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <input
            type="text"
            placeholder="New Username"
            className={`border border-blue-600 text-blue-600 focus:outline-none p-2 mb-2 mt-2 rounded font-bold ${
              errors.name
                ? "border-red-900 focus:ring focus:ring-red-900 text-red-900"
                : "border-blue-600 focus:ring focus:ring-blue-600"
            }`}
            {...register("name")}
          />
          <ErrorMessage message={errors.name?.message} />

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
            disabled={updateProfileMutation.isPending}
            className="flex justify-center items-center gap-2 cursor-pointer font-bold text-white p-2 mt-3 rounded transition-all bg-blue-500 hover:bg-blue-600"
          >
            {updateProfileMutation.isPending ? (
              <>
                <Spinner className="size-5" />
                <span>Updating... </span>
              </>
            ) : (
              "Update Profile"
            )}
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
            className="cursor-pointer font-bold text-white p-2 rounded transition-all bg-blue-500 hover:bg-blue-600 mt-2"
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
