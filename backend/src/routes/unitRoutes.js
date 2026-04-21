import { Router } from 'express';
import { createUnit, getUnits } from '../controllers/unitController.js';
import { validateCreateUnit, validateSubjectIdParam } from '../validators/unitValidator.js';

const router = Router();


router.post('/', validateCreateUnit, createUnit);
router.get('/:subjectId', validateSubjectIdParam, getUnits);

export default router;
