class Student {
  constructor({ id, name, email, ra, cpf, created_at, updated_at }) {
    this.id = id
    this.name = name
    this.email = email
    this.ra = ra
    this.cpf = cpf
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

    if (!this.ra || this.ra.trim() === "") {
      errors.push("RA is required")
    } else if (this.ra.length > 20) {
      errors.push("RA must be less than 20 characters")
    }

    if (!this.cpf) {
      errors.push("CPF is required")
    } else if (!this.validateCPF(this.cpf)) {
      errors.push("CPF is invalid")
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

  validateCPF(cpf) {
    if (!cpf || cpf.length !== 11 || !/^\d+$/.test(cpf)) {
      return false
    }

    if (/^(\d)\1+$/.test(cpf)) {
      return false
    }

    return true
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      ra: this.ra,
      cpf: this.cpf,
      created_at: this.created_at,
      updated_at: this.updated_at,
    }
  }
}

module.exports = Student
