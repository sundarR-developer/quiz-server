import { Router } from 'express';
import * as controller from '../controllers/controller.js';
import * as authController from '../controllers/authController.js';
import * as questionController from '../controllers/questionController.js';
import * as resultsController from '../controllers/resultsController.js';
import protect from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = Router();

/** =================================== AUTH ROUTES =================================== */
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

/** =================================== USER ROUTES (Admin Only) =================================== */
router.route('/users')
    .get(protect, roleMiddleware('admin'), controller.getUsers)
    .post(protect, roleMiddleware('admin'), controller.addUser);

router.route('/users/:id')
    .put(protect, roleMiddleware('admin'), controller.updateUser)
    .delete(protect, roleMiddleware('admin'), controller.deleteUser);

/** =================================== QUESTION ROUTES =================================== */
router.route('/questions')
    .get(questionController.getQuestions) // Public
    .post(protect, roleMiddleware('admin'), questionController.insertQuestions) // Admin
    .delete(protect, roleMiddleware('admin'), questionController.dropQuestions); // Admin

/** =================================== RESULT ROUTES =================================== */
router.route('/results')
    .get(protect, roleMiddleware('admin'), resultsController.getResults) // Admin: Get all results
    .post(protect, resultsController.storeResult) // Private: Student submits a result
    .delete(protect, roleMiddleware('admin'), resultsController.dropResults); // Admin: Delete all results

router.get('/results/user/:userId', protect, resultsController.getResultsByUser); // Private: Student gets their own results
router.get('/results/exam/:examId', protect, roleMiddleware('admin'), resultsController.getResultsByExam); // Admin: Get results by exam

/** =================================== EXAM ROUTES =================================== */
router.route('/exams')
    .get(controller.getAllExams) // Public
    .post(protect, roleMiddleware('admin'), controller.createExam); // Admin

router.route('/exams/:id')
    .get(controller.getExamById) // Public
    .put(protect, roleMiddleware('admin'), controller.updateExam) // Admin
    .delete(protect, roleMiddleware('admin'), controller.deleteExam); // Admin

router.route('/exams/:id/analysis')
    .get(protect, roleMiddleware('admin'), controller.getExamResultAnalysis); // Admin

export default router;
