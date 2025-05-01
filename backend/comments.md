# Documentation

## General Information

This project was developed in **Node.js** using **PostgreSQL** database, structured with a focus on scalability, code quality, and maintainability. **Unit tests with Jest** and good development practices such as **SOLID**, separation of concerns, and dependency injection were used.

---

## Architecture Decision: Clean Architecture

The architecture adopted was based on the **Clean Architecture** pattern, promoting a clear separation between application responsibilities. The project structure allows for easy maintenance, testing, and scalability.

**Layers and Responsibilities:**

- **Domain**: Contains business entities and repository interfaces.
  - **Entities**: Represent domain objects with their validation rules.
  - **Repositories (Interfaces)**: Define contracts for data access.

- **Application**: Contains the business logic of the application.
  - **Services**: Implement use cases and orchestrate business operations.
  - **DTOs**: Data transfer objects between layers.

- **Infrastructure**: Implements interfaces defined in the domain.
  - **Repositories (Implementations)**: Implement data access using Knex.
  - **Database**: Database configurations and migrations.

- **Interfaces**: Responsible for communication with the external world.
  - **Controllers**: Receive requests and delegate to appropriate services.
  - **Routes**: Define API endpoints.
  - **Middlewares**: Intercept requests for validation, authentication, etc.

- **Utils**: Contains reusable helper functions.
  - **Errors**: Custom error classes for error handling.
  - **Logger**: Structured logging system.

This structure improves cohesion, facilitates testing, and allows the system to evolve without strong coupling, following SOLID principles:

- **S (Single Responsibility)**: Each class has a single responsibility.
- **O (Open/Closed)**: Components are open for extension, closed for modification.
- **L (Liskov Substitution)**: Implementations can be substituted without affecting behavior.
- **I (Interface Segregation)**: Specific interfaces for each need.
- **D (Dependency Inversion)**: Dependency on abstractions, not concrete implementations.

---

## List of Third-Party Libraries Used:
- **cors**: Cross-Origin Resource Sharing.
- **dotenv**: Reading environment variables from `.env` files.
- **express**: Web framework for creating routes and handling requests.
- **helmet**: Protection against common security vulnerabilities.
- **jsonwebtoken**: Generation and validation of JWT tokens for authentication.
- **knex**: SQL query builder for Node.js.
- **morgan**: HTTP request logger.
- **pg**: PostgreSQL client for Node.js.
- **winston**: Structured logging system.
- **nodemon**: Automatic server restart during development.
- **jest**: Unit testing framework.
- **supertest**: Utility for testing HTTP endpoints.
- **eslint**: Static analysis tool to identify problematic patterns.
- **bcrypt**: Library for hashing passwords.

---

## Improvements Implemented

- **Clean Architecture**: Clear separation between layers with well-defined responsibilities.
- **Dependency Injection**: Components receive their dependencies via constructor.
- **Advanced Error Handling**: Custom error hierarchy with centralized middleware.
- **Multi-Layer Validation**: Validation in entities and middlewares.
- **Structured Logging**: Logging system with different levels and formats.
- **Complete CRUD**: Implementation of all operations for students.
- **Comprehensive Tests**: Unit and integration tests for all functionalities.
- **Enhanced Security**: Robust authentication middleware and protections with Helmet.
- **Graceful Shutdown**: Proper handling of termination signals.
- **Consistent Naming**: All code uses English for variables, functions, and comments.
- **Pagination**: Implemented pagination for listing students.
- **Filtering**: Added filtering capabilities for student searches.
- **Improved CPF Validation**: More robust validation for Brazilian ID numbers.
- **Better Error Messages**: More descriptive error messages for better debugging.
- **Code Documentation**: Added JSDoc comments for better code understanding.

---

## Future Improvements

- **Redis Cache**: To improve performance on repeated requests.
- **Complete Authentication**: User registration and login system.
- **Advanced Validation**: Implementation with libraries like Joi or Yup.
- **Complete Containerization**: Docker for production environment with multiple services.
- **CI/CD**: Continuous integration and delivery with GitHub Actions or similar.
- **Monitoring**: Integration with tools like Prometheus and Grafana.
- **Advanced Documentation**: Detailed technical documentation with JSDoc.
- **Internationalization**: Support for multiple languages in error messages.
- **Rate Limiting**: Protection against API abuse.
- **API Versioning**: Support for multiple API versions.
- **Database Transactions**: Ensure data integrity in complex operations.
- **Soft Delete**: Implement soft delete for data recovery.
- **Audit Logging**: Track changes to data for compliance and debugging.
- **Performance Optimization**: Query optimization and caching strategies.
- **WebSockets**: Real-time updates for collaborative features.

---

## Unit Tests

Tests were implemented using **Jest** and **Supertest**, ensuring that the application endpoints work correctly and preventing unexpected regressions. Test coverage includes:

- Unit tests for services and entities
- Integration tests for API endpoints
- Data validation tests
- Authentication tests

---

## Running the Project

### 1 - Install dependencies:

\`\`\`bash
npm install
\`\`\`

### 2 - Configure environment variables:

\`\`\`bash
cp .env_example .env
\`\`\`

> Adjust environment variables as needed, especially database connection variables (`DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`, etc).

### 3 - Start the database with Docker Compose:

\`\`\`bash
docker-compose up -d
\`\`\`

> This will start a PostgreSQL container according to the configuration in the `docker-compose.yml` file.

### 4 - Create and apply migrations with Knex:

\`\`\`bash
npm run migrate
npm run seed
\`\`\`

> This command will create tables in the database according to the defined migration files.

### 5 - Run unit tests:

\`\`\`bash
npm test
\`\`\`

### 6 - Start the server:

\`\`\`bash
npm start
\`\`\`

> The server will be available at: [http://localhost:3050](http://localhost:3050)

---

## Directory Structure

\`\`\`
src/
├── domain/                  # Domain layer
│   ├── entities/            # Business entities
│   └── repositories/        # Repository interfaces
├── application/             # Application layer
│   └── services/            # Application services
├── infrastructure/          # Infrastructure layer
│   └── repositories/        # Repository implementations
├── interfaces/              # Interface layer
│   ├── controllers/         # Controllers
│   ├── middlewares/         # Middlewares
│   └── routes/              # API routes
├── database/                # Database configurations
│   ├── migrations/          # Knex migrations
│   └── seeds/               # Seeds for initial data
├── utils/                   # Utilities
│   ├── errors.js            # Error classes
│   ├── logger.js            # Logging configuration
├── config/                  # Configurations
│   └── knexfile.js          # Knex configuration
├── app.js                   # Express configuration
└── server.js                # Application entry point
\`\`\`

---

## API Endpoints

The API offers the following endpoints:

- **GET /api/v1/students**: List all students (with pagination and filters)
- **GET /api/v1/students/:id**: Get a specific student
- **POST /api/v1/students**: Create a new student
- **PUT /api/v1/students/:id**: Update an existing student
- **DELETE /api/v1/students/:id**: Remove a student

All endpoints require authentication via JWT token in the `Authorization: Bearer {token}` header.

---

## Git Workflow

This project follows the GitFlow workflow with the following branches:

- **main**: Production-ready code
- **develop**: Development branch with latest features
- **feature/**: Feature branches for new functionality
- **bugfix/**: Branches for bug fixes
- **release/**: Release preparation branches
- **hotfix/**: Urgent fixes for production

Commit messages follow the conventional commits format:

\`\`\`
<type>(<scope>): <description>

[optional body]

[optional footer]
\`\`\`

Where `<type>` is one of:
- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Changes that don't affect code functionality (formatting, etc.)
- **refactor**: Code changes that neither fix bugs nor add features
- **test**: Adding or correcting tests
- **chore**: Changes to build process or auxiliary tools

This approach ensures clear communication about changes and facilitates automated versioning and changelog generation.

---

## Security Considerations

- All endpoints are protected with JWT authentication
- Passwords are hashed using bcrypt
- API is protected against common vulnerabilities with Helmet
- Input validation at multiple layers prevents injection attacks
- Error messages are sanitized to prevent information leakage
- CORS is properly configured to restrict access
- Environment variables are used for sensitive configuration

---

## Performance Optimizations

- Database queries are optimized with proper indexing
- Pagination prevents loading excessive data
- Logging is configured for production efficiency
- Error handling is designed to be performant
- Database connections are properly managed

---
