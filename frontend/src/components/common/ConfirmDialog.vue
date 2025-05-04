<template>
  <v-dialog v-model="dialogVisible" max-width="400px" persistent>
    <v-card class="confirm-dialog" :class="typeClass">
      <v-card-title class="d-flex align-center pa-4">
        <v-icon :icon="icon" size="large" class="mr-2" :color="iconColor"></v-icon>
        <span class="text-h5">{{ title }}</span>
      </v-card-title>
      
      <v-card-text class="pa-4 pt-2">
        <p class="text-body-1">{{ message }}</p>
      </v-card-text>
      
      <v-divider></v-divider>
      
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn
          variant="text"
          @click="closeDialog"
          :disabled="loading"
        >
          {{ cancelText }}
        </v-btn>
        <v-btn
          :color="confirmColor"
          variant="elevated"
          :loading="loading"
          @click="confirm"
        >
          {{ confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "ConfirmDialog",
  props: {
    modelValue: Boolean,
    title: {
      type: String,
      default: "Confirmar"
    },
    message: {
      type: String,
      default: "Tem certeza que deseja continuar?"
    },
    confirmText: {
      type: String,
      default: "Confirmar"
    },
    cancelText: {
      type: String,
      default: "Cancelar"
    },
    confirmColor: {
      type: String,
      default: "primary"
    },
    type: {
      type: String,
      default: "info",
      validator: (value) => ["info", "warning", "error", "success"].includes(value)
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update:modelValue", "confirm", "cancel"],
  computed: {
    dialogVisible: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit("update:modelValue", value)
      }
    },
    icon() {
      const icons = {
        info: "mdi-information",
        warning: "mdi-alert",
        error: "mdi-alert-circle",
        success: "mdi-check-circle"
      }
      return icons[this.type] || icons.info
    },
    iconColor() {
      const colors = {
        info: "info",
        warning: "warning",
        error: "error",
        success: "success"
      }
      return colors[this.type] || colors.info
    },
    typeClass() {
      return `confirm-dialog-${this.type}`
    }
  },
  methods: {
    confirm() {
      this.$emit("confirm")
    },
    closeDialog() {
      this.dialogVisible = false
      this.$emit("cancel")
    }
  }
}
</script>

<style scoped>
.confirm-dialog {
  border-radius: 8px;
  overflow: hidden;
}

.confirm-dialog-error .v-card-title {
  background-color: rgba(var(--v-theme-error), 0.1);
}

.confirm-dialog-warning .v-card-title {
  background-color: rgba(var(--v-theme-warning), 0.1);
}

.confirm-dialog-info .v-card-title {
  background-color: rgba(var(--v-theme-info), 0.1);
}

.confirm-dialog-success .v-card-title {
  background-color: rgba(var(--v-theme-success), 0.1);
}
</style>