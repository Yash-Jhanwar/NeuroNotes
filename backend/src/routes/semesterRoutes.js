import { Router } from 'express';
import { getSemesters, createSemester } from '../controllers/semesterController.js';
import { validateCreateSemester } from '../validators/semesterValidator.js';

const router = Router();


router.route('/')
  .get(getSemesters)
  .post(validateCreateSemester, createSemester);

export default router;
