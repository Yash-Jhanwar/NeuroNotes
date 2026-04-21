import { Router } from 'express';
import { createNote, getNotes } from '../controllers/noteController.js';
import { validateCreateNote, validateTopicIdParam } from '../validators/noteValidator.js';

const router = Router();


router.post('/', validateCreateNote, createNote);
router.get('/:topicId', validateTopicIdParam, getNotes);

export default router;
