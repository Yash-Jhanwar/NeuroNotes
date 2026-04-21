import { Router } from 'express';
import { createSubject, getSubjectsBySemester } from '../controllers/subjectController.js';
import { validateCreateSubject, validateSemesterIdParam } from '../validators/subjectValidator.js';

const router = Router();


router.post('/', validateCreateSubject, createSubject);
router.get('/:semesterId', validateSemesterIdParam, getSubjectsBySemester);

export default router;
