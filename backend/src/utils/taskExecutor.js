const Task = require('../models/Task');
const { io } = require('../index'); // Socket.IO instance to emit progress updates

// Function to execute a task
const executeTask = async (taskId) => {
  const task = await Task.findById(taskId);
  if (!task || task.status === 'cancelled') return;

  // Start task execution
  task.status = 'in-progress';
  task.progress = 0;
  await task.save();

  // Simulate task execution with setTimeout (delay of 2 seconds for each step)
  let progress = 0;
  const interval = setInterval(async () => {
    if (progress < 100) {
      progress += 10; // Increase progress by 10% every interval
      task.progress = progress;
      await task.save();
      io.emit('task-progress', { taskId, progress }); // Emit progress to frontend

      if (progress >= 100) {
        clearInterval(interval);
        task.status = 'completed';
        task.progress = 100;
        await task.save();
        io.emit('task-completed', { taskId });
      }
    }
  }, 2000); // 2 seconds per progress update
};

// Retry logic for failed tasks
const retryTask = async (taskId) => {
  const task = await Task.findById(taskId);
  if (task.retries < task.maxRetries) {
    task.retries += 1;
    task.status = 'pending';
    await task.save();
    executeTask(taskId);
  } else {
    task.status = 'failed';
    await task.save();
    io.emit('task-failed', { taskId });
  }
};

// Execute tasks based on priority (higher priority first)
const executeTasksInQueue = async () => {
  const tasks = await Task.find({ status: 'pending' }).sort({ priority: 1 });
  for (const task of tasks) {
    executeTask(task._id);
  }
};

module.exports = { executeTask, retryTask, executeTasksInQueue };
