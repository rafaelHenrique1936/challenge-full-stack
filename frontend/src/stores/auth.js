import { defineStore } from "pinia"
import axios from "axios"
import { getApiUrl } from "@/config/env"

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    userFullName: (state) => state.user?.name || "Usuário",
    userInitials: (state) => {
      if (!state.user?.name) return "U";
      
      const nameParts = state.user.name.split(" ");
      if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
      
      return (
        nameParts[0].charAt(0).toUpperCase() + 
        nameParts[nameParts.length - 1].charAt(0).toUpperCase()
      );
    },
  },

  actions: {
    init() {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      
      if (token) {
        this.token = token;
        this.user = user ? JSON.parse(user) : null;
      }
    },
    
    async login(email, password) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.post(getApiUrl('/api/v1/auth/login'), {
          email,
          password,
        });
        
        const { token, user } = response.data;
        
        this.token = token;
        this.user = user;
        
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || "Falha na autenticação";
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    logout() {
      this.token = null;
      this.user = null;
      
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    
    async updateProfile(userData) {
      this.loading = true;
      
      try {
        const response = await axios.put(getApiUrl('/api/v1/users/profile'), userData);
        
        this.user = response.data.user;
        localStorage.setItem("user", JSON.stringify(this.user));
        
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || "Falha ao atualizar perfil";
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async changePassword(currentPassword, newPassword) {
      this.loading = true;
      
      try {
        const response = await axios.put(getApiUrl('/api/v1/users/change-password'), {
          currentPassword,
          newPassword,
        });
        
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || "Falha ao alterar senha";
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});