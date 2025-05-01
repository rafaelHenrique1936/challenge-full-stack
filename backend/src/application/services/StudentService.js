const { ValidationError, NotFoundError } = require("../../utils/errors")
const Student = require("../../domain/entities/Student")

class StudentService {
  constructor(studentRepository) {
    this.studentRepository = studentRepository
  }

  async getAllStudents({ pageSize = 10, page = 1, name = null } = {}) {
    const offset = (page - 1) * pageSize
    const students = await this.studentRepository.getAll({ pageSize, offset, name })
    const total = await this.studentRepository.count(name)

    return {
      data: students,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    }
  }

  async getStudentById(id) {
    const student = await this.studentRepository.getById(id)
    if (!student) {
      throw new NotFoundError(`Student with ID ${id} not found`)
    }
    return student
  }

  async createStudent(studentData) {
    const student = new Student(studentData)
    const validation = student.validate()

    if (!validation.isValid) {
      throw new ValidationError("Invalid student data", validation.errors)
    }

    const existingStudent = await this.studentRepository.getByRA(student.ra)
    if (existingStudent) {
      throw new ValidationError(`Registration number ${student.ra} is already in use by another student`)
    }

    const existingCPF = await this.studentRepository.getByCPF(student.cpf)
    if (existingCPF) {
      throw new ValidationError(`CPF ${student.cpf} is already registered in the system`)
    }

    return this.studentRepository.create(studentData)
  }

  async updateStudent(id, studentData) {
    const existingStudent = await this.getStudentById(id)

    const student = new Student({
      ...existingStudent,
      ...studentData,
      id,
    })

    const validation = student.validate()

    if (!validation.isValid) {
      throw new ValidationError("Invalid student data", validation.errors)
    }

    if (studentData.ra && studentData.ra !== existingStudent.ra) {
      const existingRA = await this.studentRepository.getByRA(studentData.ra)
      if (existingRA && existingRA.id !== Number(id)) {
        throw new ValidationError(`Registration number ${studentData.ra} is already in use by another student`)
      }
    }

    if (studentData.cpf && studentData.cpf !== existingStudent.cpf) {
      const existingCPF = await this.studentRepository.getByCPF(studentData.cpf)
      if (existingCPF && existingCPF.id !== Number(id)) {
        throw new ValidationError(`CPF ${studentData.cpf} is already registered in the system`)
      }
    }

    return this.studentRepository.update(id, studentData)
  }

  async deleteStudent(id) {
    await this.getStudentById(id)
    return this.studentRepository.delete(id)
  }

  async checkRAAvailability(ra) {
    if (!ra || ra.trim() === "") {
      throw new ValidationError("Please provide a registration number to check")
    }

    const existingStudent = await this.studentRepository.getByRA(ra)
    return {
      available: !existingStudent,
      ra,
      message: existingStudent
        ? `Registration number ${ra} is already in use`
        : `Registration number ${ra} is available`,
    }
  }
}

module.exports = StudentService
