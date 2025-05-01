import { createRouter, createWebHistory } from "vue-router"
import { useAuthStore } from "@/stores/auth"

import LoginView from "@/views/LoginView.vue"
import StudentsView from "@/views/StudentsView.vue"

const routes = [
  {
    path: "/",
    redirect: "/alunos",
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
    meta: { requiresAuth: false },
  },
  {
    path: "/alunos",
    name: "students",
    component: StudentsView,
    meta: { requiresAuth: true },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/alunos",
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (requiresAuth && !authStore.isAuthenticated) {
    next("/login")
  } else if (to.path === "/login" && authStore.isAuthenticated) {
    next("/alunos")
  } else {
    next()
  }
})

export default router
