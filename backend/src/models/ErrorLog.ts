import mongoose from 'mongoose';

const errorLogSchema = new mongoose.Schema({
  message: { type: String, required: true },
  stack: { type: String },
  route: { type: String },
  method: { type: String },
  timestamp: { type: Date, default: Date.now },
});

// Ye "export" keyword sabse zaruri hai
export const ErrorLog = mongoose.model('ErrorLog', errorLogSchema);