<template>
  <div class="d-flex gap-2">
    <v-tooltip text="Editar aluno">
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          icon
          variant="text"
          color="primary"
          size="small"
          @click="$emit('edit')"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>
    </v-tooltip>
    
    <v-tooltip text="Excluir aluno">
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          icon
          variant="text"
          color="error"
          size="small"
          @click="$emit('delete')"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-tooltip>
  </div>
</template>

<script>
export default {
  name: "StudentActions",
  props: {
    student: {
      type: Object,
      required: true
    }
  },
  emits: ['edit', 'delete']
}
</script>
