const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, default: 'pending' }, // 'pending', 'in-progress', 'completed', 'failed'
  priority: { type: Number, default: 1 }, // Lower number means higher priority
  retries: { type: Number, default: 0 },
  maxRetries: { type: Number, default: 3 },
  progress: { type: Number, default: 0 }, // Progress in percentage
  createdAt: { type: Date, default: Date.now },
  scheduledAt: { type: Date },
  result: { type: String }, // For storing task results or error messages
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
