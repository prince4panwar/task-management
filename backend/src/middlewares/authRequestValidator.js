const User = require("../models/User");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const isAuthenticatedUser = async (req, res, next) => {
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

    const user = await User.findOne({ email: response.email });
    if (!user) {
      throw { error: "Unauthorized: Invalid token" };
    }

    req.userId = user.id;
    next();
    // return res.status(200).json({
    //   data: user.id,
    //   message: "User authenticated successfully",
    //   success: true,
    //   err: {},
    // });
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

module.exports = { isAuthenticatedUser };
