class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message)
    this.statusCode = statusCode
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

class ValidationError extends AppError {
  constructor(message, errors = []) {
    super(message, 400)
    this.errors = errors
  }
}

class NotFoundError extends AppError {
  constructor(message) {
    super(message, 404)
  }
}

class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401)
  }
}

class ForbiddenError extends AppError {
  constructor(message = "Access denied") {
    super(message, 403)
  }
}

class ConflictError extends AppError {
  constructor(message) {
    super(message, 409)
  }
}

module.exports = {
  AppError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
}
