const swaggerJsdoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Student Management API",
      version: "1.0.0",
      description: "API for managing students in an educational institution",
      contact: {
        name: "API Support",
        email: "support@example.com",
      },
    },
    servers: [
      {
        url: process.env.API_URL || "http://localhost:3050/api/v1",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Student: {
          type: "object",
          required: ["name", "email", "ra", "cpf"],
          properties: {
            id: {
              type: "integer",
              description: "Student ID",
            },
            name: {
              type: "string",
              description: "Student name",
            },
            email: {
              type: "string",
              format: "email",
              description: "Student email",
            },
            ra: {
              type: "string",
              description: "Academic Registration number",
            },
            cpf: {
              type: "string",
              description: "Brazilian ID number (CPF)",
            },
            created_at: {
              type: "string",
              format: "date-time",
              description: "Creation timestamp",
            },
            updated_at: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp",
            },
          },
        },
        User: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            id: {
              type: "integer",
              description: "User ID",
            },
            name: {
              type: "string",
              description: "User name",
            },
            email: {
              type: "string",
              format: "email",
              description: "User email",
            },
            role: {
              type: "string",
              description: "User role",
              enum: ["admin", "user"],
            },
            created_at: {
              type: "string",
              format: "date-time",
              description: "Creation timestamp",
            },
            updated_at: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp",
            },
          },
        },
        Login: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              description: "User email",
            },
            password: {
              type: "string",
              format: "password",
              description: "User password",
            },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            user: {
              $ref: "#/components/schemas/User",
            },
            token: {
              type: "string",
              description: "JWT token",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "error",
            },
            code: {
              type: "integer",
              example: 400,
            },
            message: {
              type: "string",
              example: "Invalid student data",
            },
            errors: {
              type: "array",
              items: {
                type: "string",
              },
              example: ["Name is required", "Email is invalid"],
            },
          },
        },
      },
      paths: {
        "/auth/login": {
          post: {
            summary: "Login to the system",
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Login",
                  },
                },
              },
            },
            responses: {
              200: {
                description: "Login successful",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/AuthResponse",
                    },
                  },
                },
              },
              401: {
                description: "Invalid credentials",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/Error",
                    },
                  },
                },
              },
            },
          },
        },
        "/auth/refresh-token": {
          post: {
            summary: "Refresh JWT token",
            security: [
              {
                bearerAuth: [],
              },
            ],
            responses: {
              200: {
                description: "Token refreshed successfully",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        token: {
                          type: "string",
                          description: "New JWT token",
                        },
                      },
                    },
                  },
                },
              },
              401: {
                description: "Unauthorized",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/Error",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/interfaces/routes/*.js"],
}

const specs = swaggerJsdoc(options)

module.exports = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(specs, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Student Management API Documentation",
  }),
}
