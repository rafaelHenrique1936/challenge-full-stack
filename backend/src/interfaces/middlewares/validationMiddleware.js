const { ValidationError } = require("../../utils/errors")

const validateStudent = (req, res, next) => {
  const { name, email, ra, cpf } = req.body
  const errors = []

  if (!name || name.trim() === "") {
    errors.push("Name is required")
  } else if (name.length > 255) {
    errors.push("Name must be less than 255 characters")
  }

  if (!email) {
    errors.push("Email is required")
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      errors.push("Email is invalid")
    } else if (email.length > 255) {
      errors.push("Email must be less than 255 characters")
    }
  }

  if (!ra || ra.trim() === "") {
    errors.push("RA is required")
  } else if (ra.length > 20) {
    errors.push("RA must be less than 20 characters")
  }

  if (!cpf) {
    errors.push("CPF is required")
  } else if (cpf.length !== 11 || !/^\d+$/.test(cpf)) {
    errors.push("CPF must be 11 digits")
  }

  if (errors.length > 0) {
    throw new ValidationError("Invalid student data", errors)
  }

  next()
}

const validateStudentUpdate = (req, res, next) => {
  const { name, email } = req.body
  const errors = []

  if (name !== undefined) {
    if (name.trim() === "") {
      errors.push("Name cannot be empty")
    } else if (name.length > 255) {
      errors.push("Name must be less than 255 characters")
    }
  }

  if (email !== undefined) {
    if (email.trim() === "") {
      errors.push("Email cannot be empty")
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        errors.push("Email is invalid")
      } else if (email.length > 255) {
        errors.push("Email must be less than 255 characters")
      }
    }
  }

  if (errors.length > 0) {
    throw new ValidationError("Invalid student data", errors)
  }

  next()
}

module.exports = {
  validateStudent,
  validateStudentUpdate,
}
