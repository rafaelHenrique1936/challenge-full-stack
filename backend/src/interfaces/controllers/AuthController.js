const { ValidationError } = require("../../utils/errors")
const logger = require("../../utils/logger")

class AuthController {
  constructor(authService) {
    this.authService = authService
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        throw new ValidationError("Email and password are required")
      }

      const result = await this.authService.authenticate(email, password)

      res.status(200).json(result)
    } catch (error) {
      logger.error("Error in AuthController.login:", error)

      if (error instanceof ValidationError) {
        return res.status(400).json({
          status: "error",
          code: 400,
          message: error.message,
          errors: error.errors || [],
        })
      }

      if (error.name === "UnauthorizedError") {
        return res.status(401).json({
          status: "error",
          code: 401,
          message: error.message,
        })
      }

      next(error)
    }
  }

  async refreshToken(req, res, next) {
    try {
      const userId = req.user.id
      const result = await this.authService.refreshToken(userId)

      res.status(200).json(result)
    } catch (error) {
      logger.error("Error in AuthController.refreshToken:", error)
      next(error)
    }
  }
}

module.exports = AuthController
