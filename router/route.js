import { Router } from 'express';
const router = Router();

/** Import all controllers */
import * as controller from '../controllers/controller.js';
import * as authController from '../controllers/authController.js';
import protect from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

// --- User & Authentication Routes ---
router.post('/auth/register', authController.register); // Register a new user
router.post('/auth/login', authController.login); // Login a user
router.post('/auth/authenticate', authController.verifyUser, (req, res) => res.end()); // Authenticate user
router.get('/user/:username', authController.getUser); // Get user by username

// --- Password & OTP Routes ---
router.get('/auth/generateOTP', authController.verifyUser, authController.localVariables, authController.generateOTP); // Generate random OTP
router.get('/auth/verifyOTP', authController.verifyUser, authController.verifyOTP); // Verify generated OTP
router.get('/auth/createResetSession', authController.createResetSession); // Reset all variables
router.put('/auth/resetPassword', authController.verifyUser, authController.resetPassword); // Reset password

// --- Question Routes ---
router.route('/questions')
    .get(controller.getQuestions) // GET all questions
    .post(protect, roleMiddleware('admin'), controller.createQuestion) // POST a new question
    .delete(protect, roleMiddleware('admin'), controller.dropQuestions); // DELETE all questions

router.route('/questions/:id')
    .put(protect, roleMiddleware('admin'), controller.updateQuestion) // PUT (update) a question
    .delete(protect, roleMiddleware('admin'), controller.deleteQuestion); // DELETE a question

// --- Exam Routes ---
router.route('/exams')
    .get(controller.getExams) // GET all exams
    .post(protect, roleMiddleware('admin'), controller.createExam); // POST a new exam

router.route('/exams/:id')
    .get(controller.getExam) // GET a single exam
    .put(protect, roleMiddleware('admin'), controller.updateExam) // PUT (update) an exam
    .delete(protect, roleMiddleware('admin'), controller.deleteExam); // DELETE an exam

router.get('/exams/:id/with-questions', protect, controller.getExamWithQuestions); // GET exam with populated questions
router.put('/exams/:id/questions', protect, roleMiddleware('admin'), controller.addQuestionsToExam); // Add/update questions for an exam
router.put('/exams/:id/assign', protect, roleMiddleware('admin', 'proctor'), controller.assignExamToStudents); // Assign exam to students

// --- Result & Analysis Routes ---
router.route('/results')
    .get(controller.getResults) // GET all results
    .post(protect, controller.storeResult) // POST a new result
    .delete(protect, roleMiddleware('admin'), controller.dropResults); // DELETE all results

router.get('/results/:userId', protect, controller.getResultsByUser); // GET results for a specific user
router.get('/results/analysis/:id', protect, roleMiddleware('admin', 'proctor'), controller.getExamResultAnalysis); // GET analysis for an exam

// --- User Management Routes (Admin only) ---
router.route('/users')
    .get(protect, roleMiddleware('admin'), controller.getUsers) // GET all users
    .post(protect, roleMiddleware('admin'), controller.addUser); // POST a new user

router.route('/users/:id')
    .put(protect, roleMiddleware('admin'), controller.updateUser) // PUT (update) a user
    .delete(protect, roleMiddleware('admin'), controller.deleteUser); // DELETE a user

export default router;
