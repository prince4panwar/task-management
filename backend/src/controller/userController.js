const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    const hashPassword = bcrypt.hashSync(
      password,
      parseInt(process.env.SALT_ROUNDS)
    );
    const user = await User.create({ name, email, password: hashPassword });
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not create user",
      error: error,
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const user = await User.find({});
    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not find user",
      error: error,
    });
  }
};

const logInUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // step 1 --> fetch the user using the email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // step 2 --> compare incoming plain password with stores encrypted password
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // step 3 --> if password matches then generate a token and send it to the user
    const token = jwt.sign(
      { email: user.email, id: user.id },
      process.env.JWT_KEY,
      {
        // expiresIn: 60,
        expiresIn: "1h",
      }
    );
    return res.status(200).json({
      success: true,
      data: token,
      message: "User logged in successfully",
      error: {},
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not log in user",
      error: error,
    });
  }
};

module.exports = { createUser, logInUser, getUsers };
