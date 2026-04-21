import { requireTrimmedString } from '../utils/validation.js';

export const validateCreateSubject = (req, res, next) => {
  try {
    req.body.semester_id = requireTrimmedString(req.body.semester_id, 'semester_id');
    req.body.name = requireTrimmedString(req.body.name, 'name');
    next();
  } catch (error) {
    next(error);
  }
};

export const validateSemesterIdParam = (req, res, next) => {
  try {
    req.params.semesterId = requireTrimmedString(req.params.semesterId, 'semesterId');
    next();
  } catch (error) {
    next(error);
  }
};
