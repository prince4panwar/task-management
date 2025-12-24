const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connect = require("./config/database.js");
const todoRoutes = require("./routes/todoRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const setupJobs = require("./utils/cronJob.js");

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/api", todoRoutes);
app.use("/api", userRoutes);

const startServer = async () => {
  try {
    await connect();
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
      // setupJobs();
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
