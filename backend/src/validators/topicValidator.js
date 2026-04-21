import { requireBoolean, requireTrimmedString } from '../utils/validation.js';
import { createValidationError } from '../utils/validation.js';

export const validateCreateTopic = (req, res, next) => {
  try {
    req.body.unit_id = requireTrimmedString(req.body.unit_id, 'unit_id');
    req.body.title = requireTrimmedString(req.body.title, 'title');

    if (req.body.is_important !== undefined) {
      req.body.is_important = requireBoolean(req.body.is_important, 'is_important');
    } else {
      req.body.is_important = false;
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const validateImportantTopicUpdate = (req, res, next) => {
  try {
    req.params.id = requireTrimmedString(req.params.id, 'id');

    if (req.body.is_important === undefined) {
      throw createValidationError('is_important is required', {
        field: 'is_important',
      });
    }

    req.body.is_important = requireBoolean(req.body.is_important, 'is_important');
    next();
  } catch (error) {
    next(error);
  }
};
