import express from 'express';
import Request from '../models/Request.js';
import Task from '../models/Task.js';
import Notification from '../models/Notification.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/:taskId', auth, async (req, res) => {
  const { taskId } = req.params;
  const task = await Task.findById(taskId);
  if (!task || task.status !== 'open') return res.status(400).json({ error: 'Task unavailable' });
  if (String(task.userId) === req.user.id) return res.status(400).json({ error: 'Cannot request your own task' });
  const exists = await Request.findOne({ taskId, requesterId: req.user.id });
  if (exists) return res.status(400).json({ error: 'Already requested' });
  const r = await Request.create({ taskId, requesterId: req.user.id });
  await Notification.create({ userId: task.userId, body: 'Your task received a new request.' });
  req.app.get('io')?.to(String(task.userId)).emit('notify', { body: 'Your task received a new request.' });
  res.json(r);
});

router.get('/mine', auth, async (req, res) => {
  const list = await Request.find({ requesterId: req.user.id }).sort({ createdAt: -1 }).populate('taskId');
  res.json(list);
});

router.get('/received', auth, async (req, res) => {
  // requests on my tasks
  const tasks = await Task.find({ userId: req.user.id }).select('_id');
  const taskIds = tasks.map(t => t._id);
  const list = await Request.find({ taskId: { $in: taskIds } }).sort({ createdAt: -1 }).populate('taskId requesterId');
  res.json(list);
});

router.put('/:id', auth, async (req, res) => {
  const { status } = req.body; // accepted/rejected/completed
  const reqDoc = await Request.findById(req.params.id).populate('taskId');
  if (!reqDoc) return res.status(404).json({ error: 'Request not found' });
  if (String(reqDoc.taskId.userId) !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

  // Add validation for status transitions
  if (reqDoc.status === "rejected" && status === "completed") {
    return res.status(400).json({ error: "Cannot complete a rejected request" });
  }

  reqDoc.status = status;
  await reqDoc.save();
  res.json(reqDoc);
});

export default router;
