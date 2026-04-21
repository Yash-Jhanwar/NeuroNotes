import asyncHandler from '../utils/asyncHandler.js';
import { getSyllabusTree } from '../services/syllabusService.js';

export const getSyllabus = asyncHandler(async (req, res) => {
  const syllabus = await getSyllabusTree(req.user.userId);

  res.status(200).json({
    success: true,
    data: syllabus,
  });
});
