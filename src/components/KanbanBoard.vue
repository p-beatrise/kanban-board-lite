<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTasksStore, type Task } from '../stores/tasks';
import { useNotifyStore } from '../stores/notifications';
import { STATUS, STATUS_TYPES } from '../constants/statusTypes.ts';
import { NOTIFICATION } from '../constants/notificationTypes';
import { deepCopy } from '../utils/copyUtils';
import KanbanColumn from './KanbanColumn.vue';
import TaskModal from './TaskModal.vue';

const { t } = useI18n();
const store = useTasksStore();
const notifyStore = useNotifyStore();

// --------------------------- Computed properties -------------------------------

const columns = computed(() =>
  STATUS_TYPES.map((status) => ({ status, title: t(`status.${status}`) }))
);

// --------------------------- Reactive state -------------------------------

const isModalOpen = ref(false);
const editingTask = ref<Task>(createDraftTask());

// --------------------------- Functions -------------------------------

function createDraftTask(): Task {
  return {
    id: '',
    title: '',
    description: '',
    status: STATUS.TODO,
    createdAt: '',
    updatedAt: '',
  };
}

function openModal(id?: string): void {
  if (id) {
    const task = store.tasks.find((t) => t.id === id);
    if (!task) {
      notifyStore.notify(t('error.taskNotFound'), NOTIFICATION.ERROR);
      console.error(`Task not found: ${id}`);
      return;
    }
    editingTask.value = deepCopy(task);
  } else {
    editingTask.value = createDraftTask();
  }
  isModalOpen.value = true;
}

function closeModal(): void {
  isModalOpen.value = false;
}

function handleSave(): void {
  const task = editingTask.value;
  if (task.id) {
    store.updateTaskFromModal(task.id, task);
  } else {
    store.addTask(task);
  }
  closeModal();
}
</script>

<template>
  <div class="board-wrapper">
    <button class="btn btn-primary add-task-btn" type="button" @click="openModal()">
      {{ t('common.add') }}
      <!-- Plus icon -->
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
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v8" />
        <path d="M8 12h8" />
      </svg>
    </button>
    <div class="board">
      <KanbanColumn
        v-for="column in columns"
        :key="column.status"
        :status="column.status"
        :title="column.title"
        :tasks="store.tasksByColumn(column.status)"
        @edit="openModal"
      />
    </div>
    <TaskModal v-model:task="editingTask" :open="isModalOpen" @save="handleSave" @close="closeModal" />
  </div>
</template>
