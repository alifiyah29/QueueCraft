const express = require("express");
const Task = require("../models/Task");
const router = express.Router();

// Add a new task
router.post("/tasks", async (req, res) => {
  try {
    const { name, priority } = req.body;
    const newTask = new Task({ name, priority });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating task", error: err.message });
  }
});

// Get all tasks
router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching tasks", error: err.message });
  }
});

// Cancel task by ID
router.delete("/tasks/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findByIdAndUpdate(
      taskId,
      { status: "cancelled" },
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task cancelled successfully", task });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error cancelling task", error: err.message });
  }
});

module.exports = router;
