const mongoose = require("mongoose");
const Todo = require("../models/Todo.js");
const { imageUpload } = require("../utils/imageUpload.js");

const createTodo = async (req, res) => {
  try {
    const { content, status } = req.body;
    let imageUrl = null;

    // If user attached an image file, upload to Cloudinary
    if (req.file) {
      imageUrl = await imageUpload(req.file); // hosted image link
    }

    const todo = await Todo.create({
      content,
      status,
      userId: req.userId,
      image: imageUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Todo created successfully",
      data: todo,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not create todo",
      error: error,
    });
  }
};

const getTodos = async (req, res) => {
  try {
    const { userId } = req;
    const todo = await Todo.find({ userId })
      .populate({
        path: "userId",
        select: "name email", // only bring these fields
      })
      .lean();
    return res.status(200).json({
      success: true,
      message: "Todo fetched successfully",
      data: todo,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could find todos",
      error: error,
    });
  }
};

const getTodoById = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findById(id);
    return res.status(200).json({
      success: true,
      message: "Todo fetched successfully",
      data: todo,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not find todo",
      error: error,
    });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: "Todo deleted successfully",
      data: todo,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not delete todo",
      error: error,
    });
  }
};

const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, status } = req.body;
    let imageUrl = null;
    if (req.file) {
      imageUrl = await imageUpload(req.file); // hosted image link
    }

    const todo = imageUrl
      ? await Todo.findByIdAndUpdate(
          id,
          { content, status, image: imageUrl },
          { new: true }
        )
      : await Todo.findByIdAndUpdate(id, { content, status }, { new: true });

    return res.status(200).json({
      success: true,
      message: "Todo updated successfully",
      data: todo,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not update todo",
      error: error,
    });
  }
};

const getTodoStatusSummary = async (req, res) => {
  try {
    const stats = await Todo.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.userId) } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const formattedStats = {
      pending: 0,
      inProgress: 0,
      completed: 0,
      total: 0,
    };

    stats.forEach((item) => {
      if (item._id === "pending") formattedStats.pending = item.count;
      if (item._id === "in-progress") formattedStats.inProgress = item.count;
      if (item._id === "completed") formattedStats.completed = item.count;
    });

    formattedStats.total =
      formattedStats.pending +
      formattedStats.inProgress +
      formattedStats.completed;

    res.status(200).json({
      success: true,
      data: formattedStats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch statistics",
      error,
    });
  }
};

module.exports = {
  createTodo,
  getTodos,
  getTodoById,
  deleteTodo,
  updateTodo,
  getTodoStatusSummary,
};
