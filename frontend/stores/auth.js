import { defineStore } from "pinia"
import axios from "axios"

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || null,
    user: JSON.parse(localStorage.getItem("user")) || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async login(email, password) {
      try {
        const response = {
          data: {
            token: "fake-jwt-token",
            user: {
              id: 1,
              name: "Administrador",
              email: email,
            },
          },
        }

        this.token = response.data.token
        this.user = response.data.user

        localStorage.setItem("token", this.token)
        localStorage.setItem("user", JSON.stringify(this.user))

        axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`

        return response.data
      } catch (error) {
        console.error("Login error:", error)
        throw error
      }
    },

    logout() {
      this.token = null
      this.user = null

      localStorage.removeItem("token")
      localStorage.removeItem("user")

      delete axios.defaults.headers.common["Authorization"]
    },

    init() {
      if (this.token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`
      }
    },
  },
})
