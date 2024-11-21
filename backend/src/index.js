const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");

//Importing Routes
const taskRoutes = require("./routes/taskRoutes");

//Task Excecution Logic
const { executeTasksInQueue } = require("./utils/taskExecutor");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

require("dotenv").config();

// Middleware
app.use(cors());
app.use(express.json());

//Connecting Routes
app.use("/api", taskRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Executing tasks on server startup
executeTasksInQueue();

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
