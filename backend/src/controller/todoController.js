const mongoose = require("mongoose");
const Todo = require("../models/Todo.js");
const { imageUpload } = require("../utils/imageUpload.js");

const createTodo = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    let imageUrl = null;

    // If user attached an image file, upload to Cloudinary
    if (req.file) {
      imageUrl = await imageUpload(req.file); // hosted image link
    }

    const todo = await Todo.create({
      title,
      description,
      status,
      priority,
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
    const { status, priority } = req.query;
    const filter = { userId };
    if (status) {
      filter.status = status;
    }
    if (priority) {
      filter.priority = priority;
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const total = await Todo.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    const todo = await Todo.find(filter)
      .populate({
        path: "userId",
        select: "name email",
      })
      .lean()
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      message: "Todo fetched successfully",
      data: todo,
      pagination: {
        totalItems: total,
        currentPage: page,
        totalPages,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
      },
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
    const { title, description, status, priority, dueDate } = req.body;
    let imageUrl = null;
    if (req.file) {
      imageUrl = await imageUpload(req.file); // hosted image link
    }

    const existingTodo = await Todo.findById(id);
    if (!existingTodo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    // Check if dueDate changed
    let notificationSent = existingTodo.notificationSent;
    if (
      new Date(existingTodo.dueDate).getTime() !== new Date(dueDate).getTime()
    ) {
      notificationSent = false;
    }

    const todo = imageUrl
      ? await Todo.findByIdAndUpdate(
          id,
          {
            title,
            description,
            status,
            priority,
            image: imageUrl,
            dueDate,
            notificationSent,
          },
          { new: true }
        )
      : await Todo.findByIdAndUpdate(
          id,
          { title, description, status, priority, dueDate, notificationSent },
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

const getTodoPrioritySummary = async (req, res) => {
  try {
    const stats = await Todo.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.userId) } },
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);

    const formattedStats = {
      low: 0,
      medium: 0,
      high: 0,
      total: 0,
    };

    stats.forEach((item) => {
      if (item._id === "low") formattedStats.low = item.count;
      if (item._id === "medium") formattedStats.medium = item.count;
      if (item._id === "high") formattedStats.high = item.count;
    });

    formattedStats.total =
      formattedStats.low + formattedStats.medium + formattedStats.high;

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

const getRecentTodos = async (req, res) => {
  try {
    const { userId } = req;
    const recentTodos = await Todo.find({ userId })
      .sort({ createdAt: -1 }) // newest first
      .limit(9);

    return res.status(200).json({
      success: true,
      count: recentTodos.length,
      data: recentTodos,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch recent tasks",
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
  getTodoPrioritySummary,
  getTodosByStatus,
  getRecentTodos,
};
