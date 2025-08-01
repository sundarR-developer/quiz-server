// server/models/questionSchema.js

import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String], // Array of options for MCQ
    default: [],
  },
  answer: {
    type: mongoose.Schema.Types.Mixed, // Can be index (for MCQ) or string (for short answer)
    required: true,
  },
  type: {
    type: String,
    enum: ['mcq', 'short', 'other'],
    default: 'mcq',
  },
  explanation: {
    type: String,
    default: '',
  },
}, { timestamps: true });

const Question = mongoose.model('Question', questionSchema);
export default Question;