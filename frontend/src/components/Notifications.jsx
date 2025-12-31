import { AlarmClock, BellOff, Clock } from "lucide-react";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { BASE_URL } from "@/config/api";
import { useUserStore } from "@/store/userStore";
import { useThemeStore } from "@/store/themeStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect } from "react";
dayjs.extend(relativeTime);

const Notifications = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const { theme } = useThemeStore();
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/api/notifications`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      });
      return res.data?.data;
    },
    enabled: !!user?.id,
    staleTime: 15000,
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      await axios.patch(
        `${BASE_URL}/api/notifications`,
        {},
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["unread-notification-count", user?.id]);
    },
  });

  useEffect(() => {
    if (notifications.length > 0) {
      markAllAsReadMutation.mutate();
    }
  }, [notifications.length]);

  const deleteAllNotifications = async () => {
    try {
      await axios.delete(`${BASE_URL}/api/notifications`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      });
      toast.success("All notifications deleted");
      queryClient.invalidateQueries(["notifications", user?.id]);
    } catch (err) {
      toast.error("Failed to delete all notifications");
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/notifications/${id}`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      });
      toast.success("Notification deleted");
      queryClient.invalidateQueries(["notifications", user?.id]);
    } catch (err) {
      toast.error("Failed to delete notification");
    }
  };

  return (
    <div
      className={`w-full h-[calc(100vh-70px)] overflow-auto pb-6 transition-colors ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div
        className={`flex justify-between items-center mx-auto mb-6 py-3 px-12 sticky top-0 transition ${
          theme === "dark" ? "dark" : "bg-white"
        }`}
      >
        <div>
          <h1 className="text-2xl font-semibold text-blue-600">
            Notifications
          </h1>
          <p className="text-sm text-gray-500">
            All task-related alerts in one place
          </p>
        </div>
        <div>
          {notifications.length > 0 && (
            <button
              onClick={deleteAllNotifications}
              className="text-sm font-medium text-blue-600 hover:underline cursor-pointer"
            >
              Delete all
            </button>
          )}
        </div>
      </div>
      <div className="px-8">
        <div className="mx-auto rounded-2xl shadow-md border border-slate-400 dark:bg-gray-800 overflow-hidden">
          {isLoading ? (
            <p className="text-center py-14 text-sm text-gray-400">
              Loading notifications...
            </p>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <BellOff className="w-10 h-10 mb-3" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className={`flex justify-between items-center gap-4 px-6 py-4 border-b border-slate-400 last:border-b-0
                          dark:hover:bg-gray-700 transition ${
                            theme === "light"
                              ? "hover:bg-gray-200"
                              : "hover:bg-slate-950"
                          }`}
              >
                <div className="flex gap-4 group">
                  <div className="mt-1 text-blue-500">
                    <AlarmClock />
                  </div>
                  <div className="flex-1">
                    <p
                      className="text-sm font-medium cursor-pointer hover:underline"
                      onClick={() => navigate(`/todos/${n.todoId}`)}
                    >
                      <span className="font-semibold">{n.title}</span> is
                      overdue
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                      <Clock className="w-3 h-3" />
                      {dayjs(n.createdAt).fromNow()}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => deleteNotification(n._id)}
                  className="text-sm font-medium text-blue-600 hover:underline cursor-pointer"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
