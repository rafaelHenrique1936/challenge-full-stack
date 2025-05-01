import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import pinia from "./stores"
import vuetify from "./plugins/vuetify"
import { useAuthStore } from "./stores/auth"
import "./assets/main.css"

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(vuetify)

const authStore = useAuthStore()
authStore.init()

app.mount("#app")
