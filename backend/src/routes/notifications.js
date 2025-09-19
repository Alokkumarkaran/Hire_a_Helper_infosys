import express from 'express';
import Notification from '../models/Notification.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  const list = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(50);
  res.json(list);
});

router.put('/:id/read', auth, async (req, res) => {
  const n = await Notification.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, { read: true }, { new: true });
  res.json(n);
});

export default router;
