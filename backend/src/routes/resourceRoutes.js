import { Router } from 'express';
import { createResource, getResources } from '../controllers/resourceController.js';
import { validateCreateResource } from '../validators/resourceValidator.js';
import { validateTopicIdParam } from '../validators/noteValidator.js';

const router = Router();


router.post('/', validateCreateResource, createResource);
router.get('/:topicId', validateTopicIdParam, getResources);

export default router;
