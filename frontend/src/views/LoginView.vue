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
            <v-alert
              v-if="errorMessage"
              type="error"
              variant="tonal"
              closable
              class="mb-4"
              @click:close="errorMessage = ''"
            >
              {{ errorMessage }}
            </v-alert>
            
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
  </v-container>
</template>

<script>
import { useRouter } from "vue-router"
import { useAuthStore } from "@/stores/auth"

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
      errorMessage: "",
      email: "",
      password: "",
      rememberMe: false,
      emailRules: [
        (v) => !!v || "Email é obrigatório", 
        (v) => /.+@.+\..+/.test(v) || "Email deve ser válido"
      ],
      passwordRules: [
        (v) => !!v || "Senha é obrigatória",
        (v) => v.length >= 6 || "A senha deve ter pelo menos 6 caracteres"
      ],
    }
  },
  mounted() {
    if (this.authStore.isAuthenticated) {
      this.router.push("/alunos")
    }
  },
  methods: {
    async login() {
      if (!this.$refs.form.validate()) return

      this.loading = true

      try {
        await this.authStore.login(this.email, this.password)
        this.router.push("/alunos")
      } catch (error) {
        this.errorMessage = error.response?.data?.message || "Erro ao fazer login. Verifique suas credenciais."
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
