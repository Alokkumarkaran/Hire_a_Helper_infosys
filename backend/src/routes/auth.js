import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendOtpEmail } from '../utils/sendOtp.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  console.log('--- register called ---');
  console.log('body:', req.body); // <- This will print request payload
  try {
    const { firstName, lastName, email, password, phoneNumber } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Email already registered' });
    const passwordHash = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const user = await User.create({ firstName, lastName, email, phoneNumber, passwordHash, otpCode: otp, otpExpiresAt });
    await sendOtpEmail(email, otp);
    res.json({ message: 'Registered. Verify OTP sent to email.', userId: user._id });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
    if (!user.verified) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      user.otpCode = otp;
      user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();
      await sendOtpEmail(email, otp);
      return res.status(403).json({ error: 'OTP required', userId: user._id });
    }
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, profile: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, phoneNumber: user.phoneNumber, profilePicture: user.profilePicture } });
  } catch (e) { res.status(500).json({ error: e.message }); }
});


router.post('/verify-otp', async (req, res) => {
  try {
    const { userId, code } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: 'User not found' });
    if (!user.otpCode || user.otpCode !== code || user.otpExpiresAt < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }
    user.verified = true;
    user.otpCode = null;
    user.otpExpiresAt = null;
    await user.save();
    res.json({ message: 'Verified. Please login.' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otpCode = otp;
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    await user.save();

    await sendOtpEmail(email, otp);  // reuse your existing email function

    res.json({ message: 'OTP sent to email', userId: user._id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


// ...existing code...
router.post('/reset-password', async (req, res) => {
  try {
    const { userId, otp, newPassword } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!user.otpCode || user.otpCode !== otp || user.otpExpiresAt < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10); // <-- use the imported bcrypt
    user.otpCode = null;
    user.otpExpiresAt = null;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


export default router;
