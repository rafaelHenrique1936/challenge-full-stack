<template>
  <v-container fluid class="fill-height login-container">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-8 rounded-lg login-card">
          <v-card-item class="text-center py-6 bg-primary text-white">
            <v-card-title class="text-h4 font-weight-bold">
              <v-icon size="x-large" class="mr-2">mdi-school</v-icon>
              SisAlunos
            </v-card-title>
            <v-card-subtitle class="text-white text-subtitle-1 mt-2">
              Sistema de Gerenciamento de Alunos
            </v-card-subtitle>
          </v-card-item>
          
          <v-card-text class="pa-6">
            <v-form ref="form" v-model="valid" @submit.prevent="login">
              <v-text-field
                v-model="email"
                :rules="emailRules"
                label="Email"
                prepend-inner-icon="mdi-email"
                variant="outlined"
                required
                autocomplete="email"
                class="mb-4"
              ></v-text-field>
              
              <v-text-field
                v-model="password"
                :rules="passwordRules"
                label="Senha"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showPassword = !showPassword"
                :type="showPassword ? 'text' : 'password'"
                variant="outlined"
                required
                autocomplete="current-password"
                class="mb-6"
              ></v-text-field>
              
              <v-btn
                type="submit"
                color="primary"
                block
                size="large"
                :loading="loading"
                :disabled="!valid || loading"
                class="mb-4"
              >
                Entrar
              </v-btn>
              
              <div class="d-flex align-center justify-space-between">
                <v-checkbox
                  v-model="rememberMe"
                  label="Lembrar-me"
                  hide-details
                  density="compact"
                ></v-checkbox>
                
                <v-btn
                  variant="text"
                  color="primary"
                  @click="forgotPassword"
                  size="small"
                >
                  Esqueceu a senha?
                </v-btn>
              </div>
            </v-form>
          </v-card-text>
          
          <v-divider></v-divider>
          
          <v-card-actions class="pa-4 bg-grey-lighten-4">
            <v-spacer></v-spacer>
            <div class="text-caption text-grey">
              © {{ new Date().getFullYear() }} SisAlunos - Todos os direitos reservados
            </div>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    
    <v-snackbar
      v-model="showToast"
      :color="toastColor"
      :timeout="5000"
      location="top"
    >
      {{ toastMessage }}
      
      <template v-slot:actions>
        <v-btn
          variant="text"
          icon="mdi-close"
          @click="showToast = false"
        ></v-btn>
      </template>
    </v-snackbar>
  </v-container>
  </template>
  
  <script>
  import { useRouter } from "vue-router"
  import { useAuthStore } from "@/stores/auth"
  import { translateMessage } from "@/services/translationService"
  
  export default {
  name: "LoginView",
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
  
    return { router, authStore }
  },
  data() {
    return {
      valid: false,
      loading: false,
      showPassword: false,
      showToast: false,
      toastMessage: "",
      toastColor: "error",
      email: "",
      password: "",
      rememberMe: false,
      emailRules: [
        (v) => !!v || "Email é obrigatório", 
        (v) => /.+@.+\..+/.test(v) || "Email deve ser válido"
      ],
      passwordRules: [
        (v) => !!v || "Senha é obrigatória",
        (v) => v.length >= 5 || "A senha deve ter pelo menos 5 caracteres"
      ],
    }
  },
  mounted() {
    if (this.authStore.isAuthenticated) {
      this.router.push("/alunos")
    }
  },
  methods: {
    showToastMessage(message, isError = true) {
      this.toastMessage = translateMessage(message);
      this.toastColor = isError ? "error" : "success";
      this.showToast = true;
    },
    
    async login() {
      if (!this.$refs.form.validate()) return
  
      this.loading = true
  
      try {
        const response = await this.authStore.login(this.email, this.password)
        
        if (response && response.message) {
          this.showToastMessage(response.message, false);
        }
        
        this.router.push("/alunos")
      } catch (error) {
        console.error("Login error:", error)
        
        if (error.response) {
          if (error.response.data && error.response.data.message) {
            let message = error.response.data.message;
            
            this.showToastMessage(message, true);
          } else {
            this.showToastMessage(`Erro ${error.response.status}: Falha na autenticação.`, true);
          }
        } else if (error.request) {
          this.showToastMessage("Erro de conexão com o servidor. Verifique sua conexão de internet.", true);
        } else {
          this.showToastMessage("Erro ao fazer login. Tente novamente mais tarde.", true);
        }
      } finally {
        this.loading = false
      }
    },
    forgotPassword() {
      alert("Funcionalidade em desenvolvimento. Entre em contato com o administrador.")
    },
  },
  }
  </script>
  
  <style scoped>
  .login-container {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  }
  
  .login-card {
  overflow: hidden;
  transition: transform 0.3s ease;
  }
  
  .login-card:hover {
  transform: translateY(-5px);
  }
  </style>