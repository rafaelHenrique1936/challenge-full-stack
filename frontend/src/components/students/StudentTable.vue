<template>
  <v-card class="student-table-card elevation-2 rounded-lg">
    <v-card-title class="d-flex align-center pa-4">
      <h2 class="text-h5 font-weight-bold">{{ title }}</h2>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="searchQuery"
        prepend-inner-icon="mdi-magnify"
        label="Pesquisar"
        single-line
        hide-details
        density="compact"
        variant="outlined"
        class="search-field mr-2"
        @update:model-value="onSearch"
      ></v-text-field>
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        variant="elevated"
        @click="$emit('add-student')"
        class="add-button"
      >
        Novo Aluno
      </v-btn>
    </v-card-title>

    <v-divider></v-divider>

    <v-card-text class="pa-0">
      <v-data-table
        :headers="headers"
        :items="students"
        :loading="loading"
        :items-per-page="itemsPerPage"
        :page="page"
        :items-per-page-options="[5, 10, 15, 20]"
        :server-items-length="totalItems"
        class="student-data-table"
        hover
        density="compact"
        @update:options="handleUpdateOptions"
      >
        <template v-slot:item.cpf="{ item }">
          {{ formatCPF(item.cpf) }}
        </template>

        <template v-slot:item.email="{ item }">
          <span class="hidden-sm-and-down">{{ item.email }}</span>
        </template>

        <template v-slot:item.actions="{ item }">
          <student-actions 
            :student="item" 
            @edit="$emit('edit-student', item)"
            @delete="$emit('delete-student', item)"
          />
        </template>

        <template v-slot:bottom>
          <div class="d-flex align-center justify-space-between pa-4">
            <div class="text-caption text-grey">
              Total: {{ totalItems }} alunos
            </div>
            <v-pagination
              v-model="localPage"
              :length="Math.ceil(totalItems / itemsPerPage)"
              :total-visible="5"
              @update:model-value="updatePage"
              :disabled="loading"
            ></v-pagination>
          </div>
        </template>

        <template v-slot:loading>
          <v-skeleton-loader
            v-for="n in itemsPerPage"
            :key="n"
            type="table-row"
          ></v-skeleton-loader>
        </template>

        <template v-slot:no-data>
          <div class="d-flex flex-column align-center pa-6">
            <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-account-school-outline</v-icon>
            <span class="text-body-1 text-grey">Nenhum aluno encontrado</span>
            <v-btn
              color="primary"
              variant="text"
              class="mt-4"
              @click="$emit('add-student')"
            >
              Adicionar Aluno
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import StudentActions from './StudentActions.vue'

export default {
  name: "StudentTable",
  components: {
    StudentActions
  },
  props: {
    title: {
      type: String,
      default: "Alunos"
    },
    students: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    page: {
      type: Number,
      default: 1
    },
    itemsPerPage: {
      type: Number,
      default: 10
    },
    totalItems: {
      type: Number,
      default: 0
    },
    headers: {
      type: Array,
      required: true
    }
  },
  emits: ['add-student', 'edit-student', 'delete-student', 'update-options', 'search'],
  data() {
    return {
      searchQuery: '',
      searchTimeout: null,
      localPage: this.page
    }
  },
  methods: {
    formatCPF(cpf) {
      if (!cpf || cpf.length !== 11) return cpf;
      return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    },
    onSearch() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.$emit('search', this.searchQuery);
      }, 300);
    },
    handleUpdateOptions(options) {
      console.log('DataTable options updated:', options);
      
      // Atualiza quando mudar o itemsPerPage
      if (options.itemsPerPage !== this.itemsPerPage) {
        this.$emit('update-options', {
          page: 1,
          itemsPerPage: options.itemsPerPage
        });
      }
    },
    updatePage(newPage) {
      console.log('Pagination clicked, new page:', newPage);
      if (newPage !== this.page) {
        this.$emit('update-options', {
          page: newPage,
          itemsPerPage: this.itemsPerPage
        });
      }
    },
  },
  watch: {
    page: {
      immediate: true,
      handler(newPage) {
        console.log('Page prop changed to:', newPage);
        this.localPage = newPage;
      }
    }
  },
  mounted() {
    console.log('StudentTable mounted, page:', this.page, 'localPage:', this.localPage);
  }
}
</script>

<style scoped>
.student-table-card {
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}

.student-table-card:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.search-field {
  max-width: 300px;
  transition: max-width 0.3s ease;
}

@media (max-width: 600px) {
  .search-field {
    max-width: 150px;
  }
  
  .add-button {
    min-width: unset;
  }
  
  :deep(.v-data-table) {
    font-size: 0.8rem;
  }
  
  :deep(.v-data-table-header__content) {
    white-space: normal;
    font-size: 0.8rem;
  }
}

.student-data-table {
  border-radius: 0 0 8px 8px;
}
</style>
