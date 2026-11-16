<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import Notification from './components/Notification.vue';
import FilterBar from './components/FilterBar.vue';
import KanbanBoard from './components/KanbanBoard.vue';

const { t } = useI18n();
</script>

<template>
  <div class="app">
    <header class="app__header">
      <h1 class="app__title">{{ t('app.title') }}</h1>
    </header>
    <FilterBar />
    <KanbanBoard />
    <Notification />
  </div>
</template>
