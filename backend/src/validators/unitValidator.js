import AppError from '../utils/AppError.js';

export const validateCreateUnit = (req, res, next) => {
  const { subject_id: subjectId, unit_number: unitNumber, title } = req.body;

  if (!subjectId || typeof subjectId !== 'string' || !subjectId.trim()) {
    return next(new AppError('subject_id is required', 400));
  }

  const normalizedUnitNumber = Number(unitNumber);
  if (!Number.isInteger(normalizedUnitNumber) || normalizedUnitNumber < 1) {
    return next(new AppError('unit_number must be a positive integer', 400));
  }

  if (!title || typeof title !== 'string' || !title.trim()) {
    return next(new AppError('title is required', 400));
  }

  req.body.subject_id = subjectId.trim();
  req.body.unit_number = normalizedUnitNumber;
  req.body.title = title.trim();
  next();
};

export const validateSubjectIdParam = (req, res, next) => {
  const { subjectId } = req.params;

  if (!subjectId || !subjectId.trim()) {
    return next(new AppError('subjectId parameter is required', 400));
  }

  req.params.subjectId = subjectId.trim();
  next();
};
