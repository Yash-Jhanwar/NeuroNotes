import asyncHandler from '../utils/asyncHandler.js';
import { getUserById } from '../services/userService.js';

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await getUserById(req.user.userId);

  res.status(200).json({
    success: true,
    data: user
  });
});
