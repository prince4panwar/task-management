const express = require("express");
const router = express.Router();
const {
  createTodo,
  getTodos,
  deleteTodo,
  updateTodo,
  getTodoById,
} = require("../controller/todoController.js");
const {
  isAuthenticatedUser,
} = require("../middlewares/authRequestValidator.js");

router.post("/todos", isAuthenticatedUser, createTodo);
router.get("/todos", isAuthenticatedUser, getTodos);
router.get("/todos/:id", isAuthenticatedUser, getTodoById);
router.delete("/todos/:id", isAuthenticatedUser, deleteTodo);
router.patch("/todos/:id", isAuthenticatedUser, updateTodo);

module.exports = router;
