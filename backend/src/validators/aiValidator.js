import AppError from '../utils/AppError.js';

export const validateSuggestTopics = (req, res, next) => {
  const { topic, unit_context: unitContext } = req.body;

  const hasTopic = typeof topic === 'string' && topic.trim().length > 0;
  const hasUnitContext = typeof unitContext === 'string' && unitContext.trim().length > 0;

  if (!hasTopic && !hasUnitContext) {
    return next(new AppError('Provide either topic or unit_context', 400));
  }

  if (hasTopic && hasUnitContext) {
    return next(new AppError('Provide only one of topic or unit_context', 400));
  }

  if (hasTopic) {
    req.body.topic = topic.trim();
    req.body.context_type = 'topic';
    req.body.context_text = req.body.topic;
  }

  if (hasUnitContext) {
    req.body.unit_context = unitContext.trim();
    req.body.context_type = 'unit';
    req.body.context_text = req.body.unit_context;
  }

  next();
};
