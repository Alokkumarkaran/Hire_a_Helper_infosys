// routes/taskRoutes.js
import express from "express";
import multer from "multer";
import Task from "../models/Task.js";
import { auth } from "../middleware/auth.js";


const router = express.Router();

// ⚡ Setup multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // save files inside backend/uploads/
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// 📌 Create Task (with optional picture)
router.post("/", auth, upload.single("picture"), async (req, res) => {
  try {
    const { title, description, location, startTime, endTime } = req.body;
    const picture = req.file ? req.file.filename : null;

    let task = await Task.create({
      userId: req.user.id,
      title,
      description,
      location,
      startTime,
      endTime,
      picture,
    });

    // ✅ populate owner info before sending back
    task = await task.populate("userId", "firstName lastName email profilePicture");

    res.json(task);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 📌 Get my tasks
router.get("/mine", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id })
      .populate("userId", "firstName lastName email profilePicture")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 📌 Get feed (other users' tasks)
router.get("/feed", auth, async (req, res) => {
  try {
    const tasks = await Task.find({
      userId: { $ne: req.user.id },
      status: "open",
    })
      .populate("userId", "firstName lastName email profilePicture")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(tasks);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 📌 Update task status
router.put("/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { status },
      { new: true }
    ).populate("userId", "firstName lastName email profilePicture");

    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
