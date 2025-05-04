<template>
  <div class="d-flex justify-end">
    <v-tooltip location="top" text="Editar">
      <template v-slot:activator="{ props }">
        <v-btn
          icon
          variant="text"
          color="primary"
          size="small"
          v-bind="props"
          @click="$emit('edit')"
          class="mr-1"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>
    </v-tooltip>
    
    <v-tooltip location="top" text="Excluir">
      <template v-slot:activator="{ props }">
        <v-btn
          icon
          variant="text"
          color="error"
          size="small"
          v-bind="props"
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