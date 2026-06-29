<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

defineProps<{
  open: boolean
  title: string
  message: string
}>();

// --------------------------- Emits -------------------------------

const emit = defineEmits<{
  confirm: []
  cancel: []
}>();
</script>

<template>
  <div v-if="open" class="modal-overlay" @click.self="emit('cancel')">
    <div class="modal" role="dialog" aria-modal="true">
      <header class="modal-header">
        <h2>{{ title }}</h2>
        <button class="modal-close" type="button" :title="t('common.close')" @click="emit('cancel')">&times;</button>
      </header>
      <p class="modal-text">{{ message }}</p>
      <p class="modal-text">{{ t('confirmModal.continue') }}</p>
      <footer class="modal-actions">
        <button type="button" class="btn btn-primary" @click="emit('confirm')">{{ t('confirmModal.yes') }}</button>
        <button type="button" class="btn btn-secondary" @click="emit('cancel')">{{ t('confirmModal.no') }}</button>
      </footer>
    </div>
  </div>
</template>
