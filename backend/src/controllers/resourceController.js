import asyncHandler from '../utils/asyncHandler.js';
import { createResourceForTopic, listResourcesByTopic } from '../services/resourceService.js';

export const createResource = asyncHandler(async (req, res) => {
  const resource = await createResourceForTopic(
    req.user.userId,
    req.body.topic_id,
    req.body.title,
    req.body.url,
    req.body.type
  );

  res.status(201).json({
    success: true,
    data: resource
  });
});

export const getResources = asyncHandler(async (req, res) => {
  const resources = await listResourcesByTopic(req.user.userId, req.params.topicId);

  res.status(200).json({
    success: true,
    data: resources
  });
});
