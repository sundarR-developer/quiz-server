import Question from '../models/questionSchema.js';

export const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const addQuestion = async (req, res) => {
  try {
    const { question, options, answer, type, explanation, tags } = req.body;
    const newQuestion = new Question({ question, options, answer, type, explanation, tags });
    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
};

export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Question.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Update failed' });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    await Question.findByIdAndDelete(id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Delete failed' });
  }
};

