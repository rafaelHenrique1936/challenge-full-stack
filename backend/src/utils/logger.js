const winston = require("winston")
const path = require("path")
const fs = require("fs")

const logsDir = path.join(process.cwd(), "logs")
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir)
}

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json(),
)

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: logFormat,
  defaultMeta: { service: "student-api" },
  transports: [
    new winston.transports.File({
      filename: path.join(logsDir, "error.log"),
      level: "error",
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(logsDir, "combined.log"),
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, "exceptions.log"),
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, "rejections.log"),
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
})

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
  )
}

module.exports = logger
