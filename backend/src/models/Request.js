import mongoose from 'mongoose';
const requestSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  requesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending','accepted','rejected','completed'], default: 'pending' }
}, { timestamps: true });

export default mongoose.model('Request', requestSchema);
