const express = require("express");
const router = express.Router();

const {
  createUser,
  logInUser,
  getUsers,
} = require("../controller/userController.js");
const {
  isAuthenticatedUser,
} = require("../middlewares/authRequestValidator.js");

router.post("/users/signup", createUser);
router.post("/users/signin", logInUser);
router.get("/users", getUsers);
// router.get("/users/authenticate", isAuthenticatedUser);

module.exports = router;
