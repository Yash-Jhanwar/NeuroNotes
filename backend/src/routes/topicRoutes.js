import { Router } from 'express';
import { createTopic, updateTopicImportance } from '../controllers/topicController.js';
import { validateCreateTopic, validateImportantTopicUpdate } from '../validators/topicValidator.js';

const router = Router();


router.post('/', validateCreateTopic, createTopic);
router.patch('/:id/important', validateImportantTopicUpdate, updateTopicImportance);

export default router;
