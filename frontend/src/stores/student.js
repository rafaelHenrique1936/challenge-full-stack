import { defineStore } from "pinia"
import axios from "axios"
import { getApiUrl } from "@/config/env"

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

        let url = getApiUrl(`/api/v1/students?page=${page}&pageSize=${pageSize}`)

        if (name) {
          url += `&name=${encodeURIComponent(name)}`
        }

        const response = await axios.get(url)

        if (!response.data.data || !Array.isArray(response.data.data)) {
          console.error("API response does not contain data array:", response.data)
          this.students = []
        } else {
          this.students = response.data.data
        }

        let total = 0
        if (response.data.pagination && typeof response.data.pagination.total === "number") {
          total = response.data.pagination.total
        } else if (typeof response.data.total === "number") {
          total = response.data.total
        }

        this.totalStudents = total

        return {
          data: this.students,
          pagination: {
            total: this.totalStudents,
            page: page,
            pageSize: pageSize,
            totalPages: Math.ceil(this.totalStudents / pageSize),
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

    async getStudents(params) {
      return this.fetchStudents(params)
    },

    async fetchStudentById(id) {
      this.loading = true
      this.error = null

      try {
        const response = await axios.get(getApiUrl(`/api/v1/students/${id}`))
        return { data: response.data }
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
        const cleanedData = {
          ...studentData,
          cpf: studentData.cpf.replace(/\D/g, ""),
        }

        const response = await axios.post(getApiUrl("/api/v1/students"), cleanedData)
        return { success: true, data: response.data }
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
        const cleanedData = {
          ...studentData,
          cpf: studentData.cpf.replace(/\D/g, ""),
        }

        const response = await axios.put(getApiUrl(`/api/v1/students/${id}`), cleanedData)
        return { success: true, data: response.data }
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
        await axios.delete(getApiUrl(`/api/v1/students/${id}`))
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
        const response = await axios.get(getApiUrl(`/api/v1/students/check-ra/${encodeURIComponent(ra)}`))

        return {
          data: {
            available: response.data.data.available,
            message: response.data.data.message,
            ra: response.data.data.ra,
          },
        }
      } catch (error) {
        console.error(`Error checking RA availability for ${ra}:`, error)
        throw error
      }
    },
  },
})
