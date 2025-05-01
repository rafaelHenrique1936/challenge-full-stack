const knex = require("../../database/connection")
const IUserRepository = require("../../domain/repositories/IUserRepository")
const User = require("../../domain/entities/User")
const { NotFoundError } = require("../../utils/errors")
const logger = require("../../utils/logger")

class UserRepository extends IUserRepository {
  async findByEmail(email) {
    try {
      const user = await knex("users").where({ email }).first()

      if (!user) {
        return null
      }

      return new User(user)
    } catch (error) {
      logger.error(`Error fetching user with email ${email}:`, error)
      throw error
    }
  }

  async findById(id) {
    try {
      const numericId = Number(id)

      if (isNaN(numericId)) {
        return null
      }

      const user = await knex("users").where({ id: numericId }).first()

      if (!user) {
        return null
      }

      return new User(user)
    } catch (error) {
      logger.error(`Error fetching user with ID ${id}:`, error)
      throw error
    }
  }

  async create(userData) {
    try {
      const [id] = await knex("users")
        .insert({
          name: userData.name,
          email: userData.email,
          password: userData.password,
          role: userData.role || "user",
          created_at: knex.fn.now(),
          updated_at: knex.fn.now(),
        })
        .returning("id")

      return this.findById(id)
    } catch (error) {
      logger.error("Error creating user:", error)
      throw error
    }
  }

  async update(id, userData) {
    try {
      const numericId = Number(id)

      if (isNaN(numericId)) {
        throw new NotFoundError(`User with ID ${id} not found`)
      }

      const user = await this.findById(numericId)

      if (!user) {
        throw new NotFoundError(`User with ID ${id} not found`)
      }

      await knex("users")
        .where({ id: numericId })
        .update({
          ...userData,
          updated_at: knex.fn.now(),
        })

      return this.findById(numericId)
    } catch (error) {
      logger.error(`Error updating user with ID ${id}:`, error)
      throw error
    }
  }

  async delete(id) {
    try {
      const numericId = Number(id)

      if (isNaN(numericId)) {
        throw new NotFoundError(`User with ID ${id} not found`)
      }

      const user = await this.findById(numericId)

      if (!user) {
        throw new NotFoundError(`User with ID ${id} not found`)
      }

      await knex("users").where({ id: numericId }).delete()
      return true
    } catch (error) {
      logger.error(`Error deleting user with ID ${id}:`, error)
      throw error
    }
  }
}

module.exports = UserRepository
