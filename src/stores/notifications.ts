import { defineStore } from 'pinia';
import { ref } from 'vue';
import { NOTIFICATION, type NotificationType } from '../constants/notificationTypes';

export interface Notification {
  id: number
  message: string
  type: NotificationType
}

const DISPLAY_DURATION = 5000;

export const useNotifyStore = defineStore('notifications', () => {

  // ---------------------- Reactive state -------------------------

  const notifications = ref<Notification[]>([]);
  let nextId = 0;

  // ----------------------- Functions --------------------------------

  /**
   * Removes a notification by id
   */
  function dismiss(id: number): void {
    const index = notifications.value.findIndex((n) => n.id === id);
    if (index !== -1) {
      notifications.value.splice(index, 1);
    }
  }

  /**
   * Displays notification and for a specific time
   */
  function notify(message: string, type: NotificationType = NOTIFICATION.SUCCESS): void {
    const id = nextId++;
    notifications.value.push({ id, message, type });
    setTimeout(() => dismiss(id), DISPLAY_DURATION);   // Remove message after duration ends
  }

  return {
    notifications,
    notify,
  };
});
