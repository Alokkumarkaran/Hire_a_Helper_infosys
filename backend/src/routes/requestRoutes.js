import express from "express";
import Request from "../models/Request.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// routes/requestRoutes.js
router.get("/mine", auth, async (req, res) => {
  try {
    const requests = await Request.find({ requesterId: req.user.id })
      .populate({
        path: "taskId",
        populate: {
          path: "userId",
          select: "firstName lastName email phoneNumber profilePicture",
        },
      })
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});



// Requests received for user's tasks
router.get("/received", auth, async (req, res) => {
  try {
    const requests = await Request.find()
      .populate({
        path: "taskId",
        match: { userId: req.user.id },
        populate: { path: "userId", select: "firstName lastName email profilePicture" },
      })
      .populate("requesterId", "firstName lastName email profilePicture")
      .sort({ createdAt: -1 });

    const filtered = requests.filter(r => r.taskId !== null);

    res.json(filtered);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
