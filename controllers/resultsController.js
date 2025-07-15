import Exam from '../models/examSchema.js';
import Result from '../models/resultSchema.js';
import mongoose from 'mongoose';

export const submitResult = async (req, res) => {
  try {
    const { examId, answers, userId } = req.body;
    console.log("Saving result for user:", userId);
    const exam = await Exam.findById(examId).populate('questions');
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }
    const questions = exam.questions;
    let score = 0;
    let feedback = [];
    questions.forEach((question) => {
      const qid = question._id.toString();
      const userAnswerIndex = answers[qid];
      let isCorrect = false;
      if (userAnswerIndex !== undefined && userAnswerIndex !== null) {
        isCorrect = userAnswerIndex === question.answer;
        if (isCorrect) score++;
      }
      feedback.push({
        question: question.question,
        options: question.options,
        correctOption: question.answer,
        correctAnswer: question.options[question.answer],
        userAnswer: userAnswerIndex != null ? question.options[Number(userAnswerIndex)] : null,
        userAnswerIndex,
        isCorrect,
        explanation: question.explanation || "No explanation provided."
      });
    });
    await Result.create({
      user: new mongoose.Types.ObjectId(userId),
      exam: new mongoose.Types.ObjectId(examId),
      score,
      total: questions.length,
      feedback,
      date: new Date()
    });
    res.json({
      score,
      total: questions.length,
      feedback,
    });
  } catch (err) {
    console.error('Error evaluating result:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getStudentResults = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Fetching results for user:", userId);
    const results = await Result.find({ user: new mongoose.Types.ObjectId(userId) }).populate('exam');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
