import express from 'express';
import * as authController from '../controllers/authController.js';
import * as mainController from '../controllers/controller.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import Exam from '../models/examSchema.js';
import { submitResult, getStudentResults } from '../controllers/resultsController.js';
import { testFunc } from '../controllers/test.js';
import { getQuestions, addQuestion, updateQuestion, deleteQuestion } from '../controllers/questionController.js';
console.log("submitResult:", submitResult);
console.log("testFunc:", testFunc);
console.log("mainController.createQuestion:", mainController.createQuestion);
console.log("mainController.createExam:", mainController.createExam);

const router = express.Router();

/* Questions routes API */
// router.get("/questions", controller.getQuestions);
// router.post("/questions", controller.storeQuestions);
// chaining technique equivalent to above

router.post('/questions', mainController.createQuestion);
router.get('/questions', mainController.getQuestions);
router.put('/questions/:id', mainController.updateQuestion);
router.delete('/questions/:id', mainController.deleteQuestion);

/** Exam Routes */
// Public: Get all exams, get exam by id
router.route('/exams').get(mainController.getAllExams);
router.route('/exams/:id').get(mainController.getExamById);
router.route('/exams/:id/analysis').get(mainController.getExamResultAnalysis);
// Protected: Create, update, delete exams (admin only)
router.post('/exams', authMiddleware, roleMiddleware('admin'), mainController.createExam);
router.get('/exams', mainController.getAllExams);
router.get('/exams/:id', mainController.getExamById);
router.put('/exams/:id', authMiddleware, roleMiddleware('admin'), mainController.updateExam);
router.delete('/exams/:id', authMiddleware, roleMiddleware('admin'), mainController.deleteExam);

// Results
router.route('/result')
  .get(mainController.getResult)
  .post(submitResult)
  .delete(mainController.dropResult);

// Protected: View all results (for admins/proctors)
router.get('/results', authMiddleware, mainController.getResult);
router.get('/results/:userId', getStudentResults);

// User management (admin only)
router.put('/users/:id', authMiddleware, roleMiddleware('admin'), authController.updateUser);
router.delete('/users/:id', authMiddleware, roleMiddleware('admin'), authController.deleteUser);
router.post('/users', authMiddleware, roleMiddleware('admin'), authController.createUser);
router.get('/users', authMiddleware, roleMiddleware('admin'), authController.getAllUsers);

// Add a route to get only students
router.get('/students', authMiddleware, roleMiddleware('admin'), authController.getAllStudents);

// Proctor-specific action
router.post('/proctor-action', authMiddleware, roleMiddleware('proctor'), mainController.proctorAction);

// Test route
router.get('/test', mainController.testFunction);

// Assign students to an exam (admin only)
router.post('/exams/:id/assign', authMiddleware, roleMiddleware('admin'), mainController.assignExamToStudents);

// Get exams assigned to the logged-in student
router.get('/my-exams', authMiddleware, async (req, res) => {
  try {
    const exams = await mainController.getAssignedExams(req.user.id);
    res.json(exams);
  } catch (err) {
    console.error('Error in /api/my-exams:', err); // <-- Add this line
    res.status(500).json({ msg: 'Error fetching assigned exams' });
  }
});

// Question Bank Routes
router.get('/api/questions', getQuestions);
router.post('/api/questions', addQuestion);
router.put('/api/questions/:id', updateQuestion);
router.delete('/api/questions/:id', deleteQuestion);

router.put('/exams/:id/questions', authMiddleware, roleMiddleware('admin'), mainController.addQuestionsToExam);

export default router; 
