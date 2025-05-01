const bcrypt = require("bcrypt")
const { UnauthorizedError } = require("../../utils/errors")
const generateToken = require("../../utils/generateToken")
const logger = require("../../utils/logger")

class AuthService {
  constructor(userRepository) {
    this.userRepository = userRepository
  }

  async authenticate(email, password) {
    try {
      const user = await this.userRepository.findByEmail(email)

      if (!user) {
        throw new UnauthorizedError("Invalid credentials")
      }

      const isPasswordValid = await bcrypt.compare(password, user.password)

      if (!isPasswordValid) {
        throw new UnauthorizedError("Invalid credentials")
      }

      const token = await generateToken({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      })

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      }
    } catch (error) {
      logger.error("Authentication error:", error)
      throw error
    }
  }

  async refreshToken(userId) {
    try {
      const user = await this.userRepository.findById(userId)

      if (!user) {
        throw new UnauthorizedError("User not found")
      }

      const token = await generateToken({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      })

      return { token }
    } catch (error) {
      logger.error("Token refresh error:", error)
      throw error
    }
  }
}

module.exports = AuthService
