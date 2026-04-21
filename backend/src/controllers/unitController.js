import asyncHandler from '../utils/asyncHandler.js';
import { createUnitForSubject, listUnitsBySubject } from '../services/unitService.js';

export const createUnit = asyncHandler(async (req, res) => {
  const unit = await createUnitForSubject(
    req.user.userId,
    req.body.subject_id,
    req.body.unit_number,
    req.body.title
  );

  res.status(201).json({
    success: true,
    data: unit
  });
});

export const getUnits = asyncHandler(async (req, res) => {
  const units = await listUnitsBySubject(req.user.userId, req.params.subjectId);

  res.status(200).json({
    success: true,
    data: units
  });
});
