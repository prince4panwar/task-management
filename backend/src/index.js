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

app.listen(PORT, async () => {
  console.log(`Server started at ${PORT}...`);
  await connect();
  console.log("Mongo db connected...");
  setupJobs();
});
