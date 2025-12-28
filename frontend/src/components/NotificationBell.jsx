import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { io } from "socket.io-client";
import { useUserStore } from "@/store/userStore";
import toast from "react-hot-toast";
import axios from "axios";
import { BASE_URL } from "@/config/api";

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
});
const notificationSound = new Audio("/notify.mp3");

const NotificationBell = () => {
  const user = useUserStore((state) => state.user);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!user?.id) return;

    socket.connect();
    socket.emit("join", user.id);

    socket.on("overdue-task", (data) => {
      setNotifications((prev) => [data, ...prev]);
      setCount((prev) => prev + 1);

      notificationSound.currentTime = 0;
      notificationSound.play().catch(() => {});

      toast.error(`⏰ Task "${data.title}" is overdue`, {
        duration: 10000,
      });
    });

    return () => {
      socket.off("overdue-task");
      socket.disconnect();
    };
  }, [user?.id]);

  return (
    <div className="relative max-sm:me-1">
      <Bell className="cursor-pointer max-sm:w-5 max-sm:h-5" />

      {count > 0 && (
        <span className="absolute sm:-top-2 sm:-right-2.5 -right-2 -top-1.5 bg-red-500 text-white sm:text-xs text-[9px] rounded-full px-1">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </div>
  );
};

export default NotificationBell;
