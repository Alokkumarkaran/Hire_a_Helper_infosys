import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  status: { type: String, enum: ['open','assigned','completed','cancelled'], default: 'open' },
  picture: { type: String }
}, { timestamps: true });

export default mongoose.model('Task', taskSchema);
