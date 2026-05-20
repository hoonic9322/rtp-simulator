<template>
  <aside class="admin-sidebar">
    <div class="admin-logo">
      <div class="admin-logo-icon">
        <i class="bi bi-pie-chart-fill"></i>
      </div>

      <div class="admin-logo-text">
        <strong>{{ t('common.appName') }}</strong>
        <span>{{ t('common.appSubtitle') }}</span>
      </div>
    </div>

    <nav class="admin-nav simple-admin-nav">
      <router-link to="/prize-config" class="admin-nav-link simple-admin-nav-link">
        <span class="admin-nav-icon">
          <i class="bi bi-sliders"></i>
        </span>

        <span class="admin-nav-text">
          {{ t('menu.rtpSetting') }}
        </span>
      </router-link>
    </nav>
  </aside>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>