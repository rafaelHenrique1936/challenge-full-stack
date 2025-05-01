<template>
  <v-app-bar color="primary" app dark elevation="2">
    <v-app-bar-nav-icon @click="toggleDrawer" aria-label="Menu"></v-app-bar-nav-icon>
    
    <div class="d-flex align-center">
      <v-icon size="large" class="mr-2">mdi-school</v-icon>
      <span class="text-h6 font-weight-bold d-none d-sm-block">SisAlunos</span>
    </div>
    
    <v-divider vertical class="mx-4 d-none d-sm-block"></v-divider>
    
    <v-toolbar-title class="text-truncate">{{ title }}</v-toolbar-title>
    <v-spacer></v-spacer>
    
    <v-tooltip location="bottom" text="Alternar tema">
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" icon @click="toggleTheme" aria-label="Alternar tema">
          <v-icon>{{ isDarkTheme ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
        </v-btn>
      </template>
    </v-tooltip>
    
    <v-tooltip location="bottom" text="Sair">
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" icon @click="confirmLogout" aria-label="Sair">
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </template>
    </v-tooltip>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" app temporary>
    <v-list-item class="pa-4 bg-primary text-white">
      <template v-slot:prepend>
        <v-avatar color="white" class="text-primary">
          <span class="text-h6 font-weight-bold">{{ userInitial }}</span>
        </v-avatar>
      </template>
      <v-list-item-title class="text-h6 font-weight-bold">SisAlunos</v-list-item-title>
      <v-list-item-subtitle>Gerenciamento de Alunos</v-list-item-subtitle>
    </v-list-item>

    <v-list-item class="pa-4">
      <v-list-item-title class="text-subtitle-1 font-weight-bold">{{ user.name }}</v-list-item-title>
      <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
    </v-list-item>

    <v-divider></v-divider>

    <v-list nav density="compact">
      <v-list-item to="/alunos" prepend-icon="mdi-account-school" title="Alunos" />
      <v-list-item @click="confirmLogout" prepend-icon="mdi-logout" title="Sair" />
    </v-list>
    
    <template v-slot:append>
      <div class="pa-4">
        <v-btn block variant="tonal" color="primary" @click="toggleTheme">
          <v-icon start>{{ isDarkTheme ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
          {{ isDarkTheme ? 'Modo Claro' : 'Modo Escuro' }}
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
  
  <confirm-dialog
    v-model="showLogoutConfirm"
    title="Confirmar Saída"
    message="Tem certeza que deseja sair do sistema?"
    confirm-text="Sair"
    confirm-color="error"
    @confirm="logout"
  />
</template>

<script>
import { useRouter } from "vue-router"
import { useAuthStore } from "@/stores/auth"
import { useTheme } from "vuetify"
import ConfirmDialog from "./common/ConfirmDialog.vue"

export default {
  name: "AppHeader",
  components: {
    ConfirmDialog
  },
  props: {
    title: {
      type: String,
      default: "Sistema de Gerenciamento de Alunos",
    },
  },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const theme = useTheme()

    return { router, authStore, theme }
  },
  data() {
    return {
      drawer: false,
      showLogoutConfirm: false
    }
  },
  computed: {
    isDarkTheme() {
      return this.theme.global.current.value.dark
    },
    user() {
      return (
        this.authStore.user || {
          name: "Usuário",
          email: "usuario@example.com",
        }
      )
    },
    userInitial() {
      return this.user.name ? this.user.name.charAt(0).toUpperCase() : 'U'
    }
  },
  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer
    },
    toggleTheme() {
      this.theme.global.name.value = this.isDarkTheme ? "light" : "dark"
    },
    confirmLogout() {
      this.showLogoutConfirm = true
    },
    async logout() {
      await this.authStore.logout()
      this.router.push("/login")
    },
  },
}
</script>

<style scoped>
.v-list-item-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
