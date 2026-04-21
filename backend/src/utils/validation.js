import AppError from './AppError.js';

export const createValidationError = (message, details = null) =>
  new AppError(message, 400, {
    code: 'VALIDATION_ERROR',
    details,
  });

export const requireTrimmedString = (value, fieldName) => {
  if (typeof value !== 'string' || !value.trim()) {
    throw createValidationError(`${fieldName} is required`, {
      field: fieldName,
    });
  }

  return value.trim();
};

export const requirePositiveInteger = (value, fieldName) => {
  const normalizedValue = Number(value);

  if (!Number.isInteger(normalizedValue) || normalizedValue < 1) {
    throw createValidationError(`${fieldName} must be a positive integer`, {
      field: fieldName,
    });
  }

  return normalizedValue;
};

export const requireBoolean = (value, fieldName) => {
  if (typeof value !== 'boolean') {
    throw createValidationError(`${fieldName} must be a boolean`, {
      field: fieldName,
    });
  }

  return value;
};

export const requireValidUrl = (value, fieldName) => {
  const normalizedValue = requireTrimmedString(value, fieldName);

  try {
    new URL(normalizedValue);
  } catch {
    throw createValidationError(`${fieldName} must be a valid URL`, {
      field: fieldName,
    });
  }

  return normalizedValue;
};
