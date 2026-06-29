<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTasksStore } from '../stores/tasks';
import { useNotifyStore } from '../stores/notifications';
import { STATUS_TYPES, type Status } from '../constants/statusTypes';
import { NOTIFICATION } from '../constants/notificationTypes';

const { t } = useI18n();
const store = useTasksStore();
const notifyStore = useNotifyStore();

// --------------------------- Reactive state -------------------------------

const inputText = ref(store.filterObj.text);
const inputStatus = ref<Status | ''>(store.filterObj.status);

// --------------------------- Functions -------------------------------

// Passes the inputs to the active filter
function search(): void {
  store.filterObj.text = inputText.value;
  store.filterObj.status = inputStatus.value;
  notifyStore.notify(t('notify.filtered'), NOTIFICATION.SUCCESS);
}

/**
 * Resets active filters and the input information
 */
function clear(): void {
  store.resetFilters();
  inputText.value = '';
  inputStatus.value = '';
}

/**
 * Opens the dropdown when it is focused and Enter is pressed
 */
function openDropdown(event: KeyboardEvent): void {
  (event.target as HTMLSelectElement).showPicker?.();
}
</script>

<template>
  <div class="filter-bar">
    <h4 class="filter-bar-heading">
      <!-- Filter icon -->
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
        <path d="M4 5h16l-6 8v6l-4 2v-8L4 5Z" />
      </svg>
      {{ t('filterBar.filters') }}
    </h4>
    <!-- Fields -->
    <div class="filter-bar-row">
      <label class="field filter-bar-field-search">
        <span>{{ t('filterBar.searchLabel') }}</span>
        <!-- drop prevent used so task id cannot be dropped in filter-->
        <input
          v-model="inputText"
          type="search"
          class="filter-bar-search"
          :placeholder="t('filterBar.searchPlaceholder')"
          @drop.prevent
        />
      </label>
      <label class="field filter-bar-field-status">
        <span>{{ t('filterBar.statusLabel') }}</span>
        <select v-model="inputStatus" class="filter-bar-status" @keydown.enter.prevent="openDropdown">
          <option value="">{{ t('filterBar.allStatuses') }}</option>
          <option v-for="status in STATUS_TYPES" :key="status" :value="status">
            {{ t(`status.${status}`) }}
          </option>
        </select>
      </label>
    </div>
    <!-- Buttons -->
    <div class="filter-bar-bottom">
      <button type="button" class="btn btn-tertiary" @click="search">
        <!-- Magnifying glass icon-->
        {{ t('filterBar.search') }}
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
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
      </button>
      <button type="button" class="btn btn-tertiary" @click="clear">
        {{ t('filterBar.clear') }}
        <!-- X icon-->
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
          <path d="M18 6 6 18" />
          <path d="M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
</template>
