<template>
  <AppLayout
    :title="t('simulator.title')"
    :subtitle="t('simulator.subtitle')"
  >
    <div class="content-card">
      <h3>{{ t('simulator.heading') }}</h3>
      <p>{{ t('simulator.description') }}</p>

      <div class="placeholder-box">
        {{ t('simulator.placeholder') }}
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import AppLayout from '../components/AppLayout.vue'

const { t } = useI18n()
</script>