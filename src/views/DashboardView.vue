<template>
  <AppLayout
    :title="t('dashboard.title')"
    :subtitle="t('dashboard.subtitle')"
  >
    <div class="dashboard-grid">
      <div class="summary-card">
        <span>{{ t('dashboard.project') }}</span>
        <strong>RTP Simulator</strong>
        <p>{{ t('common.appSubtitle') }}</p>
      </div>

      <div class="summary-card">
        <span>{{ t('dashboard.currentMode') }}</span>
        <strong>{{ t('dashboard.frontendOnly') }}</strong>
        <p>{{ t('dashboard.noBackend') }}</p>
      </div>

      <div class="summary-card">
        <span>{{ t('dashboard.loginType') }}</span>
        <strong>{{ t('dashboard.simpleLogin') }}</strong>
        <p>{{ t('dashboard.noRbac') }}</p>
      </div>

      <div class="summary-card">
        <span>{{ t('dashboard.status') }}</span>
        <strong>{{ t('dashboard.setup') }}</strong>
        <p>{{ t('dashboard.setupText') }}</p>
      </div>
    </div>

    <div class="admin-card">
      <h2>{{ t('dashboard.projectPurpose') }}</h2>
      <p>{{ t('dashboard.purposeText') }}</p>
    </div>

    <div class="admin-card">
      <h2>{{ t('dashboard.nextMilestone') }}</h2>
      <p>{{ t('dashboard.nextMilestoneText') }}</p>
    </div>
  </AppLayout>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import AppLayout from '../components/AppLayout.vue'

const { t } = useI18n()
</script>