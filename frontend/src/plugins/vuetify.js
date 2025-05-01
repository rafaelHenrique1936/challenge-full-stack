import { createVuetify } from "vuetify"
import * as components from "vuetify/components"
import * as directives from "vuetify/directives"
import { aliases, mdi } from "vuetify/iconsets/mdi"
import "vuetify/styles"
import "@mdi/font/css/materialdesignicons.css"

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        colors: {
          primary: "#1565C0",
          secondary: "#546E7A",
          accent: "#29B6F6",
          error: "#E53935",
          info: "#2196F3",
          success: "#43A047",
          warning: "#FB8C00",
          background: "#F5F7FA",
          surface: "#FFFFFF",
        },
      },
      dark: {
        colors: {
          primary: "#42A5F5",
          secondary: "#78909C",
          accent: "#4FC3F7",
          error: "#EF5350",
          info: "#64B5F6",
          success: "#66BB6A",
          warning: "#FFA726",
          background: "#121212",
          surface: "#1E1E1E",
        },
      },
    },
    variations: {
      colors: ["primary", "secondary", "accent"],
      lighten: 5,
      darken: 5,
    },
  },
  defaults: {
    VCard: {
      rounded: "lg",
      elevation: 2,
    },
    VBtn: {
      rounded: "lg",
      fontWeight: "500",
    },
    VTextField: {
      variant: "outlined",
      density: "comfortable",
      color: "primary",
    },
    VAlert: {
      rounded: "lg",
    },
    VDataTable: {
      hover: true,
    },
  },
})
