class AppError extends Error {
  constructor(message, statusCode, options = {}) {
    super(message);

    this.statusCode = statusCode;
    this.code = options.code || 'APP_ERROR';
    this.details = options.details || null;
    this.isOperational = options.isOperational ?? true;
  }
}

export default AppError;
