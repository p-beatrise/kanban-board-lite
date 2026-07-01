<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import Notification from './components/Notification.vue';
import FilterBar from './components/FilterBar.vue';
import KanbanBoard from './components/KanbanBoard.vue';

const { t } = useI18n();
</script>

<template>
  <div class="app">
    <header class="app-header">
      <h1>{{ t('app.title') }}</h1>
    </header>
    <FilterBar />
    <KanbanBoard />
    <Notification />
  </div>
</template>
