import { Router } from 'express';
import { suggestTopics } from '../controllers/aiController.js';
import { validateSuggestTopics } from '../validators/aiValidator.js';

const router = Router();


router.post('/suggest-topics', validateSuggestTopics, suggestTopics);

export default router;
