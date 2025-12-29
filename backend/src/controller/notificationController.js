const Notification = require("../models/Notification.js");

const getNotifications = async (req, res) => {
  try {
    const { userId } = req;
    const notifications = await Notification.find({
      userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Notifications fetched successfully",
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
      data: notification,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not delete notification",
      error: error,
    });
  }
};

const deleteAllNotification = async (req, res) => {
  try {
    const { userId } = req;
    const notification = await Notification.deleteMany({ userId });
    return res.status(200).json({
      success: true,
      message: "All Notification deleted successfully",
      data: notification,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not delete all notification",
      error: error,
    });
  }
};

const getUnreadNotificationCount = async (req, res) => {
  try {
    const { userId } = req;
    const count = await Notification.countDocuments({
      userId,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch unread count",
    });
  }
};

const markAllNotificationAsRead = async (req, res) => {
  try {
    const { userId } = req;
    await Notification.updateMany({ userId, isRead: false }, { isRead: true });

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to mark notifications as read",
    });
  }
};

module.exports = {
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationAsRead,
  deleteNotification,
  deleteAllNotification,
};
