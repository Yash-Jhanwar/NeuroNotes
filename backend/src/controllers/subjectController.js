import asyncHandler from '../utils/asyncHandler.js';
import { createSubjectForSemester, listSubjectsBySemester } from '../services/subjectService.js';

export const createSubject = asyncHandler(async (req, res) => {
  const subject = await createSubjectForSemester(
    req.user.userId,
    req.body.semester_id,
    req.body.name
  );

  res.status(201).json({
    success: true,
    data: subject
  });
});

export const getSubjectsBySemester = asyncHandler(async (req, res) => {
  const subjects = await listSubjectsBySemester(req.user.userId, req.params.semesterId);

  res.status(200).json({
    success: true,
    data: subjects
  });
});
