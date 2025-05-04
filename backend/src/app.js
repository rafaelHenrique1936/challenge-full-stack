const express = require("express")
const helmet = require("helmet")
const cors = require("cors")
const morgan = require("morgan")
const studentRoutes = require("./interfaces/routes/studentRoutes")
const authRoutes = require("./interfaces/routes/authRoutes")
const errorMiddleware = require("./interfaces/middlewares/errorMiddleware")
const logger = require("./utils/logger")


const app = express()

app.use(helmet())

app.use(cors())

app.use(morgan("combined", { stream: { write: (message) => logger.info(message.trim()) } }))

app.use(express.json())


app.use("/api/v1", studentRoutes)
app.use("/api/v1/auth", authRoutes)

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "1.0.0",
  })
})

app.use(errorMiddleware)

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    code: 404,
    message: "Route not found",
  })
})

module.exports = app
