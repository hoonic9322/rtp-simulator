<template>
  <header class="admin-topbar">
    <div class="topbar-title">
      <h1>{{ title }}</h1>
      <p v-if="subtitle">{{ subtitle }}</p>
    </div>

    <div class="topbar-actions">
      <button class="topbar-user-button" type="button">
        <i class="bi bi-person-fill"></i>
        {{ adminUser.displayName }}
      </button>

      <button class="help-button" type="button" @click="$emit('open-help')">
        <i class="bi bi-question-circle"></i>
        {{ t('common.help') }}
      </button>

      <select v-model="currentLanguage" class="language-select" @change="changeLanguage">
        <option value="en">English</option>
        <option value="zh">中文</option>
      </select>

      <button class="logout-button" type="button" @click="logout">
        <i class="bi bi-box-arrow-right"></i>
        {{ t('common.logout') }}
      </button>
    </div>
  </header>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

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

defineEmits(['open-help'])

const router = useRouter()
const { t, locale } = useI18n()

const currentLanguage = ref(locale.value)

const adminUser = ref({
  displayName: 'Admin',
})

function loadAdminUser() {
  const savedUser = localStorage.getItem('rtpSimulatorUser')

  if (!savedUser) {
    adminUser.value = {
      displayName: 'Admin',
    }
    return
  }

  try {
    const parsedUser = JSON.parse(savedUser)

    adminUser.value = {
      displayName: parsedUser.displayName || 'Admin',
    }
  } catch {
    adminUser.value = {
      displayName: 'Admin',
    }
  }
}

function changeLanguage() {
  locale.value = currentLanguage.value
  localStorage.setItem('rtpSimulatorLanguage', currentLanguage.value)
  document.title = currentLanguage.value === 'zh' ? '杀率模拟器' : 'RTP Simulator'
}

function logout() {
  localStorage.removeItem('rtpSimulatorLoggedIn')
  localStorage.removeItem('rtpSimulatorUser')

  router.push('/login')
}

onMounted(() => {
  currentLanguage.value = localStorage.getItem('rtpSimulatorLanguage') || locale.value
  locale.value = currentLanguage.value
  document.title = currentLanguage.value === 'zh' ? '杀率模拟器' : 'RTP Simulator'

  loadAdminUser()
})
</script>