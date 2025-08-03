import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  score: Number,
  total: Number,
  feedback: Array,
  date: Date
});

const Result = mongoose.model('Result', resultSchema);
export default Result;


