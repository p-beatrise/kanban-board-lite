<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTasksStore, type Task } from '../stores/tasks';
import { STATUS_TYPES } from '../constants/statusTypes.ts';
import KanbanColumn from './KanbanColumn.vue';

const { t } = useI18n();
const store = useTasksStore();

// --------------------------- Computed properties -------------------------------

const columns = computed(() =>
  STATUS_TYPES.map((status) => ({ status, title: t(`status.${status}`) }))
);

// --------------------------- Emits -------------------------------

const emit = defineEmits<{
  edit: [task: Task]
}>();
</script>

<template>
  <div class="board">
    <KanbanColumn
      v-for="column in columns"
      :key="column.status"
      :status="column.status"
      :title="column.title"
      :tasks="store.tasksByColumn(column.status)"
      @edit="emit('edit', $event)"
    />
  </div>
</template>
