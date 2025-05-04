<template>
  <v-dialog v-model="dialogVisible" max-width="600px" persistent>
    <v-card class="student-dialog">
      <v-card-title class="d-flex align-center pa-4 bg-primary text-white">
        <span class="text-h5">{{ isEditing ? 'Editar Aluno' : 'Novo Aluno' }}</span>
        <v-spacer></v-spacer>
        <v-btn icon variant="text" color="white" @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      
      <v-card-text class="pa-4 pt-6">
        <v-form ref="form" v-model="formValid" @submit.prevent="saveStudent">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="studentData.name"
                :rules="validationRules.name"
                label="Nome completo"
                variant="outlined"
                prepend-inner-icon="mdi-account"
                required
                autofocus
              ></v-text-field>
            </v-col>
            
            <v-col cols="12" md="6">
              <v-text-field
                v-model="studentData.email"
                :rules="validationRules.email"
                label="Email"
                variant="outlined"
                prepend-inner-icon="mdi-email"
                required
              ></v-text-field>
            </v-col>
            
            <v-col cols="12" md="6">
              <v-text-field
                v-model="studentData.cpf"
                :rules="validationRules.cpf"
                label="CPF"
                variant="outlined"
                prepend-inner-icon="mdi-card-account-details"
                required
                @input="formatCPF"
                maxlength="14"
                hint="Digite apenas números"
                persistent-hint
              ></v-text-field>
            </v-col>
            
            <v-col cols="12">
              <v-text-field
                v-model="studentData.ra"
                :rules="validationRules.ra"
                label="RA (Registro Acadêmico)"
                variant="outlined"
                prepend-inner-icon="mdi-identifier"
                required
                :error-messages="raError"
                :hint="raHint"
                persistent-hint
                @input="checkRAAvailability"
                :loading="checkingRA"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      
      <v-divider></v-divider>
      
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn
          color="grey-darken-1"
          variant="text"
          @click="closeDialog"
          :disabled="saving"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          :loading="saving"
          :disabled="!formValid || (raAvailable === false && !isEditing)"
          @click="saveStudent"
        >
          {{ isEditing ? 'Atualizar' : 'Salvar' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { useStudentStore } from "@/stores/student"
import { debounce } from "lodash"
import { translateMessage, translateRAAvailabilityMessage, translateCPFErrorMessage } from "@/services/translationService"

export default {
  name: "StudentDialog",
  props: {
    modelValue: Boolean,
    student: Object,
  },
  emits: ["update:modelValue", "saved", "show-toast"],
  setup() {
    const studentStore = useStudentStore()
    return { studentStore }
  },
  data() {
    return {
      formValid: false,
      saving: false,
      checkingRA: false,
      raAvailable: null,
      raError: "",
      raHint: "",
      studentData: this.initStudentData(),
      validationRules: {
        name: [
          (v) => !!v || "Nome é obrigatório",
          (v) => v.length <= 255 || "Nome deve ter no máximo 255 caracteres",
        ],
        email: [
          (v) => !!v || "Email é obrigatório",
          (v) => /.+@.+\..+/.test(v) || "Email deve ser válido",
          (v) => v.length <= 255 || "Email deve ter no máximo 255 caracteres",
        ],
        cpf: [
          (v) => !!v || "CPF é obrigatório",
          (v) => this.validateCPF(v) || "CPF inválido",
        ],
        ra: [
          (v) => !!v || "RA é obrigatório", 
          (v) => v.length <= 20 || "RA deve ter no máximo 20 caracteres"
        ],
      }
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit("update:modelValue", value)
      }
    },
    isEditing() {
      return !!this.student
    },
  },
  watch: {
    student: {
      handler(newStudent) {
        if (newStudent) {
          this.studentData = { ...newStudent }
          if (this.studentData.cpf && this.studentData.cpf.length === 11) {
            this.formatCPF();
          }
        } else {
          this.resetForm()
        }
      },
      immediate: true,
    },
  },
  created() {
    this.checkRAAvailability = debounce(this.checkRAAvailabilityImpl, 500)
  },
  methods: {
    emitToast(message, isError = false) {
      // Verificar se a mensagem contém "CPF" e "already registered"
      if (message && message.includes("CPF") && message.includes("already registered")) {
        // Usar a função específica para traduzir mensagens de erro de CPF
        message = translateCPFErrorMessage(message);
      } else {
        // Usar a função padrão de tradução
        message = translateMessage(message);
      }
      
      // Emitir evento para o componente pai mostrar o toast
      this.$emit("show-toast", { message, isError });
    },
    
    initStudentData() {
      return {
        name: "",
        email: "",
        ra: "",
        cpf: "",
      }
    },
    async checkRAAvailabilityImpl() {
      if (!this.studentData.ra || (this.isEditing && this.student.ra === this.studentData.ra)) {
        this.raAvailable = null
        this.raError = ""
        this.raHint = ""
        return
      }

      this.checkingRA = true
      try {
        const response = await this.studentStore.checkRAAvailability(this.studentData.ra)
        
        this.raAvailable = response.data.available

        if (this.raAvailable) {
          this.raHint = translateRAAvailabilityMessage(response.data) || translateMessage("RA available for use");
          this.raError = ""
        } else {
          this.raError = translateRAAvailabilityMessage(response.data) || translateMessage("This RA is already in use by another student");
          this.raHint = ""
        }
      } catch (error) {
        console.error("Erro ao verificar disponibilidade do RA:", error)
        this.raError = translateMessage("Error checking RA availability");
        this.emitToast("Error checking RA availability", true);
      } finally {
        this.checkingRA = false
      }
    },
    formatCPF() {
      if (this.studentData.cpf) {
        const cpfNumbers = this.studentData.cpf.replace(/\D/g, "").substring(0, 11)
        
        if (cpfNumbers.length <= 3) {
          this.studentData.cpf = cpfNumbers
        } else if (cpfNumbers.length <= 6) {
          this.studentData.cpf = `${cpfNumbers.substring(0, 3)}.${cpfNumbers.substring(3)}`
        } else if (cpfNumbers.length <= 9) {
          this.studentData.cpf = `${cpfNumbers.substring(0, 3)}.${cpfNumbers.substring(3, 6)}.${cpfNumbers.substring(6)}`
        } else {
          this.studentData.cpf = `${cpfNumbers.substring(0, 3)}.${cpfNumbers.substring(3, 6)}.${cpfNumbers.substring(6, 9)}-${cpfNumbers.substring(9)}`
        }
      }
    },
    validateCPF(cpf) {
      const cleanCPF = cpf.replace(/\D/g, "")
      
      if (cleanCPF.length !== 11) return false
      
      if (/^(\d)\1+$/.test(cleanCPF)) return false
      
      return true
    },
    async saveStudent() {
      if (!this.$refs.form.validate()) return

      this.saving = true
      try {
        if (this.isEditing) {
          await this.studentStore.updateStudent(this.student.id, this.studentData)
          this.emitToast("Student updated successfully");
        } else {
          await this.studentStore.createStudent(this.studentData)
          this.emitToast("Student created successfully");
        }

        this.closeDialog()
        this.$emit("saved")
      } catch (error) {
        console.error("Erro ao salvar estudante:", error)
        
        if (error.response && error.response.data && error.response.data.message) {
          // Registrar a mensagem de erro exata para depuração
          console.log("Mensagem de erro exata:", error.response.data.message);
          this.emitToast(error.response.data.message, true);
        } else {
          this.emitToast("Error saving student", true);
        }
      } finally {
        this.saving = false
      }
    },
    closeDialog() {
      this.dialogVisible = false
      this.$nextTick(() => {
        this.resetForm()
      })
    },
    resetForm() {
      this.studentData = this.initStudentData()
      this.raAvailable = null
      this.raError = ""
      this.raHint = ""

      if (this.$refs.form) {
        this.$refs.form.resetValidation()
      }
    },
  },
}
</script>

<style scoped>
.student-dialog {
  border-radius: 8px;
  overflow: hidden;
}
</style>
