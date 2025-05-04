const request = require("supertest")
const jwt = require("jsonwebtoken")
const app = require("../app")
const knex = require("../database/connection")

const generateTestToken = () => {
  return jwt.sign(
    { id: 1, name: "Test User", email: "test@example.com", role: "admin" },
    process.env.JWT_SECRET || "test_secret",
    {
      expiresIn: "1h",
    },
  )
}

beforeAll(async () => {
  await knex.migrate.rollback()
  await knex.migrate.latest()
  await knex.seed.run()
})

afterAll(async () => {
  await knex.destroy()
})

describe("Student API", () => {
  describe("GET /api/v1/students", () => {
    it("should return all students with pagination", async () => {
      const token = generateTestToken()
      const response = await request(app).get("/api/v1/students").set("Authorization", `Bearer ${token}`)

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty("data")
      expect(response.body).toHaveProperty("pagination")
      expect(Array.isArray(response.body.data)).toBe(true)
      expect(response.body.data.length).toBeGreaterThan(0)
    })

    it("should return 401 if token is missing", async () => {
      const response = await request(app).get("/api/v1/students")

      expect(response.status).toBe(401)
      expect(response.body.message).toBe("Token not provided")
    })

    it("should filter students by name", async () => {
      const token = generateTestToken()
      const response = await request(app).get("/api/v1/students?name=Rafael").set("Authorization", `Bearer ${token}`)

      expect(response.status).toBe(200)
      expect(Array.isArray(response.body.data)).toBe(true)
      expect(response.body.data.length).toBeGreaterThan(0)
      expect(response.body.data[0].name).toContain("Rafael")
    })

    it("should paginate results correctly", async () => {
      const token = generateTestToken()
      const response = await request(app)
        .get("/api/v1/students?pageSize=2&page=1")
        .set("Authorization", `Bearer ${token}`)

      expect(response.status).toBe(200)
      expect(response.body.data.length).toBeLessThanOrEqual(2)
      expect(response.body.pagination.pageSize).toBe(2)
      expect(response.body.pagination.page).toBe(1)
    })
  })

  describe("GET /api/v1/students/:id", () => {
    it("should return a student by ID", async () => {
      const token = generateTestToken()

      const allStudents = await request(app).get("/api/v1/students").set("Authorization", `Bearer ${token}`)

      const studentId = allStudents.body.data[0].id

      const response = await request(app).get(`/api/v1/students/${studentId}`).set("Authorization", `Bearer ${token}`)

      expect(response.status).toBe(200)
      expect(response.body.data.id).toBe(studentId)
      expect(response.body.data).toHaveProperty("name")
      expect(response.body.data).toHaveProperty("email")
      expect(response.body.data).toHaveProperty("ra")
      expect(response.body.data).toHaveProperty("cpf")
    })

    it("should return 404 for non-existent ID", async () => {
      const token = generateTestToken()
      const response = await request(app).get("/api/v1/students/9999").set("Authorization", `Bearer ${token}`)

      expect(response.status).toBe(404)
      expect(response.body.message).toContain("not found")
    })
  })

  describe("POST /api/v1/students", () => {
    it("should create a new student", async () => {
      const token = generateTestToken()
      const newStudent = {
        name: "New Test Student",
        email: "newtest@example.com",
        ra: "987654",
        cpf: "12345678901",
      }

      const response = await request(app)
        .post("/api/v1/students")
        .set("Authorization", `Bearer ${token}`)
        .send(newStudent)

      expect(response.status).toBe(201)
      expect(response.body.message).toContain("created successfully")
    })

    it("should return error for invalid data", async () => {
      const token = generateTestToken()
      const invalidStudent = {
        name: "",
        email: "invalid-email",
        ra: "",
        cpf: "123",
      }

      const response = await request(app)
        .post("/api/v1/students")
        .set("Authorization", `Bearer ${token}`)
        .send(invalidStudent)

      expect(response.status).toBe(400)
    })

    it("should return error for duplicate RA", async () => {
      const token = generateTestToken()

      const allStudents = await request(app).get("/api/v1/students").set("Authorization", `Bearer ${token}`)

      const existingRA = allStudents.body.data[0].ra

      const duplicateStudent = {
        name: "Duplicate RA Student",
        email: "duplicate@example.com",
        ra: existingRA,
        cpf: "98765432101",
      }

      const response = await request(app)
        .post("/api/v1/students")
        .set("Authorization", `Bearer ${token}`)
        .send(duplicateStudent)

      expect(response.status).toBe(400)
      expect(response.body.message).toContain("already in use")
    })
  })

  describe("PUT /api/v1/students/:id", () => {
    it("should update an existing student", async () => {
      const token = generateTestToken()

      const allStudents = await request(app).get("/api/v1/students").set("Authorization", `Bearer ${token}`)

      const studentId = allStudents.body.data[0].id

      const updatedData = {
        name: "Updated Name",
        email: "updated@example.com",
      }

      const response = await request(app)
        .put(`/api/v1/students/${studentId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updatedData)

      expect(response.status).toBe(200)
      expect(response.body.message).toContain("updated successfully")
      expect(response.body.data.id).toBe(studentId)
      expect(response.body.data.name).toBe(updatedData.name)
      expect(response.body.data.email).toBe(updatedData.email)
    })

    it("should return 404 for non-existent ID", async () => {
      const token = generateTestToken()
      const updatedData = {
        name: "Updated Name",
        email: "updated@example.com",
      }

      const response = await request(app)
        .put("/api/v1/students/9999")
        .set("Authorization", `Bearer ${token}`)
        .send(updatedData)

      expect(response.status).toBe(404)
      expect(response.body.message).toContain("not found")
    })

    it("should return error for invalid data", async () => {
      const token = generateTestToken()

      const allStudents = await request(app).get("/api/v1/students").set("Authorization", `Bearer ${token}`)

      const studentId = allStudents.body.data[0].id

      const invalidData = {
        name: "",
        email: "invalid-email",
      }

      const response = await request(app)
        .put(`/api/v1/students/${studentId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(invalidData)

      expect(response.status).toBe(400)
    })
  })

  describe("DELETE /api/v1/students/:id", () => {
    it("should delete a student", async () => {
      const token = generateTestToken()

      const newStudent = {
        name: "Student to Delete",
        email: "delete@example.com",
        ra: "654321",
        cpf: "10987654321",
      }

      await request(app).post("/api/v1/students").set("Authorization", `Bearer ${token}`).send(newStudent)

      const allStudents = await request(app).get("/api/v1/students").set("Authorization", `Bearer ${token}`)
      const studentToDelete = allStudents.body.data.find((student) => student.email === "delete@example.com")

      expect(studentToDelete).toBeDefined()

      const studentId = studentToDelete.id

      const response = await request(app)
        .delete(`/api/v1/students/${studentId}`)
        .set("Authorization", `Bearer ${token}`)

      expect(response.status).toBe(200)
      expect(response.body.message).toContain("deleted successfully")

      const getResponse = await request(app)
        .get(`/api/v1/students/${studentId}`)
        .set("Authorization", `Bearer ${token}`)

      expect(getResponse.status).toBe(404)
    })

    it("should return 404 for non-existent ID", async () => {
      const token = generateTestToken()
      const response = await request(app).delete("/api/v1/students/9999").set("Authorization", `Bearer ${token}`)

      expect(response.status).toBe(404)
      expect(response.body.message).toContain("not found")
    })
  })

  describe("GET /api/v1/students/check-ra/:ra", () => {
    it("should return available: false for existing RA", async () => {
      const token = generateTestToken()

      const allStudents = await request(app).get("/api/v1/students").set("Authorization", `Bearer ${token}`)
      const existingRA = allStudents.body.data[0].ra

      const response = await request(app)
        .get(`/api/v1/students/check-ra/${existingRA}`)
        .set("Authorization", `Bearer ${token}`)

      expect(response.status).toBe(200)
      expect(response.body.data).toHaveProperty("available", false)
      expect(response.body.data).toHaveProperty("ra", existingRA)
      expect(response.body.data).toHaveProperty("message")
      expect(response.body.data.message).toContain("already in use")
    })

    it("should return available: true for non-existing RA", async () => {
      const token = generateTestToken()
      const nonExistingRA = "NONEXISTENT123"

      const response = await request(app)
        .get(`/api/v1/students/check-ra/${nonExistingRA}`)
        .set("Authorization", `Bearer ${token}`)

      expect(response.status).toBe(200)
      expect(response.body.data).toHaveProperty("available", true)
      expect(response.body.data).toHaveProperty("ra", nonExistingRA)
      expect(response.body.data).toHaveProperty("message")
      expect(response.body.data.message).toContain("is available")
    })

    it("should return 404 for empty RA path", async () => {
      const token = generateTestToken()

      const response = await request(app).get(`/api/v1/students/check-ra/`).set("Authorization", `Bearer ${token}`)

      expect(response.status).toBe(404)
    })

    it("should return 401 if token is missing", async () => {
      const response = await request(app).get("/api/v1/students/check-ra/123456")

      expect(response.status).toBe(401)
      expect(response.body.message).toBe("Token not provided")
    })
  })
})
