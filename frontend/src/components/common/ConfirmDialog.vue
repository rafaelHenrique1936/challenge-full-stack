<template>
  <v-dialog v-model="dialogVisible" max-width="400" persistent>
    <v-card class="confirm-dialog">
      <v-card-title :class="titleClass">
        {{ title }}
      </v-card-title>
      <v-card-text class="pt-4">
        {{ message }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn 
          variant="text" 
          :color="cancelColor"
          @click="cancel"
          :disabled="loading"
        >
          {{ cancelText }}
        </v-btn>
        <v-btn 
          variant="elevated" 
          :color="confirmColor" 
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
    cancelColor: {
      type: String,
      default: "grey-darken-1"
    },
    loading: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: "default",
      validator: (value) => ["default", "error", "warning", "success"].includes(value)
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
    titleClass() {
      const baseClass = "pb-2";
      switch (this.type) {
        case "error":
          return `${baseClass} text-error`;
        case "warning":
          return `${baseClass} text-warning`;
        case "success":
          return `${baseClass} text-success`;
        default:
          return baseClass;
      }
    }
  },
  methods: {
    confirm() {
      this.$emit("confirm")
    },
    cancel() {
      this.$emit("cancel")
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>
.confirm-dialog {
  border-radius: 8px;
  overflow: hidden;
}
</style>
