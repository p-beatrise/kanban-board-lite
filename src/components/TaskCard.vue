<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Task } from '../stores/tasks';
import { formatDateTime } from '../utils/formatUtils';
import ConfirmModal from './ConfirmModal.vue';

const { t } = useI18n();

const props = defineProps<{
  task: Task
}>();

// --------------------------- Reactive state -------------------------------

const isConfirmOpen = ref(false);

// --------------------------- Functions -------------------------------

/**
 * Closes the confirmation dialog and emits delete
 */
function confirmDelete(): void {
  isConfirmOpen.value = false;
  emit('delete', props.task.id);
}

// --------------------------- Emits -------------------------------

const emit = defineEmits<{
  edit: [task: Task]
  delete: [id: string]
  dragstart: [event: DragEvent, task: Task]
}>();
</script>

<template>
  <article
    class="task-card"
    draggable="true"
    tabindex="0"
    role="button"
    @dragstart="emit('dragstart', $event, task)"
    @click="emit('edit', task)"
    @keydown.enter.self="emit('edit', task)"
    @keydown.space.self.prevent="emit('edit', task)"
  >
    <!-- Task title -->
    <header class="task-card-header">
      <h3 class="task-card-title">{{ task.title }}</h3>
      <button
        class="task-card-delete"
        type="button"
        :title="t('taskCard.deleteTitle')"
        @click.stop="isConfirmOpen = true"
      >
      <!-- Trachcan icon -->
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M3 6h18" />
          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
        </svg>
      </button>
    </header>
    <!-- Task description -->
    <p v-if="task.description" class="task-card-description">{{ task.description }}</p>
    <footer class="task-card-footer">
      <span>{{ t('taskCard.updated') }}: {{ formatDateTime(task.updatedAt) }}</span>
    </footer>
  </article>

  <ConfirmModal
    :open="isConfirmOpen"
    :title="t('taskCard.deleteTitle')"
    :message="t('taskCard.confirmDeleteMessage', { title: task.title })"
    @confirm="confirmDelete"
    @cancel="isConfirmOpen = false"
  />
</template>
