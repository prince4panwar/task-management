const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const mongoUrl =
  process.env.NODE_ENV === "prod"
    ? process.env.CLIENT_URL
    : process.env.MONGO_URL;

const connect = async () => {
  try {
    await mongoose.connect(mongoUrl);
  } catch (error) {
    console.log("Something went wrong in database connection");
  }
};

module.exports = connect;
