const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    todoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Todo",
      required: true,
    },

    type: {
      type: String,
      enum: ["OVERDUE_TASK"],
      required: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    title: {
      type: String,
      required: true,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      required: true,
    },

    priority: {
      type: String,
      required: true,
    },

    created: {
      type: Date,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
