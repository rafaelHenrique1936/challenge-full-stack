const logger = require("../../utils/logger")

class StudentController {
  constructor(studentService) {
    this.studentService = studentService
  }

  async getAll(req, res, next) {
    try {
      const { pageSize = 10, page = 1, name } = req.query

      const result = await this.studentService.getAllStudents({
        pageSize: Number(pageSize),
        page: Number(page),
        name,
      })

      res.status(200).json(result)
    } catch (error) {
      logger.error("Error in StudentController.getAll:", error)
      next(error)
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params
      const student = await this.studentService.getStudentById(id)
      res.status(200).json({
        data: student,
      })
    } catch (error) {
      logger.error(`Error in StudentController.getById for ID ${req.params.id}:`, error)

      if (error.name === "NotFoundError") {
        return res.status(404).json({
          status: "error",
          code: 404,
          message: error.message,
        })
      }

      next(error)
    }
  }

  async create(req, res, next) {
    try {
      const student = await this.studentService.createStudent(req.body)

      return res.status(201).json({
        message: "Student created successfully",
        data: student,
      })
    } catch (error) {
      logger.error("Error in StudentController.create:", error)

      if (error.name === "ValidationError") {
        return res.status(400).json({
          status: "error",
          code: 400,
          message: error.message,
          errors: error.errors || [],
        })
      }

      next(error)
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params
      const student = await this.studentService.updateStudent(id, req.body)

      return res.status(200).json({
        message: "Student updated successfully",
        data: student,
      })
    } catch (error) {
      logger.error(`Error in StudentController.update for ID ${req.params.id}:`, error)

      if (error.name === "NotFoundError") {
        return res.status(404).json({
          status: "error",
          code: 404,
          message: error.message,
        })
      }

      if (error.name === "ValidationError") {
        return res.status(400).json({
          status: "error",
          code: 400,
          message: error.message,
          errors: error.errors || [],
        })
      }

      next(error)
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params
      await this.studentService.deleteStudent(id)

      return res.status(200).json({
        message: "Student deleted successfully",
      })
    } catch (error) {
      logger.error(`Error in StudentController.delete for ID ${req.params.id}:`, error)

      if (error.name === "NotFoundError") {
        return res.status(404).json({
          status: "error",
          code: 404,
          message: error.message,
        })
      }

      next(error)
    }
  }

  async checkRAAvailability(req, res, next) {
    try {
      const { ra } = req.params
      const result = await this.studentService.checkRAAvailability(ra)

      return res.status(200).json({
        data: result,
      })
    } catch (error) {
      logger.error(`Error in StudentController.checkRAAvailability for RA ${req.params.ra}:`, error)

      if (error.name === "ValidationError") {
        return res.status(400).json({
          status: "error",
          code: 400,
          message: "Please provide a valid registration number to check",
        })
      }

      next(error)
    }
  }
}

module.exports = StudentController
