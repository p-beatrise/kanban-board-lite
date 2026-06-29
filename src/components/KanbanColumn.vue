<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import TaskCard from './TaskCard.vue';
import { useTasksStore, type Task } from '../stores/tasks';
import type { Status } from '../constants/statusTypes.ts';

const { t } = useI18n();
const store = useTasksStore();

const props = defineProps<{
  status: Status
  title: string
  tasks: Task[]
}>();

// --------------------------- Reactive state -------------------------------

const isDragOver = ref(false);

// --------------------------- Functions -------------------------------

/**
 * Stores dragged task id of drag event
 */
function onDragStart(event: DragEvent, task: Task): void {
  event.dataTransfer?.setData('text/plain', task.id);
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
  }
  // Set the draggable image
  // Otherwise sometimes the task that is being dragged displays as very little
  const card = event.currentTarget as HTMLElement;
  event.dataTransfer?.setDragImage(card, event.offsetX, event.offsetY);
}

/**
 * Allows to drop task in the column it is hovered over
 * Highlights hovered column
 */
function onDragOver(event: DragEvent): void {
  event.preventDefault();
  isDragOver.value = true;
}

/**
 * Calls task data update with store
 * Stops column highlight
 */
function onDrop(event: DragEvent): void {
  event.preventDefault();
  isDragOver.value = false;
  const taskId = event.dataTransfer?.getData('text/plain');
  if (taskId) {
    store.updateTaskFromMove(taskId, props.status);
  }
}

/**
 * Calls for task delete using store
 */
function handleDelete(taskId: string): void {
  store.deleteTask(taskId);
}

// --------------------------- Emits -------------------------------

const emit = defineEmits<{
  edit: [task: Task]
}>();

</script>

<template>
  <section
    class="column"
    :class="{ 'column-hover ': isDragOver }"
    @dragover="onDragOver"
    @dragleave="isDragOver = false"
    @drop="onDrop"
  >
    <header class="column-header">
      <h2 :class="`column-title-${status}`">{{ title }}</h2>
      <span class="column-count">{{ tasks.length }}</span>
    </header>
    <div class="column-list">
      <TaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @edit="emit('edit', $event)"
        @delete="handleDelete"
        @dragstart="onDragStart"
      />
      <p v-if="tasks.length === 0" class="column-empty">{{ t('kanbanColumn.noTasks') }}</p>
    </div>
  </section>
</template>
