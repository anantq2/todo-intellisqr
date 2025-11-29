import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', 
  },
  title: {
    type: String,
    required: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
}, { 
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    // 👇 FIX: Yahan 'ret: any' likha hai taaki TS error na de
    transform: function (doc, ret: any) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

export const Todo = mongoose.model('Todo', todoSchema);