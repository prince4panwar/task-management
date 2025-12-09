const mongoose = require("mongoose");
const Todo = require("../models/Todo.js");
const { imageUpload } = require("../utils/imageUpload.js");

const createTodo = async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;
    let imageUrl = null;

    // If user attached an image file, upload to Cloudinary
    if (req.file) {
      imageUrl = await imageUpload(req.file); // hosted image link
    }

    const todo = await Todo.create({
      title,
      description,
      status,
      dueDate,
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
    const { title, description, status, dueDate } = req.body;
    let imageUrl = null;
    if (req.file) {
      imageUrl = await imageUpload(req.file); // hosted image link
    }

    const todo = imageUrl
      ? await Todo.findByIdAndUpdate(
          id,
          { title, description, status, image: imageUrl, dueDate },
          { new: true }
        )
      : await Todo.findByIdAndUpdate(
          id,
          { title, description, status, dueDate },
          { new: true }
        );

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

const getTodosByStatus = async (req, res) => {
  try {
    const { status, search, sort } = req.query;
    let query = Todo.find().where("userId").equals(req.userId);

    if (status) {
      query = query.where("status").equals(status);
    }

    if (search) {
      query = query.where("title").regex(new RegExp(search, "i")); // case-insensitive
    }

    // Sorting by createdAt
    if (sort === "asc") {
      query = query.sort({ createdAt: 1 });
    } else if (sort === "desc") {
      query = query.sort({ createdAt: -1 });
    }

    const todos = await query;

    res.status(200).json({
      success: true,
      data: todos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch by status",
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
  getTodosByStatus,
};
