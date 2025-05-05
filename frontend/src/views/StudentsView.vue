<template>
  <div>
    <app-header title="Gerenciamento de Alunos"></app-header>
    <v-container class="py-6">
      <v-fade-transition>
        <student-table
          :students="students"
          :loading="loading"
          :page="page"
          :items-per-page="itemsPerPage"
          :total-items="totalStudents"
          :headers="tableHeaders"
          @add-student="openStudentDialog()"
          @edit-student="openStudentDialog($event)"
          @delete-student="confirmDelete($event)"
          @update-options="handleTableOptions"
          @search="handleSearch"
        />
      </v-fade-transition>
      
      <student-dialog
        v-model="showStudentDialog"
        :student="selectedStudent"
        @saved="loadStudents"
        @show-toast="handleToast"
      />
      
      <confirm-dialog
        v-model="showDeleteDialog"
        title="Confirmar exclusão"
        message="Tem certeza que deseja excluir este aluno? Esta ação não pode ser desfeita."
        confirm-text="Excluir"
        confirm-color="error"
        type="error"
        :loading="deleteLoading"
        @confirm="deleteStudent"
      />
      
      <v-snackbar
        v-model="showToast"
        :color="toastColor"
        :timeout="8000"
        location="top"
        :multi-line="true"
        class="toast-message"
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
  </div>
</template>

<script>
import { useStudentStore } from "@/stores/student"
import AppHeader from "@/components/AppHeader.vue"
import StudentTable from "@/components/students/StudentTable.vue"
import StudentDialog from "@/components/students/StudentDialog.vue"
import ConfirmDialog from "@/components/common/ConfirmDialog.vue"
import { translateMessage } from "@/services/translationService"

export default {
  name: "StudentsView",
  components: {
    AppHeader,
    StudentTable,
    StudentDialog,
    ConfirmDialog
  },
  setup() {
    const studentStore = useStudentStore()
    return { studentStore }
  },
  data() {
    return {
      search: "",
      loading: false,
      page: 1,
      itemsPerPage: 10,
      totalStudents: 0,
      students: [],
      showStudentDialog: false,
      showDeleteDialog: false,
      selectedStudent: null,
      deleteLoading: false,
      showToast: false,
      toastMessage: "",
      toastColor: "success",
      tableHeaders: [
        { title: "ID", key: "id", sortable: true, align: "start", width: "60px" },
        { title: "Nome", key: "name", sortable: true, align: "start" },
        { title: "Email", key: "email", sortable: true, align: "start", class: "hidden-sm-and-down" },
        { title: "RA", key: "ra", sortable: true, align: "start", width: "100px" },
        { title: "CPF", key: "cpf", sortable: true, align: "start", width: "180px", class: "hidden-xs-only" },
        { title: "Ações", key: "actions", sortable: false, align: "end", width: "100px" },
      ],
      toastTimer: null
    }
  },
  watch: {
    page(newPage, oldPage) {
      this.loadStudents();
    },
    itemsPerPage(newSize, oldSize) {
      this.page = 1;
      this.loadStudents();
    },
  },
  mounted() {
    this.loadStudents();
  },
  methods: {
    handleToast({ message, isError = false }) {
      this.showToastMessage(message, isError);
    },
    
    showToastMessage(message, isError = false) {
      if (this.toastTimer) {
        clearTimeout(this.toastTimer);
        this.toastTimer = null;
      }
      
      this.showToast = false;
      
      this.$nextTick(() => {
        this.toastMessage = translateMessage(message);
        this.toastColor = isError ? "error" : "success";
        this.showToast = true;
        
        this.toastTimer = setTimeout(() => {
          this.showToast = false;
          this.toastTimer = null;
        }, 8000); 
      });
    },
    
    handleTableOptions(options) {
      if (options.page !== undefined && options.page !== this.page) {
        this.page = options.page;
        this.$nextTick(() => {
          this.loadStudents();
        });
      }
      
      if (options.itemsPerPage !== undefined && options.itemsPerPage !== this.itemsPerPage) {
        this.itemsPerPage = options.itemsPerPage;
        this.page = 1;
        this.$nextTick(() => {
          this.loadStudents();
        });
      }
    },
    
    handleSearch(query) {
      this.search = query;
      this.page = 1;
      this.loadStudents();
    },
    
    async loadStudents() {
      this.loading = true;
      
      try {
        const response = await this.studentStore.fetchStudents({
          page: this.page,
          pageSize: this.itemsPerPage,
          name: this.search || undefined,
        });

        this.students = response.data;
        
        if (response.pagination && typeof response.pagination.total === 'number') {
          this.totalStudents = response.pagination.total;
        }
        
      } catch (error) {
        console.error("Erro ao carregar estudantes:", error);
        this.showToastMessage("Error fetching students", true);
      } finally {
        this.loading = false;
      }
    },
    
    openStudentDialog(student = null) {
      this.selectedStudent = student ? { ...student } : null;
      this.showStudentDialog = true;
    },
    
    confirmDelete(student) {
      this.selectedStudent = student;
      this.showDeleteDialog = true;
    },
    
    async deleteStudent() {
      if (!this.selectedStudent) return;

      this.deleteLoading = true;
      try {
        await this.studentStore.deleteStudent(this.selectedStudent.id);
        this.showDeleteDialog = false;
        this.showToastMessage("Student deleted successfully");
        this.loadStudents();
      } catch (error) {
        console.error("Erro ao excluir estudante:", error);
        this.showToastMessage("Error deleting student", true);
      } finally {
        this.deleteLoading = false;
      }
    },
  },
  beforeUnmount() {
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
  }
}
</script>

<style scoped>
.v-container {
  max-width: 1200px;
  margin-top: 50px;
}

.toast-message {
  font-weight: 500;
}

:deep(.v-snackbar__content) {
  padding: 16px;
  font-size: 1rem;
}

:deep(.v-snackbar__actions) {
  align-self: flex-start;
  margin-top: 4px;
}
</style>
