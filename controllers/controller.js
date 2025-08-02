import Questions from "../models/questionSchema.js";
import Results from "../models/resultSchema.js";
import Exam from '../models/examSchema.js';
import User from '../models/userSchema.js';
import mongoose from 'mongoose';

// --- Question Controllers ---

export async function getQuestions(req, res) {
  try {
    const q = await Questions.find();
    res.json(q);
  } catch (error) {
    res.json({ error });
  }
}

export async function storeQuestions(req, res) {
  try {
    Questions.insertMany(req.body.questions).then(
      res.json({ msg: "Data saved successfully!" })
    );
  } catch (error) {
    res.json({ error });
  }
}

export async function dropQuestions(req, res) {
  try {
    await Questions.deleteMany();
    res.json({ msg: "Questions deleted successfully!" });
  } catch (error) {
    res.json({ error });
  }
}

// Create a new question
export async function createQuestion(req, res) {
  try {
    const question = new Questions(req.body);
    await question.save();
    res.status(201).json(question);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Update a question
export async function updateQuestion(req, res) {
  try {
    const updated = await Questions.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Delete a question
export async function deleteQuestion(req, res) {
  try {
    await Questions.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// --- Result Controllers ---

export async function getResult(req, res) {
  try {
    const r = await Results.find();
    res.json(r);
  } catch (error) {
    res.json({ error });
  }
}

export async function storeResult(req, res) {
  try {
    const { username, result, attempts, points, achieved, exam } = req.body;
    if (!username || result.length === 0) {
      throw new Error("Data not provided!");
    }
    Results.create({ username, result, attempts, points, achieved, exam }).then(
      res.json({ msg: "Result saved successfully!" })
    );
  } catch (error) {
    res.json({ error });
  }
}

export async function dropResult(req, res) {
  try {
    await Results.deleteMany();
    res.json({ msg: "Results deleted successfully!" });
  } catch (error) {
    res.json({ error });
  }
}

export async function getResultsByUser(req, res) {
  try {
    const { userId } = req.params;
    const results = await Results.find({ user: userId }).populate('exam', 'name');
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// --- Exam Controllers ---

export async function createExam(req, res) {
  try {
    const exam = new Exam(req.body);
    await exam.save();
    res.status(201).json(exam);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAllExams(req, res) {
  try {
    const exams = await Exam.find().populate('questions');
    res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getExamById(req, res) {
  try {
    const exam = await Exam.findById(req.params.id).populate('questions');
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    res.status(200).json(exam);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateExam(req, res) {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    res.status(200).json(exam);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteExam(req, res) {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    res.status(200).json({ message: 'Exam deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// --- Analysis Controller ---

export async function getExamResultAnalysis(req, res) {
  try {
    const { id: examId } = req.params;
    const results = await Results.find({ exam: examId }).populate('user', 'name email');
    console.log('Populated results users:', results.map(r => r.user));

    if (results.length === 0) {
      return res.status(200).json({
        message: "No results found for this exam yet.",
        participantCount: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
      });
    }

    const participantCount = results.length;
    const scores = results.map(r => Number(r.score)).filter(score => !isNaN(score));
    console.log('Raw results:', results);
    console.log('Scores for analysis:', scores);
    const totalPoints = scores.reduce((acc, score) => acc + score, 0);
    console.log('Total points:', totalPoints, 'Scores length:', scores.length);
    const averageScore = scores.length > 0 ? totalPoints / scores.length : null;
    const highestScore = scores.length > 0 ? Math.max(...scores) : null;
    const lowestScore = scores.length > 0 ? Math.min(...scores) : null;
    console.log('Type of scores:', scores.map(s => typeof s));
    console.log('Average score before formatting:', averageScore);

    res.status(200).json({
      participantCount,
      averageScore: (averageScore !== null && !isNaN(averageScore)) ? Number(averageScore.toFixed(2)) : null,
      highestScore: (highestScore !== null && !isNaN(highestScore)) ? highestScore : null,
      lowestScore: (lowestScore !== null && !isNaN(lowestScore)) ? lowestScore : null,
      rawResults: results,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// --- User Management ---

export async function deleteUser(req, res) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json({ msg: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
}

// --- Proctor Action (placeholder) ---

export async function proctorAction(req, res) {
  res.json({ msg: 'Proctor action performed', user: req.user });
}

export function testFunction(req, res) {
  res.send('Test function works!');
}

export function someFunction(req, res) {
  res.send('It works!');
}

// --- Exam Assignment ---

export const assignExamToStudents = async (req, res) => {
  const { id } = req.params; // exam id
  const { studentIds } = req.body; // array of user ids
  try {
    const exam = await Exam.findByIdAndUpdate(
      id,
      { $addToSet: { assignedTo: { $each: studentIds } } }, // avoid duplicates
      { new: true }
    );
    res.json({ msg: 'Students assigned', exam });
  } catch (err) {
    res.status(500).json({ msg: 'Error assigning students' });
  }
};

export async function getAssignedExams(userId) {
  return await Exam.find({ assignedTo: new mongoose.Types.ObjectId(userId) });
}

export async function addQuestionsToExam(req, res) {
  try {
    const examId = req.params.id;
    const { questionIds } = req.body; // expects an array of question IDs

    // Update the exam's questions array
    const updatedExam = await Exam.findByIdAndUpdate(
      examId,
      { $set: { questions: questionIds } },
      { new: true }
    ).populate('questions');

    if (!updatedExam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    res.status(200).json(updatedExam);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
