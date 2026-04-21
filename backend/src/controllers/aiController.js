import asyncHandler from '../utils/asyncHandler.js';
import { suggestTopicsForContext } from '../services/aiService.js';

export const suggestTopics = asyncHandler(async (req, res) => {
  const suggestion = await suggestTopicsForContext(req.user.userId, {
    contextType: req.body.context_type,
    contextText: req.body.context_text,
  });

  res.status(201).json({
    success: true,
    data: suggestion,
  });
});
