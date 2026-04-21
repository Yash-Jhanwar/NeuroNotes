import AppError from '../utils/AppError.js';

export const validateCreateNote = (req, res, next) => {
  const { topic_id: topicId, title, content } = req.body;

  if (!topicId || typeof topicId !== 'string' || !topicId.trim()) {
    return next(new AppError('topic_id is required', 400));
  }

  if (!title || typeof title !== 'string' || !title.trim()) {
    return next(new AppError('title is required', 400));
  }

  if (!content || typeof content !== 'string' || !content.trim()) {
    return next(new AppError('content is required', 400));
  }

  req.body.topic_id = topicId.trim();
  req.body.title = title.trim();
  req.body.content = content.trim();
  next();
};

export const validateTopicIdParam = (req, res, next) => {
  const { topicId } = req.params;

  if (!topicId || !topicId.trim()) {
    return next(new AppError('topicId parameter is required', 400));
  }

  req.params.topicId = topicId.trim();
  next();
};
