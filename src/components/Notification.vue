<script setup lang="ts">
import { useNotifyStore } from '../stores/notifications';

const notifyStore = useNotifyStore();
</script>

<template>
  <div class="notification-stack">
    <div
      v-for="notification in notifyStore.notifications"
      :key="notification.id"
      class="notification"
      :class="`notification-${notification.type}`"
      role="alert"
    >
      {{ notification.message }}
    </div>
  </div>
</template>
