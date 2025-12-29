const express = require("express");
const router = express.Router();
const {
  isAuthenticatedUser,
} = require("../middlewares/authRequestValidator.js");
const {
  getNotifications,
  deleteNotification,
  deleteAllNotification,
  getUnreadNotificationCount,
  markAllNotificationAsRead,
} = require("../controller/notificationController.js");

router.get(
  "/notifications/unread",
  isAuthenticatedUser,
  getUnreadNotificationCount
);
router.get("/notifications", isAuthenticatedUser, getNotifications);
router.delete("/notifications/:id", isAuthenticatedUser, deleteNotification);
router.delete("/notifications", isAuthenticatedUser, deleteAllNotification);
router.patch("/notifications", isAuthenticatedUser, markAllNotificationAsRead);

module.exports = router;
