import AppError from '../utils/AppError.js';

const mapDatabaseError = (err) => {
  const databaseErrors = {
    '22P02': new AppError('Invalid database value format', 400, {
      code: 'DATABASE_ERROR',
    }),
    '23502': new AppError('A required database field is missing', 400, {
      code: 'DATABASE_ERROR',
      details: {
        field: err.column || null,
      },
    }),
    '23503': new AppError('Referenced record does not exist', 409, {
      code: 'DATABASE_ERROR',
      details: {
        constraint: err.constraint || null,
      },
    }),
    '23505': new AppError('Duplicate value violates a unique constraint', 409, {
      code: 'DATABASE_ERROR',
      details: {
        constraint: err.constraint || null,
      },
    }),
  };

  return databaseErrors[err.code] || null;
};

const normalizeError = (err) => {
  if (err instanceof AppError) {
    return err;
  }

  if (err.type === 'entity.parse.failed') {
    return new AppError('Invalid JSON body', 400, {
      code: 'VALIDATION_ERROR',
      details: {
        source: 'request_body',
      },
    });
  }

  if (err.code) {
    const databaseError = mapDatabaseError(err);

    if (databaseError) {
      return databaseError;
    }
  }

  return new AppError('Internal Server Error', 500, {
    code: 'INTERNAL_SERVER_ERROR',
    isOperational: false,
  });
};

const errorHandler = (err, req, res, next) => {
  const normalizedError = normalizeError(err);
  const statusCode = normalizedError.statusCode || 500;

  if (statusCode >= 500) {
    console.error('Error:', err);
  } else {
    console.error('Error:', normalizedError.message);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code: normalizedError.code,
      message: normalizedError.message,
      details: normalizedError.details,
    },
  });
};

export default errorHandler;
