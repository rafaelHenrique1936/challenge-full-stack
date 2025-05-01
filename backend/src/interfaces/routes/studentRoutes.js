const express = require("express")
const router = express.Router()
const StudentController = require("../controllers/StudentController")
const StudentService = require("../../application/services/StudentService")
const StudentRepository = require("../../infrastructure/repositories/StudentRepository")
const authMiddleware = require("../middlewares/authMiddleware")
const { validateStudent, validateStudentUpdate } = require("../middlewares/validationMiddleware")

const studentRepository = new StudentRepository()
const studentService = new StudentService(studentRepository)
const studentController = new StudentController(studentService)

router.get("/students/check-ra/:ra", authMiddleware, (req, res, next) =>
  studentController.checkRAAvailability(req, res, next),
)

router.get("/students", authMiddleware, (req, res, next) => studentController.getAll(req, res, next))

router.get("/students/:id", authMiddleware, (req, res, next) => studentController.getById(req, res, next))

router.post("/students", [authMiddleware, validateStudent], (req, res, next) =>
  studentController.create(req, res, next),
)

router.put("/students/:id", [authMiddleware, validateStudentUpdate], (req, res, next) =>
  studentController.update(req, res, next),
)

router.delete("/students/:id", authMiddleware, (req, res, next) => studentController.delete(req, res, next))

module.exports = router
