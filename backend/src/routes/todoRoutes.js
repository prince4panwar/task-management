const express = require("express");
const multer = require("multer");
const router = express.Router();
const {
  createTodo,
  getTodos,
  deleteTodo,
  updateTodo,
  getTodoById,
  getTodoStatusSummary,
  getTodosByStatus,
  getRecentTodos,
  getTodoPrioritySummary,
  getTodoStatusPrioritySummary,
  getOverDueTodos,
} = require("../controller/todoController.js");
const {
  isAuthenticatedUser,
} = require("../middlewares/authRequestValidator.js");
const { exportTodosToExcel } = require("../controller/todoExportController.js");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/todos", upload.single("image"), isAuthenticatedUser, createTodo);
router.get("/todos", isAuthenticatedUser, getTodos);
router.get("/todos/:id", isAuthenticatedUser, getTodoById);
router.delete("/todos/:id", isAuthenticatedUser, deleteTodo);
router.get("/todos/status/summary", isAuthenticatedUser, getTodoStatusSummary);
router.get(
  "/todos/priority/summary",
  isAuthenticatedUser,
  getTodoPrioritySummary
);
router.get("/filter/todos", isAuthenticatedUser, getTodosByStatus);
router.get(
  "/todos/summary/status-priority",
  isAuthenticatedUser,
  getTodoStatusPrioritySummary
);
router.get("/recent/todos", isAuthenticatedUser, getRecentTodos);
router.patch(
  "/todos/:id",
  upload.single("image"),
  isAuthenticatedUser,
  updateTodo
);
router.get("/overdue", isAuthenticatedUser, getOverDueTodos);
router.get("/todos/export/excel", isAuthenticatedUser, exportTodosToExcel);

module.exports = router;
