import { defineStore } from "pinia"

const MOCK_STUDENTS = [
  { id: 1, name: "João Silva", email: "joao@example.com", ra: "12345", cpf: "12345678901" },
  { id: 2, name: "Maria Santos", email: "maria@example.com", ra: "23456", cpf: "23456789012" },
  { id: 3, name: "Pedro Oliveira", email: "pedro@example.com", ra: "34567", cpf: "34567890123" },
  { id: 4, name: "Ana Souza", email: "ana@example.com", ra: "45678", cpf: "45678901234" },
  { id: 5, name: "Carlos Ferreira", email: "carlos@example.com", ra: "56789", cpf: "56789012345" },
]

export const useStudentStore = defineStore("student", {
  state: () => ({
    students: [],
    totalStudents: 0,
    loading: false,
    error: null,
  }),

  getters: {
    studentById: (state) => (id) => {
      return state.students.find((student) => student.id === id)
    },
    hasStudents: (state) => state.students.length > 0,
  },

  actions: {
    async fetchStudents({ page = 1, pageSize = 10, name = undefined } = {}) {
      this.loading = true
      this.error = null

      try {
        let filteredStudents = [...MOCK_STUDENTS]

        if (name) {
          const searchTerm = name.toLowerCase()
          filteredStudents = filteredStudents.filter(
            (student) =>
              student.name.toLowerCase().includes(searchTerm) ||
              student.email.toLowerCase().includes(searchTerm) ||
              student.ra.includes(searchTerm),
          )
        }

        const startIndex = (page - 1) * pageSize
        const paginatedStudents = filteredStudents.slice(startIndex, startIndex + pageSize)

        this.students = paginatedStudents
        this.totalStudents = filteredStudents.length

        return {
          data: paginatedStudents,
          pagination: {
            total: filteredStudents.length,
            page: page,
            pageSize: pageSize,
          },
        }
      } catch (error) {
        this.error = error.message || "Erro ao buscar estudantes"
        console.error("Error fetching students:", error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async getStudents({ page = 1, pageSize = 10, name = undefined } = {}) {
      return this.fetchStudents({ page, pageSize, name })
    },

    async fetchStudentById(id) {
      this.loading = true
      this.error = null

      try {
        const student = MOCK_STUDENTS.find((s) => s.id === id) || {
          id,
          name: "Estudante " + id,
          email: `estudante${id}@example.com`,
          ra: id + "000",
          cpf: "12345678901",
        }

        return { data: student }
      } catch (error) {
        this.error = error.message || `Erro ao buscar estudante com ID ${id}`
        console.error(`Error fetching student with ID ${id}:`, error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async getStudentById(id) {
      return this.fetchStudentById(id)
    },

    async createStudent(studentData) {
      this.loading = true
      this.error = null

      try {
        const newStudent = {
          id: Date.now(),
          ...studentData,
          cpf: studentData.cpf.replace(/\D/g, ""),
        }


        return { success: true, data: newStudent }
      } catch (error) {
        this.error = error.message || "Erro ao criar estudante"
        console.error("Error creating student:", error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateStudent(id, studentData) {
      this.loading = true
      this.error = null

      try {
        const updatedStudent = {
          id,
          ...studentData,
          cpf: studentData.cpf.replace(/\D/g, ""),
        }


        return { success: true, data: updatedStudent }
      } catch (error) {
        this.error = error.message || `Erro ao atualizar estudante com ID ${id}`
        console.error(`Error updating student with ID ${id}:`, error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteStudent(id) {
      this.loading = true
      this.error = null

      try {

        return { success: true }
      } catch (error) {
        this.error = error.message || `Erro ao excluir estudante com ID ${id}`
        console.error(`Error deleting student with ID ${id}:`, error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async checkRAAvailability(ra) {
      try {
        const available = ra !== "12345"
        return { data: { available } }
      } catch (error) {
        console.error(`Error checking RA availability for ${ra}:`, error)
        throw error
      }
    },
  },
})
