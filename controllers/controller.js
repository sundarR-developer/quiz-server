import Questions from '../models/questionSchema.js';
import Exam from '../models/examSchema.js';
import Results from '../models/resultSchema.js';
import User from '../models/userSchema.js';

// --- Question Controllers ---

export async function getQuestions(req, res) {
    try {
        const q = await Questions.find();
        res.json(q);
    } catch (error) {
        res.status(500).json({ error });
    }
}

export async function createQuestion(req, res) {
    try {
        const { examId, ...questionData } = req.body;
        if (!examId) {
            return res.status(400).json({ error: 'Exam ID is required.' });
        }

        const question = new Questions(questionData);
        await question.save();

        await Exam.findByIdAndUpdate(
            examId,
            { $push: { questions: question._id } },
            { new: true }
        );

        res.status(201).json({ msg: "Question Created Successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function updateQuestion(req, res) {
    try {
        const { id } = req.params;
        const questionData = req.body;
        await Questions.updateOne({ _id: id }, questionData);
        res.status(200).json({ msg: "Question Updated Successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function deleteQuestion(req, res) {
    try {
        const { id } = req.params;
        await Questions.findByIdAndDelete(id);
        res.status(200).json({ msg: "Question Deleted Successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function dropQuestions(req, res) {
    try {
        await Questions.deleteMany();
        res.json({ msg: "All Questions Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ error });
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

export async function getExams(req, res) {
    try {
        const exams = await Exam.find();
        res.json(exams);
    } catch (error) {
        res.status(500).json({ error });
    }
}

export async function getExam(req, res) {
    try {
        const { id } = req.params;
        const exam = await Exam.findById(id);
        res.json(exam);
    } catch (error) {
        res.status(500).json({ error });
    }
}

export async function updateExam(req, res) {
    try {
        const { id } = req.params;
        await Exam.updateOne({ _id: id }, req.body);
        res.status(200).json({ msg: "Exam Updated Successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function deleteExam(req, res) {
    try {
        const { id } = req.params;
        await Exam.findByIdAndDelete(id);
        res.status(200).json({ msg: "Exam Deleted Successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function addQuestionsToExam(req, res) {
    try {
        const { id } = req.params;
        const { questionIds } = req.body;
        await Exam.findByIdAndUpdate(id, { $addToSet: { questions: { $each: questionIds } } });
        res.status(200).json({ msg: "Questions Added Successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function getExamWithQuestions(req, res) {
    try {
        const { id } = req.params;
        const exam = await Exam.findById(id).populate('questions');
        res.json(exam);
    } catch (error) {
        res.status(500).json({ error });
    }
}

export async function assignExamToStudents(req, res) {
    try {
        const { id } = req.params;
        const { studentIds } = req.body;
        await Exam.findByIdAndUpdate(id, { $addToSet: { assignedTo: { $each: studentIds } } });
        res.status(200).json({ msg: "Exam Assigned Successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


// --- Result Controllers ---

export async function getResults(req, res) {
    try {
        const r = await Results.find().populate('user', 'name email').populate('exam', 'name');
        res.json(r);
    } catch (error) {
        res.status(500).json({ error });
    }
}

export async function storeResult(req, res) {
    try {
        const { userId } = req.user;
        const { examId, score, answers } = req.body;
        const result = new Results({ user: userId, exam: examId, score, answers });
        await result.save();
        res.status(201).json({ msg: "Result Saved Successfully" });
    } catch (error) {
        res.status(500).json({ error });
    }
}

export async function dropResults(req, res) {
    try {
        await Results.deleteMany();
        res.json({ msg: "All Results Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ error });
    }
}

export async function getResultsByUser(req, res) {
    try {
        const { userId } = req.params;
        const results = await Results.find({ user: userId }).populate('exam', 'name');
        res.json(results);
    } catch (error) {
        res.status(500).json({ error });
    }
}

// --- User Management Controllers (Admin Only) ---

export async function getUsers(req, res) {
    try {
        const users = await User.find({}, '-password'); // Exclude passwords from the result
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function addUser(req, res) {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }
        const user = new User({ name, email, password, role });
        await user.save();
        res.status(201).json({ msg: "User added successfully", userId: user._id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function updateUser(req, res) {
    try {
        const { id } = req.params;
        await User.findByIdAndUpdate(id, req.body);
        res.status(200).json({ msg: "User updated successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function deleteUser(req, res) {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.status(200).json({ msg: "User deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function getExamResultAnalysis(req, res) {
    try {
        const { id: examId } = req.params;
        const results = await Results.find({ exam: examId });
        if (results.length === 0) {
            return res.status(200).json({ message: "No results found for this exam yet." });
        }
        const participantCount = results.length;
        const totalScore = results.reduce((sum, r) => sum + r.score, 0);
        const averageScore = totalScore / participantCount;
        const highestScore = Math.max(...results.map(r => r.score));
        const lowestScore = Math.min(...results.map(r => r.score));

        res.status(200).json({
            participantCount,
            averageScore,
            highestScore,
            lowestScore,
            results
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
