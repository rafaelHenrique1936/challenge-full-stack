const request = require("supertest")
const app = require("../app")
const knex = require("../database/connection")

beforeAll(async () => {
  await knex.migrate.rollback()
  await knex.migrate.latest()
  await knex.seed.run()
})

afterAll(async () => {
  await knex.destroy()
})

describe("Auth API", () => {
  describe("POST /api/v1/auth/login", () => {
    it("should authenticate with valid credentials", async () => {
      const response = await request(app).post("/api/v1/auth/login").send({
        email: "admin@example.com",
        password: "admin",
      })

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty("token")
      expect(response.body).toHaveProperty("user")
      expect(response.body.user).toHaveProperty("email", "admin@example.com")
      expect(response.body.user).toHaveProperty("role", "admin")
    })

    it("should return 401 with invalid credentials", async () => {
      const response = await request(app).post("/api/v1/auth/login").send({
        email: "admin@example.com",
        password: "wrongpassword",
      })

      expect(response.status).toBe(401)
      expect(response.body.message).toBe("Invalid credentials")
    })

    it("should return 400 with missing credentials", async () => {
      const response = await request(app).post("/api/v1/auth/login").send({
        email: "admin@example.com",
      })

      expect(response.status).toBe(400)
      expect(response.body.message).toBe("Email and password are required")
    })
  })

  describe("POST /api/v1/auth/refresh-token", () => {
    it("should refresh token with valid token", async () => {
      const loginResponse = await request(app).post("/api/v1/auth/login").send({
        email: "admin@example.com",
        password: "admin",
      })

      const token = loginResponse.body.token

      const response = await request(app).post("/api/v1/auth/refresh-token").set("Authorization", `Bearer ${token}`)

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty("token")
    })

    it("should return 401 with invalid token", async () => {
      const response = await request(app).post("/api/v1/auth/refresh-token").set("Authorization", "Bearer invalidtoken")

      expect(response.status).toBe(401)
      expect(response.body.message).toBe("Invalid token")
    })
  })
})
