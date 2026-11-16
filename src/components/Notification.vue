<script setup lang="ts">
import { useNotifyStore } from '../stores/notifications';

const notifyStore = useNotifyStore();
</script>

<template>
  <div class="notifications">
    <div
      v-for="notification in notifyStore.notifications"
      :key="notification.id"
      class="notifications__item"
      :class="`notifications__item--${notification.type}`"
      role="alert"
    >
      {{ notification.message }}
    </div>
  </div>
</template>
