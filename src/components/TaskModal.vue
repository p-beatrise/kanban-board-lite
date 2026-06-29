<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Task } from '../stores/tasks';
import { STATUS_TYPES } from '../constants/statusTypes';
import { formatDateTime } from '../utils/formatUtils';

const { t } = useI18n();

const task = defineModel<Task>('task', { required: true });

const props = defineProps<{
  open: boolean
}>();

const TITLE_MAX_LENGTH = 200;
const DESCRIPTION_MAX_LENGTH = 5000;

// --------------------------- Reactive state -------------------------------

const validationErrors = ref({
  title: '',
  description: '',
});

const titleInput = ref<HTMLInputElement | null>(null);

// --------------------------- Functions -------------------------------

/**
 * Resets all validation error messages
 */
function resetValidationErrors(): void {
  validationErrors.value = { title: '', description: '' };
}

/**
 * Checks required fields
 * If all checks pass then data is valid for save
 */
function validate(): boolean {
  let isValid = true;
  resetValidationErrors();

  if (!task.value.title) {
    isValid = false;
    validationErrors.value.title = t('taskModal.mandatory');
  }

  if (!task.value.description) {
    isValid = false;
    validationErrors.value.description = t('taskModal.mandatory');
  }
  return isValid;
}

/**
 * Emits data save after validation has passed
 */
function handleSubmit(): void {
  // Trim any unnecesary whitespaces
  task.value.title = task.value.title.trim();
  task.value.description = task.value.description.trim();
  if (!validate()) return;
  emit('save');
}

/**
 * Resets validation errors and emits close
 */
function handleClose(): void {
  resetValidationErrors();   // Reset so when new modal is opened it does not have validation errors
  emit('close');
}

/**
 * Opens the dropdown list with Enter
 */
function openDropdown(event: KeyboardEvent): void {
  (event.target as HTMLSelectElement).showPicker?.();
}

// --------------------------- Watchers -------------------------------

// Focuses the title field when the modal opens
watch(
  () => props.open,
  async (isOpen) => {
    if (!isOpen) return;
    await nextTick();
    titleInput.value?.focus();
  },
);

// --------------------------- Emits -------------------------------
const emit = defineEmits<{
  save: []
  close: []
}>();

</script>

<template>
  <div v-if="open" class="modal-overlay" @click.self="handleClose()">
    <div class="modal" role="dialog" aria-modal="true">
      <header class="modal-header">
        <h2>{{ task.id ? t('taskModal.editTitle') : t('taskModal.newTitle') }}</h2>
        <button class="modal-close" type="button" :title="t('common.close')" @click="handleClose()">&times;</button>
      </header>

      <!-- Title -->
      <form class="modal-form" novalidate @submit.prevent="handleSubmit">
        <label class="field">
          <span>{{ t('taskModal.titleLabel') }}</span>
          <input
            ref="titleInput"
            v-model="task.title"
            type="text"
            :maxlength="TITLE_MAX_LENGTH"
            :placeholder="t('taskModal.titlePlaceholder')"
            :class="{ 'field-invalid': validationErrors.title }"
          />
          <span v-if="validationErrors.title" class="field-error">{{ validationErrors.title }}</span>
        </label>
        <!-- Description -->
        <label class="field">
          <span>{{ t('taskModal.descriptionLabel') }}</span>
          <textarea
            v-model="task.description"
            rows="4"
            :maxlength="DESCRIPTION_MAX_LENGTH"
            :placeholder="t('taskModal.descriptionPlaceholder')"
            :class="{ 'field-invalid': validationErrors.description }"
          ></textarea>
          <span class="field-counter">{{ task.description.length }} / {{ DESCRIPTION_MAX_LENGTH }}</span>
          <span v-if="validationErrors.description" class="field-error">{{ validationErrors.description }}</span>
        </label>
        <!-- Status -->
        <label class="field">
          <span>{{ t('taskModal.statusLabel') }}</span>
          <select v-model="task.status" @keydown.enter.prevent="openDropdown">
            <option v-for="status in STATUS_TYPES" :key="status" :value="status">
              {{ t(`status.${status}`) }}
            </option>
          </select>
        </label>
        <!-- Time values -->
        <p v-if="task.id" class="modal-meta-data">
          <span>{{ t('taskModal.created') }}: {{ formatDateTime(task.createdAt) }}</span>
          <span>{{ t('taskModal.updated') }}: {{ formatDateTime(task.updatedAt) }}</span>
          <span>{{ t('taskModal.taskId', { id: task.id }) }}</span>
        </p>
        <!-- Buttons -->
        <footer class="modal-actions">
          <button type="submit" class="btn btn-primary">
            {{ task.id ? t('common.save') : t('common.add') }}
            <!-- Save icon -->
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
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
              <path d="M17 21v-8H7v8" />
              <path d="M7 3v5h8" />
            </svg>
          </button>
          <button type="button" class="btn btn-secondary" @click="handleClose()">
            {{ t('common.cancel') }}
            <!-- Cancel icon -->
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
              <path d="M19 12H5" />
              <path d="M11 18l-6-6 6-6" />
            </svg>
          </button>
        </footer>
      </form>
    </div>
  </div>
</template>
