require("dotenv").config()
const app = require("./app")
const logger = require("./utils/logger")
const knex = require("./database/connection")

const PORT = process.env.PORT || 3050

process.on("uncaughtException", (error) => {
  logger.error("Uncaught exception:", error)
  throw error
})

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled rejection:", reason)
  throw reason
})

async function startServer() {
  try {
    await knex.raw("SELECT 1")
    logger.info("Database connection successful")

    const server = app.listen(PORT, () => {
      logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
    })

    const gracefulShutdown = (signal) => {
      logger.info(`${signal} received, shutting down gracefully`)
      server.close(() => {
        logger.info("HTTP server closed")
        knex.destroy().then(() => {
          logger.info("Database connections closed")
          process.exitCode = 0
        })
      })

      setTimeout(() => {
        logger.error("Forcing shutdown after timeout")
        process.exitCode = 1
      }, 10000)
    }

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"))
    process.on("SIGINT", () => gracefulShutdown("SIGINT"))

    return server
  } catch (error) {
    logger.error("Failed to start server:", error)
    process.exitCode = 1
    throw error
  }
}

if (require.main === module) {
  startServer()
}

module.exports = startServer
