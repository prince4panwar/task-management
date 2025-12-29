import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { io } from "socket.io-client";
import { useUserStore } from "@/store/userStore";
import toast from "react-hot-toast";
import { BASE_URL } from "@/config/api";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const socket = io(BASE_URL, {
  autoConnect: false,
  withCredentials: true,
});
const notificationSound = new Audio("/notify.mp3");

const fetchUnreadNotificationCount = async () => {
  const res = await axios.get(`${BASE_URL}/api/notifications/unread`, {
    headers: {
      "x-access-token": localStorage.getItem("token"),
    },
  });

  return res.data.count;
};

const NotificationBell = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  const { data: count = 0 } = useQuery({
    queryKey: ["unread-notification-count", user?.id],
    queryFn: fetchUnreadNotificationCount,
    enabled: !!user?.id,
    refetchInterval: 10_000,
    staleTime: 10_000,
  });

  useEffect(() => {
    if (!user?.id) return;

    socket.connect();
    socket.emit("join", user.id);

    socket.on("overdue-task", (data) => {
      notificationSound.currentTime = 0;
      notificationSound.play().catch(() => {});

      toast.error(`⏰ Task "${data.title}" is overdue`, {
        duration: 5000,
      });
    });

    return () => {
      socket.off("overdue-task");
      socket.disconnect();
    };
  }, [user?.id]);

  return (
    <div
      className="relative max-sm:me-1"
      onClick={() => navigate("/notifications")}
    >
      <Bell className="cursor-pointer max-sm:w-5 max-sm:h-5" />

      {count > 0 && (
        <span className="absolute sm:-top-2 -right-1 -top-1.5 bg-red-500 text-white sm:text-xs text-[9px] rounded-full px-1">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </div>
  );
};

export default NotificationBell;
