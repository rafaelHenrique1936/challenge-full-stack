<template>
    <v-dialog v-model="dialog" max-width="600px" persistent>
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ isEditing ? 'Editar Estudante' : 'Novo Estudante' }}</span>
        </v-card-title>
        
        <v-card-text>
          <v-form ref="form" v-model="formValid">
            <v-text-field
              v-model="studentData.name"
              :rules="nameRules"
              label="Nome"
              required
            ></v-text-field>
            
            <v-text-field
              v-model="studentData.email"
              :rules="emailRules"
              label="Email"
              required
            ></v-text-field>
            
            <v-text-field
              v-model="studentData.ra"
              :rules="raRules"
              label="RA"
              required
              :error-messages="raError"
              :hint="raHint"
              persistent-hint
              @input="checkRAAvailability"
              :loading="checkingRA"
            ></v-text-field>
            
            <v-text-field
              v-model="studentData.cpf"
              :rules="cpfRules"
              label="CPF"
              required
              @input="formatCPF"
              maxlength="11"
            ></v-text-field>
          </v-form>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="closeDialog"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            variant="text"
            :loading="saving"
            :disabled="!formValid || (raAvailable === false && !isEditing)"
            @click="saveStudent"
          >
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  import { useStudentStore } from "@/stores/student"
  import { debounce } from "lodash"
  
  export default {
    name: "StudentDialog",
    props: {
      modelValue: Boolean,
      student: Object,
    },
    emits: ["update:modelValue", "saved"],
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
        studentData: {
          name: "",
          email: "",
          ra: "",
          cpf: "",
        },
        nameRules: [
          (v) => !!v || "Nome é obrigatório",
          (v) => v.length <= 255 || "Nome deve ter no máximo 255 caracteres",
        ],
        emailRules: [
          (v) => !!v || "Email é obrigatório",
          (v) => /.+@.+\..+/.test(v) || "Email deve ser válido",
          (v) => v.length <= 255 || "Email deve ter no máximo 255 caracteres",
        ],
        cpfRules: [
          (v) => !!v || "CPF é obrigatório",
          (v) => v.length === 11 || "CPF deve ter 11 dígitos",
          (v) => /^\d+$/.test(v) || "CPF deve conter apenas números",
        ],
        raRules: [(v) => !!v || "RA é obrigatório", (v) => v.length <= 20 || "RA deve ter no máximo 20 caracteres"],
      }
    },
    computed: {
      dialog: {
        get() {
          return this.modelValue
        },
        set(value) {
          this.$emit("update:modelValue", value)
        },
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
  
          if (response.data.available) {
            this.raHint = "RA disponível para uso"
            this.raError = ""
          } else {
            this.raError = "Este RA já está em uso por outro estudante"
            this.raHint = ""
          }
        } catch (error) {
          console.error("Erro ao verificar disponibilidade do RA:", error)
          this.raError = "Erro ao verificar disponibilidade do RA"
        } finally {
          this.checkingRA = false
        }
      },
      formatCPF() {
        if (this.studentData.cpf) {
          this.studentData.cpf = this.studentData.cpf.replace(/\D/g, "").substring(0, 11)
        }
      },
      async saveStudent() {
        if (!this.$refs.form.validate()) return
  
        this.saving = true
        try {
          if (this.isEditing) {
            await this.studentStore.updateStudent(this.student.id, this.studentData)
          } else {
            await this.studentStore.createStudent(this.studentData)
          }
  
          this.closeDialog()
          this.$emit("saved")
        } catch (error) {
          console.error("Erro ao salvar estudante:", error)
        } finally {
          this.saving = false
        }
      },
      closeDialog() {
        this.dialog = false
        this.$nextTick(() => {
          this.resetForm()
        })
      },
      resetForm() {
        this.studentData = {
          name: "",
          email: "",
          ra: "",
          cpf: "",
        }
  
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
