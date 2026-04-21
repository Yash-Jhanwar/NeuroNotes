import asyncHandler from '../utils/asyncHandler.js';
import { createSemesterForUser, listSemesters } from '../services/semesterService.js';

export const getSemesters = asyncHandler(async (req, res) => {
  const semesters = await listSemesters(req.user.userId);

  res.status(200).json({
    success: true,
    data: semesters
  });
});

export const createSemester = asyncHandler(async (req, res) => {
  const semester = await createSemesterForUser(req.user.userId, req.body.semester_number);

  res.status(201).json({
    success: true,
    data: semester
  });
});
