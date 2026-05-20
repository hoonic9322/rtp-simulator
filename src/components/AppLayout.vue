<template>
  <div class="admin-page">
    <AppSidebar />

    <main class="admin-main">
      <AppTopbar
        :title="title"
        :subtitle="subtitle"
        @open-help="showHelp = true"
      />

      <section class="admin-content">
        <slot />
      </section>
    </main>

    <div v-if="showHelp" class="modal-mask">
      <div class="help-modal rtp-help-modal">
        <div class="modal-header">
          <div>
            <h3>{{ helpContent.title }}</h3>
            <p class="modal-subtitle">{{ t('common.help') }}</p>
          </div>

          <button type="button" class="icon-button" @click="showHelp = false">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <div class="modal-body rtp-help-body">
          <section class="help-section">
            <h4>{{ helpContent.purposeTitle }}</h4>
            <p>{{ helpContent.purposeText }}</p>
          </section>

          <section class="help-section">
            <h4>{{ helpContent.stepTitle }}</h4>

            <div
              v-for="step in helpContent.steps"
              :key="step.title"
              class="help-item"
            >
              <strong>{{ step.title }}</strong>
              <p>{{ step.text }}</p>
            </div>
          </section>

          <section class="help-section">
            <h4>{{ helpContent.formulaTitle }}</h4>

            <ul class="help-list">
              <li v-for="formula in helpContent.formulas" :key="formula">
                {{ formula }}
              </li>
            </ul>
          </section>

          <section class="help-section">
            <h4>{{ helpContent.noticeTitle }}</h4>

            <ul class="help-list">
              <li v-for="notice in helpContent.notices" :key="notice">
                {{ notice }}
              </li>
            </ul>
          </section>
        </div>

        <div class="modal-footer">
          <button type="button" class="primary-button" @click="showHelp = false">
            {{ t('common.close') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import AppSidebar from './AppSidebar.vue'
import AppTopbar from './AppTopbar.vue'
import { prizeConfigHelp } from '../help/prizeConfigHelp'

defineProps({
  title: {
    type: String,
    default: '',
  },
  subtitle: {
    type: String,
    default: '',
  },
})

const { t, locale } = useI18n()
const showHelp = ref(false)

const helpContent = computed(() => {
  return prizeConfigHelp[locale.value] || prizeConfigHelp.en
})
</script>