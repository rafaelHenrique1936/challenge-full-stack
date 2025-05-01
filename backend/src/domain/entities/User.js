class User {
  constructor({ id, name, email, password, role, created_at, updated_at }) {
    this.id = id
    this.name = name
    this.email = email
    this.password = password
    this.role = role
    this.created_at = created_at
    this.updated_at = updated_at
  }

  validate() {
    const errors = []

    if (!this.name || this.name.trim() === "") {
      errors.push("Name is required")
    } else if (this.name.length > 255) {
      errors.push("Name must be less than 255 characters")
    }

    if (!this.email) {
      errors.push("Email is required")
    } else if (!this.validateEmail(this.email)) {
      errors.push("Email is invalid")
    } else if (this.email.length > 255) {
      errors.push("Email must be less than 255 characters")
    }

    if (!this.password) {
      errors.push("Password is required")
    } else if (this.password.length < 6) {
      errors.push("Password must be at least 6 characters")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
      created_at: this.created_at,
      updated_at: this.updated_at,
    }
  }
}

module.exports = User
