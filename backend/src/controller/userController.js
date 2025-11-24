const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { imageUpload } = require("../utils/imageUpload");
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

    let picUrl = null;
    // If user attached an image file, upload to Cloudinary
    if (req.file) {
      picUrl = await imageUpload(req.file); // hosted image link
    }

    const user = await User.create({
      name,
      email,
      password: hashPassword,
      pic: picUrl,
    });

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

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    let picUrl = null;

    if (req.file) {
      picUrl = await imageUpload(req.file); // hosted image link
    }

    const user = picUrl
      ? await User.findByIdAndUpdate(id, { name, pic: picUrl }, { new: true })
      : await User.findByIdAndUpdate(id, { name }, { new: true });

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not update user",
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

const isAuthenticated = async (req, res) => {
  try {
    if (!req.headers || !req.headers["x-access-token"]) {
      return res.status(400).json({
        success: false,
        data: {},
        message: "Token is required inside headers",
        err: "Token is missing in the request header",
      });
    }

    const response = jwt.verify(
      req.headers["x-access-token"],
      process.env.JWT_KEY
    );

    if (!response) {
      throw { error: "Unauthorized: Invalid token" };
    }

    // step 1 --> fetch the user using the email
    const user = await User.findOne({ email: response.email });
    if (!user) {
      throw { error: "Unauthorized: Invalid token" };
    }

    return res.status(200).json({
      data: { name: user.name, email: user.email, id: user.id, pic: user.pic },
      message: "User authenticated successfully",
      success: true,
      err: {},
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: {},
      message: "Something went wrong",
      success: false,
      err: error,
    });
  }
};

module.exports = {
  createUser,
  updateUser,
  logInUser,
  getUsers,
  isAuthenticated,
};
