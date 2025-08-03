import express from 'express';
import { getQuestions, addQuestion, updateQuestion, deleteQuestion } from '../controllers/questionController.js';

const router = express.Router();

router.get('/', getQuestions);
router.post('/', addQuestion);
router.put('/:id', updateQuestion);
router.delete('/:id', deleteQuestion);

export default router;


