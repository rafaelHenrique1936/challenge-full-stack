const jwt = require("jsonwebtoken")
require("dotenv").config()
const logger = require("./logger")

async function generateToken(
  payload,
  secret = process.env.JWT_SECRET,
  options = { expiresIn: process.env.JWT_EXPIRES_IN || "1d" },
) {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        logger.error("Error generating token:", err)
        reject(err)
      } else {
        resolve(token)
      }
    })
  })
}

async function generateTestToken() {
  try {
    const token = await generateToken(
      {
        id: 1,
        name: "Test User",
        email: "test@example.com",
        role: "admin",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    )

    logger.info("Test token generated:", token)
    return token
  } catch (error) {
    logger.error("Error generating test token:", error)
    throw error
  }
}

if (require.main === module) {
  generateTestToken()
}

module.exports = generateToken
