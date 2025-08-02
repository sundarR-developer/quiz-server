import { Router } from 'express';
import * as controller from '../controllers/controller.js';
import * as authController from '../controllers/authController.js';
import protect from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = Router();

// =================================== USER ROUTES (Admin Only) ===================================
router.route('/users')
    .get(protect, roleMiddleware('admin'), authController.getAllUsers)
    .post(protect, roleMiddleware('admin'), authController.createUser);

router.route('/users/:id')
    .put(protect, roleMiddleware('admin'), authController.updateUser)
    .delete(protect, roleMiddleware('admin'), authController.deleteUser);

// =================================== RESULT ROUTES ===================================
router.route('/results')
    .get(protect, roleMiddleware('admin'), controller.getResult)
    .post(protect, controller.storeResult)
    .delete(protect, roleMiddleware('admin'), controller.dropResult);

// This route should have additional checks in the controller to ensure a user can only see their own results
router.get('/results/user/:userId', protect, controller.getResultsByUser);

// =================================== EXAM ROUTES ===================================
router.route('/exams')
    .get(controller.getAllExams)
    .post(protect, roleMiddleware('admin'), controller.createExam);

router.route('/exams/:id')
    .get(controller.getExamById)
    .put(protect, roleMiddleware('admin'), controller.updateExam)
    .delete(protect, roleMiddleware('admin'), controller.deleteExam);

router.post('/exams/:id/assign', protect, roleMiddleware('admin'), controller.assignExamToStudents);
router.put('/exams/:id/questions', protect, roleMiddleware('admin'), controller.addQuestionsToExam);

router.get('/exams/:id/analysis', protect, roleMiddleware('admin'), controller.getExamResultAnalysis);

// =================================== STUDENT-SPECIFIC ROUTES ===================================
// The logic for this has been moved to the getMyAssignedExams controller function
router.get('/my-exams', protect, controller.getMyAssignedExams);

export default router;
