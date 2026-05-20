<template>
  <AppLayout
    :title="t('resultReport.title')"
    :subtitle="t('resultReport.subtitle')"
  >
    <div class="content-card">
      <h3>{{ t('resultReport.heading') }}</h3>
      <p>{{ t('resultReport.description') }}</p>

      <div class="placeholder-box">
        {{ t('resultReport.placeholder') }}
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import AppLayout from '../components/AppLayout.vue'

const { t } = useI18n()
</script>