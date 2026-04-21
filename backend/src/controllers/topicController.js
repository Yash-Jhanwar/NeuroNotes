import asyncHandler from '../utils/asyncHandler.js';
import { createTopicForUnit, markTopicImportant } from '../services/topicService.js';

export const createTopic = asyncHandler(async (req, res) => {
  const topic = await createTopicForUnit(
    req.user.userId,
    req.body.unit_id,
    req.body.title,
    req.body.is_important
  );

  res.status(201).json({
    success: true,
    data: topic
  });
});

export const updateTopicImportance = asyncHandler(async (req, res) => {
  const topic = await markTopicImportant(
    req.user.userId,
    req.params.id,
    req.body.is_important
  );

  res.status(200).json({
    success: true,
    data: topic
  });
});
