import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// ✅ Configure multer for file uploads
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!["image/jpeg", "image/png"].includes(file.mimetype)) {
      return cb(new Error("Only JPG/PNG allowed"), false);
    }
    cb(null, true);
  }
});

// 📌 Get my profile
router.get('/me', auth, async (req, res) => {
  const u = await User.findById(req.user.id).select('-passwordHash -otpCode -otpExpiresAt');
  res.json(u);
});

// 📌 Update profile info
router.put('/me', auth, async (req, res) => {
  const { firstName, lastName, phoneNumber, profilePicture } = req.body;
  const u = await User.findByIdAndUpdate(
    req.user.id,
    { firstName, lastName, phoneNumber, profilePicture },
    { new: true }
  ).select('-passwordHash -otpCode -otpExpiresAt');
  res.json(u);
});

// 📌 Change password
router.put('/me/password', auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const u = await User.findById(req.user.id);

  const ok = await bcrypt.compare(currentPassword, u.passwordHash);
  if (!ok) return res.status(400).json({ error: 'Current password incorrect' });

  u.passwordHash = await bcrypt.hash(newPassword, 10);
  await u.save();

  res.json({ message: 'Password updated' });
});

// 📌 Upload profile photo
router.post('/me/photo', auth, upload.single("photo"), async (req, res) => {
  const u = await User.findById(req.user.id);
  if (!u) return res.status(404).json({ error: "User not found" });

  // If user already has a profile picture, optionally delete the old one
  if (u.profilePicture && fs.existsSync(path.join("uploads", path.basename(u.profilePicture)))) {
    fs.unlinkSync(path.join("uploads", path.basename(u.profilePicture)));
  }

  u.profilePicture = "/uploads/" + req.file.filename;
  await u.save();

  res.json(u);
});

// 📌 Remove profile photo
router.delete('/me/photo', auth, async (req, res) => {
  const u = await User.findById(req.user.id);
  if (!u) return res.status(404).json({ error: "User not found" });

  if (u.profilePicture && fs.existsSync(path.join("uploads", path.basename(u.profilePicture)))) {
    fs.unlinkSync(path.join("uploads", path.basename(u.profilePicture)));
  }

  u.profilePicture = null;
  await u.save();

  res.json(u);
});

export default router;
