import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';
import { useI18n } from 'vue-i18n';
import { STATUS, type Status } from '../constants/statusTypes';
import { NOTIFICATION } from '../constants/notificationTypes';
import { useNotifyStore } from './notifications';

const STORAGE_KEY = 'kanban-tasks';

// ------------------ Interfaces ----------------------

export interface Task {
  id: string
  title: string
  description: string
  status: Status
  createdAt: string
  updatedAt: string
}

export interface TaskInput {
  title: string
  description: string
  status: Status
}

// ------------------ Functions ----------------------

/**
 * Loads tasks from localStorage
 */
function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Task[]) : [];
  } catch {
    // In case of an error return an empty array
    return [];
  }
}

/**
 * Returns a randomly generated task id
 */
function createId(): string {
  return crypto.randomUUID();
}

export const useTasksStore = defineStore('tasks', () => {
  const notifyStore = useNotifyStore();
  const { t } = useI18n();

  // ---------------------- Reactive state -------------------------

  const tasks = ref<Task[]>(loadTasks());
  const filterObj = ref<{ text: string; status: Status | '' }>({ text: '', status: '' });

  // ---------------------- Computed properties ---------------------

  // Returns tasks that match the filter values
  const filteredTasks = computed(() => {
    const text = filterObj.value.text.trim().toLowerCase();   // Text search is case insensitive
    const status = filterObj.value.status;

    return tasks.value.filter((task) => {
      const matchesText =
        !text ||
        task.title.toLowerCase().includes(text) ||
        task.description.toLowerCase().includes(text);
      const matchesStatus = !status || task.status === status;
      return matchesText && matchesStatus;
    });
  });

  // ----------------------- Functions --------------------------------

  /**
   * Returns tasks for a specific status column
   */
  function tasksByColumn(status: Status): Task[] {
    return filteredTasks.value.filter((task) => task.status === status);
  }

  /**
   * Creates a new task from input and adds it to existing task array
   */
  function addTask(input: TaskInput): void {
    const now = new Date().toISOString();
    tasks.value.push({
      id: createId(),
      title: input.title,
      description: input.description,
      status: input.status || STATUS.TODO,
      createdAt: now,
      updatedAt: now,
    });
    notifyStore.notify(t('notify.taskCreated'), NOTIFICATION.SUCCESS);
  }

  /**
   * Updates task with data from modal
   * Task update time is set manually as it is not user input
   */
  function updateTaskFromModal(id: string, input: TaskInput): void {
    const task = tasks.value.find((t) => t.id === id);
    if (!task) {
      return;
    }
    Object.assign(task, input, { updatedAt: new Date().toISOString() });
    notifyStore.notify(t('notify.taskUpdated'), NOTIFICATION.SUCCESS);
  }

  /**
   * Updates the task after it is moved to a new column
   * Task update variable is set manually as it is not user input
   * Status changed to reflect the new column status
   */
  function updateTaskFromMove(id: string, status: Status): void {
    const task = tasks.value.find((t) => t.id === id);
    if (!task || task.status === status) {
      // If status matches then the task has not been moved to new column
      // Do not perform new status and update time assignment
      return;
    }
    task.status = status;
    task.updatedAt = new Date().toISOString();
  }

  /**
   * Updates the task after it is moved to a new column
   * Task update time is set manually as it is not user input
   * Status changed to reflect the new column status
   */
  function deleteTask(id: string): void {
    const index = tasks.value.findIndex((t) => t.id === id);
    if (index !== -1) {
      tasks.value.splice(index, 1);
    }
    notifyStore.notify(t('notify.taskDeleted'), NOTIFICATION.SUCCESS);
  }

  /**
   * Clears filters to default values
   */
  function resetFilters(): void {
    filterObj.value = { text: '', status: '' };
  }

  // -------------------------- Watchers ------------------------------

  // Updates tasks in localStorage
  watch(
    tasks,
    (value) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      } catch (error) {
        // Notify in case if localStorage update fails
        notifyStore.notify(t('error.update'), NOTIFICATION.ERROR);
        console.error('Error message:', error);
      }
    },
    { deep: true }
  );

  return {
    tasks,
    filterObj,
    filteredTasks,
    tasksByColumn,
    addTask,
    updateTaskFromModal,
    updateTaskFromMove,
    deleteTask,
    resetFilters,
  };
});
