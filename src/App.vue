<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTasksStore, type Task } from './stores/tasks';
import { useNotifyStore } from './stores/notifications';
import { STATUS } from './constants/statusTypes.ts';
import { NOTIFICATION } from './constants/notificationTypes';
import { deepCopy } from './utils/copyUtils';
import Notification from './components/Notification.vue';
import FilterBar from './components/FilterBar.vue';
import KanbanBoard from './components/KanbanBoard.vue';
import TaskModal from './components/TaskModal.vue';

const { t } = useI18n();
const store = useTasksStore();
const notifyStore = useNotifyStore();

// ------------------ Reactive state ----------------------

const isModalOpen = ref(false);
const editingTask = ref<Task>(createDraftTask());

// ------------------ Functions ----------------------

/**
 * Builds an empty task to display when opening task adition modal
 */
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

/**
 * Opens task modal and creates empty task or a deep copy of an existing task for editing
 */
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

/**
 * Handles save by passing a new or existing task to store for saving
 */ 
function handleSave(): void {
  const task = editingTask.value;
  if (task.id) {
    // Case for existing task
    store.updateTaskFromModal(task.id, task);
  } else {
    // Case for new task
    store.addTask(task);
  }
  closeModal();
}
</script>

<template>
  <div class="app">
    <header class="app-header">
      <h1>{{ t('app.title') }}</h1>
    </header>
    <FilterBar />
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
    <KanbanBoard @edit="openModal" />
    <TaskModal v-model:task="editingTask" :open="isModalOpen" @save="handleSave" @close="closeModal" />
    <Notification />
  </div>
</template>
