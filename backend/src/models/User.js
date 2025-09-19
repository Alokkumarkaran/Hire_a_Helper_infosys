import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phoneNumber: { type: String },
  passwordHash: { type: String, required: true },
  profilePicture: { type: String },
  otpCode: { type: String },
  otpExpiresAt: { type: Date },
  verified: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
