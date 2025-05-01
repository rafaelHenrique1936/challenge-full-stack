const { AppError } = require("../../utils/errors")
const logger = require("../../utils/logger")

function errorMiddleware(err, req, res, next) {
  logger.error(`${err.name}: ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
  })

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      code: err.statusCode,
      message: err.message,
      errors: err.errors,
    })
  }

  if (err.code === "23505") {
    return res.status(409).json({
      status: "error",
      code: 409,
      message: "A record with this data already exists",
    })
  }

  return res.status(500).json({
    status: "error",
    code: 500,
    message: "Internal server error",
  })
}

module.exports = errorMiddleware
