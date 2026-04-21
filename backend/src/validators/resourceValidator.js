import { requireTrimmedString, requireValidUrl } from '../utils/validation.js';

export const validateCreateResource = (req, res, next) => {
  try {
    req.body.topic_id = requireTrimmedString(req.body.topic_id, 'topic_id');
    req.body.title = requireTrimmedString(req.body.title, 'title');
    req.body.url = requireValidUrl(req.body.url, 'url');
    req.body.type = requireTrimmedString(req.body.type, 'type');
    next();
  } catch (error) {
    next(error);
  }
};
