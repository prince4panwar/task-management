const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const connect = require("./config/database.js");
const todoRoutes = require("./routes/todoRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const notificationRoutes = require("./routes/notificationRoutes.js");
const setupJobs = require("./utils/cronJob.js");

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();

// 🔹 Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  })
);

// Routes
app.use("/api", todoRoutes);
app.use("/api", userRoutes);
app.use("/api", notificationRoutes);

// Create HTTP server (REQUIRED for Socket.IO)
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  },
});

// Socket connection
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User joined room: ${userId}`);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// Start server
const startServer = async () => {
  try {
    await connect();
    console.log("MongoDB connected");

    server.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);

      // Start cron job ONCE
      setupJobs(io);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
