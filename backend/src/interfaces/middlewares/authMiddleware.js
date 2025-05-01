const jwt = require("jsonwebtoken")
const { UnauthorizedError } = require("../../utils/errors")
const logger = require("../../utils/logger")

function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      throw new UnauthorizedError("Token not provided")
    }

    const parts = authHeader.split(" ")

    if (parts.length !== 2) {
      throw new UnauthorizedError("Token format error")
    }

    const [scheme, token] = parts

    if (!/^Bearer$/i.test(scheme)) {
      throw new UnauthorizedError("Token malformatted")
    }

    jwt.verify(token, process.env.JWT_SECRET || "test_secret", (err, decoded) => {
      if (err) {
        logger.error("JWT verification error:", err)

        if (err.name === "TokenExpiredError") {
          throw new UnauthorizedError("Token expired")
        }

        throw new UnauthorizedError("Invalid token")
      }

      req.user = decoded
      return next()
    })
  } catch (error) {
    return res.status(401).json({
      status: "error",
      code: 401,
      message: error.message || "Unauthorized",
    })
  }
}

module.exports = authMiddleware
