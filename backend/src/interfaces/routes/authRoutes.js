const express = require("express")
const router = express.Router()
const AuthController = require("../controllers/AuthController")
const AuthService = require("../../application/services/AuthService")
const UserRepository = require("../../infrastructure/repositories/UserRepository")
const authMiddleware = require("../middlewares/authMiddleware")

const userRepository = new UserRepository()
const authService = new AuthService(userRepository)
const authController = new AuthController(authService)

router.post("/login", (req, res, next) => authController.login(req, res, next))
router.post("/refresh-token", authMiddleware, (req, res, next) => authController.refreshToken(req, res, next))

module.exports = router
