import { requirePositiveInteger } from '../utils/validation.js';

export const validateCreateSemester = (req, res, next) => {
  try {
    req.body.semester_number = requirePositiveInteger(req.body.semester_number, 'semester_number');
    next();
  } catch (error) {
    next(error);
  }
};
