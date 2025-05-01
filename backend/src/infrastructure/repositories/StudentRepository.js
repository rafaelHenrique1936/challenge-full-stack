const knex = require("../../database/connection")
const IStudentRepository = require("../../domain/repositories/IStudentRepository")
const Student = require("../../domain/entities/Student")
const { NotFoundError } = require("../../utils/errors")
const logger = require("../../utils/logger")

class StudentRepository extends IStudentRepository {
  async getAll({ pageSize = 10, offset = 0, name = null }) {
    try {
      const query = knex("students").select("*")

      if (name) {
        query.whereILike("name", `%${name}%`)
      }

      const results = await query.limit(pageSize).offset(offset).orderBy("name", "asc")
      return results.map((student) => new Student(student))
    } catch (error) {
      logger.error("Error fetching students:", error)
      throw error
    }
  }

  async count(name = null) {
    try {
      const query = knex("students").count("id as count")

      if (name) {
        query.whereILike("name", `%${name}%`)
      }

      const result = await query.first()
      return Number.parseInt(result.count)
    } catch (error) {
      logger.error("Error counting students:", error)
      throw error
    }
  }

  async getById(id) {
    try {
      const numericId = Number(id)

      if (isNaN(numericId)) {
        return null
      }

      const student = await knex("students").where({ id: numericId }).first()

      if (!student) {
        return null
      }

      return new Student(student)
    } catch (error) {
      logger.error(`Error fetching student with ID ${id}:`, error)
      throw error
    }
  }

  async getByRA(ra) {
    try {
      const student = await knex("students").where({ ra }).first()

      if (!student) {
        return null
      }

      return new Student(student)
    } catch (error) {
      logger.error(`Error fetching student with RA ${ra}:`, error)
      throw error
    }
  }

  async getByCPF(cpf) {
    try {
      const student = await knex("students").where({ cpf }).first()

      if (!student) {
        return null
      }

      return new Student(student)
    } catch (error) {
      logger.error(`Error fetching student with CPF ${cpf}:`, error)
      throw error
    }
  }

  async create(studentData) {
    try {
      const [id] = await knex("students")
        .insert({
          name: studentData.name,
          email: studentData.email,
          ra: studentData.ra,
          cpf: studentData.cpf,
          created_at: knex.fn.now(),
          updated_at: knex.fn.now(),
        })
        .returning("id")

      return this.getById(id)
    } catch (error) {
      logger.error("Error creating student:", error)
      throw error
    }
  }

  async update(id, studentData) {
    try {
      const numericId = Number(id)

      if (isNaN(numericId)) {
        throw new NotFoundError(`Student with ID ${id} not found`)
      }

      const student = await this.getById(numericId)

      if (!student) {
        throw new NotFoundError(`Student with ID ${id} not found`)
      }

      await knex("students")
        .where({ id: numericId })
        .update({
          ...studentData,
          updated_at: knex.fn.now(),
        })

      return this.getById(numericId)
    } catch (error) {
      logger.error(`Error updating student with ID ${id}:`, error)
      throw error
    }
  }

  async delete(id) {
    try {
      const numericId = Number(id)

      if (isNaN(numericId)) {
        throw new NotFoundError(`Student with ID ${id} not found`)
      }

      const student = await this.getById(numericId)

      if (!student) {
        throw new NotFoundError(`Student with ID ${id} not found`)
      }

      await knex("students").where({ id: numericId }).delete()
      return true
    } catch (error) {
      logger.error(`Error deleting student with ID ${id}:`, error)
      throw error
    }
  }
}

module.exports = StudentRepository
