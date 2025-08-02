import { Router } from 'express';
import * as controller from '../controllers/controller.js';
import * as authController from '../controllers/authController.js';
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
    .get(controller.getQuestions) // Public
    .post(protect, roleMiddleware('admin'), controller.createQuestion) // Admin
    .delete(protect, roleMiddleware('admin'), controller.dropQuestions); // Admin

router.route('/questions/:id')
    .put(protect, roleMiddleware('admin'), controller.updateQuestion) // Admin
    .delete(protect, roleMiddleware('admin'), controller.deleteQuestion); // Admin

/** =================================== RESULT ROUTES =================================== */
router.route('/results')
    .get(protect, roleMiddleware('admin'), controller.getResult) // Admin: Get all results
    .post(protect, controller.storeResult) // Private: Student submits a result
    .delete(protect, roleMiddleware('admin'), controller.dropResult); // Admin: Delete all results

router.get('/results/user/:userId', protect, controller.getResultsByUser); // Private: Student gets their own results

/** =================================== EXAM ROUTES =================================== */
router.route('/exams')
    .get(controller.getAllExams) // Public
    .post(protect, roleMiddleware('admin'), controller.createExam); // Admin

router.route('/exams/:id')
    .get(controller.getExam) // Get a single exam
    .put(protect, roleMiddleware('admin'), controller.updateExam) // Admin
    .delete(protect, roleMiddleware('admin'), controller.deleteExam); // Admin

router.route('/exams/:id/with-questions')
    .get(controller.getExamWithQuestions);

router.post('/exams/:id/assign', protect, roleMiddleware('admin'), controller.assignExamToStudents);
router.put('/exams/:id/questions', protect, roleMiddleware('admin'), controller.addQuestionsToExam);

router.route('/exams/:id/analysis')
    .get(protect, roleMiddleware('admin'), controller.getExamResultAnalysis); // Admin

/** =================================== STUDENT-SPECIFIC ROUTES =================================== */
router.get('/my-exams', protect, async (req, res) => {
    try {
        // The controller function is a helper, not a route handler, so we wrap it.
        const exams = await controller.getAssignedExams(req.user.id);
        res.json(exams);
    } catch (err) {
        console.error('Error in /api/my-exams:', err);
        res.status(500).json({ msg: 'Error fetching assigned exams' });
    }
});

export default router;
