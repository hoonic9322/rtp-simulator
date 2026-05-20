<template>
  <div class="admin-login-page">
    <div class="top-actions">
      <button type="button" class="top-action-button" @click="showHelp = true">
        <i class="bi bi-question-circle"></i>
        {{ t('common.help') }}
      </button>

      <select v-model="currentLanguage" class="language-select" @change="changeLanguage">
        <option value="zh">{{ t('common.chinese') }}</option>
        <option value="en">{{ t('common.english') }}</option>
      </select>
    </div>

    <section class="login-intro">
      <div class="intro-badge">
        <span class="badge-dot"></span>
        {{ t('common.appName') }}
      </div>

      <p class="intro-description">
        {{ t('login.introDescription') }}
      </p>

      <div class="feature-list">
        <div class="feature-item">
          <span class="check-icon">✓</span>
          {{ t('login.feature1') }}
        </div>

        <div class="feature-item">
          <span class="check-icon">✓</span>
          {{ t('login.feature2') }}
        </div>

        <div class="feature-item">
          <span class="check-icon">✓</span>
          {{ t('login.feature3') }}
        </div>

        <div class="feature-item">
          <span class="check-icon">✓</span>
          {{ t('login.feature4') }}
        </div>
      </div>
    </section>

    <section class="login-panel">
      <div class="login-card">
        <div class="brand-area">
          <div class="brand-logo">
            <i class="bi bi-pie-chart-fill"></i>
          </div>

          <div>
            <h4>{{ t('common.appName') }}</h4>

            <p>
              {{ t('login.version') }}
              <span class="version-badge">v1.0.0</span>
            </p>
          </div>
        </div>

        <div class="card-divider"></div>

        <form autocomplete="off" @submit.prevent="login">
          <div class="input-group">
            <span class="input-icon">
              <i class="bi bi-person-fill"></i>
            </span>

            <input
              v-model.trim="username"
              type="text"
              :placeholder="t('login.usernamePlaceholder')"
              autocomplete="off"
              name="rtp-simulator-username"
            />
          </div>

          <div class="input-group">
            <span class="input-icon">
              <i class="bi bi-lock-fill"></i>
            </span>

            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              :placeholder="t('login.passwordPlaceholder')"
              autocomplete="new-password"
              name="rtp-simulator-password"
            />

            <button type="button" class="password-toggle" @click="showPassword = !showPassword">
              {{ showPassword ? t('common.hide') : t('common.show') }}
            </button>
          </div>

          <div class="login-options">
            <label class="remember-me">
              <input v-model="rememberMe" type="checkbox" />
              <span>{{ t('common.rememberMe') }}</span>
            </label>
          </div>

          <button type="submit" class="login-button" :disabled="loading">
            {{ loading ? t('common.loading') : t('common.login') }}
          </button>

          <p v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </p>
        </form>

        <div class="default-account">
          <span>{{ t('login.defaultAccountText') }}</span>
          <code>admin / admin123</code>
        </div>

        <p class="copyright">
          {{ t('login.copyright') }}
        </p>
      </div>
    </section>

    <div v-if="showHelp" class="modal-mask">
      <div class="help-modal">
        <div class="modal-header">
          <h3>{{ t('login.helpTitle') }}</h3>

          <button type="button" class="icon-button" @click="showHelp = false">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <div class="modal-body">
          <h4>{{ t('common.helpPurpose') }}</h4>
          <p>{{ t('login.helpPurposeText') }}</p>

          <h4>{{ t('common.operationSteps') }}</h4>
          <ol>
            <li>{{ t('login.helpStep1') }}</li>
            <li>{{ t('login.helpStep2') }}</li>
            <li>{{ t('login.helpStep3') }}</li>
          </ol>

          <h4>{{ t('common.helpNotes') }}</h4>
          <ul>
            <li>{{ t('login.helpNote1') }}</li>
            <li>{{ t('login.helpNote2') }}</li>
          </ul>
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
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t, locale } = useI18n()

const username = ref('admin')
const password = ref('admin123')
const loading = ref(false)
const errorMessage = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const showHelp = ref(false)

const currentLanguage = ref(
  localStorage.getItem('rtpSimulatorLanguage') ||
    localStorage.getItem('language') ||
    'zh'
)

onMounted(() => {
  const savedUsername = localStorage.getItem('rtpSimulatorRememberedUsername')

  if (savedUsername) {
    username.value = savedUsername
    rememberMe.value = true
  }

  locale.value = currentLanguage.value
  updateBrowserTitle(currentLanguage.value)
})

function updateBrowserTitle(language) {
  document.title = language === 'zh' ? '杀率模拟器' : 'RTP Simulator'
}

function changeLanguage() {
  locale.value = currentLanguage.value

  localStorage.setItem('rtpSimulatorLanguage', currentLanguage.value)
  localStorage.setItem('language', currentLanguage.value)
  localStorage.setItem('adminLanguage', currentLanguage.value)

  updateBrowserTitle(currentLanguage.value)
}

function login() {
  errorMessage.value = ''

  if (!username.value.trim() || !password.value.trim()) {
    errorMessage.value = t('login.usernamePasswordRequired')
    return
  }

  loading.value = true

  setTimeout(() => {
    if (username.value.trim() !== 'admin' || password.value !== 'admin123') {
      errorMessage.value = t('common.invalidLogin')
      loading.value = false
      return
    }

    const loginUser = {
      username: 'admin',
      displayName: 'Admin',
      roleCode: 'LOCAL_ADMIN',
    }

    localStorage.setItem('rtpSimulatorLoggedIn', 'true')
    localStorage.setItem('rtpSimulatorUser', JSON.stringify(loginUser))

    if (rememberMe.value) {
      localStorage.setItem('rtpSimulatorRememberedUsername', username.value.trim())
    } else {
      localStorage.removeItem('rtpSimulatorRememberedUsername')
    }

    loading.value = false
    router.push('/prize-config')
  }, 250)
}
</script>

<style scoped>
.admin-login-page {
  position: relative;
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 560px;
  align-items: center;
  gap: 36px;
  padding: 48px 80px;
  box-sizing: border-box;
  overflow: hidden;
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    'PingFang SC',
    'Hiragino Sans GB',
    'Microsoft YaHei',
    Arial,
    sans-serif;
  background:
    radial-gradient(circle at 18% 22%, rgba(68, 105, 178, 0.28), transparent 30%),
    radial-gradient(circle at 76% 86%, rgba(50, 86, 150, 0.22), transparent 28%),
    linear-gradient(135deg, #1f3158 0%, #101827 48%, #182744 100%);
  color: #e5ecff;
}

.admin-login-page::before,
.admin-login-page::after {
  content: '';
  position: absolute;
  border: 1px solid rgba(93, 130, 206, 0.12);
  border-radius: 50%;
  pointer-events: none;
}

.admin-login-page::before {
  width: 360px;
  height: 360px;
  left: 170px;
  top: 56px;
}

.admin-login-page::after {
  width: 520px;
  height: 520px;
  right: -120px;
  bottom: -130px;
}

.top-actions {
  position: absolute;
  top: 24px;
  right: 32px;
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 10px;
}

.top-action-button {
  height: 36px;
  min-width: 82px;
  border: 1px solid rgba(105, 147, 230, 0.45);
  border-radius: 8px;
  background: rgba(18, 27, 45, 0.72);
  color: #dbe7ff;
  padding: 0 12px;
  cursor: pointer;
  font-weight: 700;
  white-space: nowrap;
}

.top-action-button:hover {
  background: rgba(66, 133, 255, 0.22);
}

.admin-login-page .language-select {
  width: 132px;
  height: 36px;
  border: 1px solid rgba(105, 147, 230, 0.45);
  border-radius: 8px;
  background: rgba(18, 27, 45, 0.72);
  color: #dbe7ff;
  padding: 0 10px;
  outline: none;
  color-scheme: dark;
}

.admin-login-page .language-select option {
  background: #111827;
  color: #e5ecff;
}

.login-intro {
  position: relative;
  z-index: 2;
  max-width: 800px;
}

.intro-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 40px;
  padding: 8px 22px;
  border-radius: 999px;
  background: rgba(59, 130, 246, 0.18);
  color: #9ab8ff;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 1px;
  line-height: 1.3;
}

.badge-dot {
  width: 9px;
  height: 9px;
  flex: 0 0 9px;
  border-radius: 50%;
  background: #70a0ff;
  box-shadow: 0 0 18px rgba(112, 160, 255, 0.9);
}

.intro-description {
  max-width: 760px;
  margin: 24px 0 38px;
  color: #b9c6e2;
  font-size: 18px;
  line-height: 1.8;
  font-weight: 400;
}

.feature-list {
  display: grid;
  gap: 16px;
  max-width: 780px;
}

.feature-item {
  display: flex;
  align-items: center;
  min-height: 64px;
  padding: 0 22px;
  border: 1px solid rgba(86, 122, 194, 0.24);
  border-radius: 14px;
  background: rgba(12, 19, 35, 0.72);
  color: #d5def3;
  font-size: 17px;
  font-weight: 500;
}

.check-icon {
  margin-right: 12px;
  color: #79a7ff;
  font-weight: 900;
}

.login-panel {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: flex-start;
}

.login-card {
  width: 500px;
  padding: 42px 44px 34px;
  box-sizing: border-box;
  border: 1px solid rgba(90, 130, 215, 0.48);
  border-radius: 28px;
  background: rgba(18, 27, 45, 0.86);
  box-shadow:
    0 30px 70px rgba(0, 0, 0, 0.32),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(18px);
}

.brand-area {
  display: flex;
  align-items: center;
  gap: 18px;
}

.brand-logo {
  width: 68px;
  height: 68px;
  flex: 0 0 68px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(92, 137, 230, 0.55);
  border-radius: 22px;
  background: rgba(22, 35, 59, 0.95);
  color: #60a5fa;
  font-size: 36px;
}

.brand-area h4 {
  margin: 0 0 8px;
  color: #f1f5ff;
  font-size: 18px;
  line-height: 1.25;
  font-weight: 800;
}

.brand-area p {
  margin: 0;
  color: #99a8c7;
  font-size: 14px;
  font-weight: 600;
}

.version-badge {
  display: inline-flex;
  align-items: center;
  height: 24px;
  margin-left: 10px;
  padding: 0 11px;
  border-radius: 999px;
  background: rgba(70, 107, 181, 0.38);
  color: #c9d8ff;
  font-size: 13px;
  font-weight: 700;
}

.card-divider {
  height: 1px;
  margin: 24px 0 34px;
  background: rgba(98, 126, 178, 0.22);
}

.input-group {
  position: relative;
  margin-bottom: 18px;
}

.input-icon {
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: #7e8dac;
  font-size: 15px;
  z-index: 2;
}

.input-group input {
  width: 100%;
  height: 54px;
  padding: 0 64px 0 50px;
  box-sizing: border-box;
  border: 1px solid rgba(90, 110, 150, 0.5);
  border-radius: 7px;
  outline: none;
  background: rgba(9, 15, 29, 0.88);
  color: #e8efff;
  font-size: 15px;
  font-weight: 500;
}

.input-group input::placeholder {
  color: #74829d;
}

.input-group input:focus {
  border-color: rgba(96, 165, 250, 0.95);
  background: rgba(9, 15, 29, 0.94);
  box-shadow: 0 0 0 3px rgba(66, 133, 255, 0.16);
}

.input-group input:-webkit-autofill,
.input-group input:-webkit-autofill:hover,
.input-group input:-webkit-autofill:focus,
.input-group input:-webkit-autofill:active {
  -webkit-text-fill-color: #e8efff;
  caret-color: #e8efff;
  box-shadow: 0 0 0 1000px rgba(9, 15, 29, 0.94) inset !important;
  border: 1px solid rgba(90, 110, 150, 0.5);
  transition: background-color 9999s ease-in-out 0s;
}

.password-toggle {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  color: #9aa9c5;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  z-index: 2;
}

.login-options {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 6px 0 18px;
  color: #aebbdd;
  font-size: 14px;
}

.remember-me {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.remember-me input {
  width: 16px;
  height: 16px;
  accent-color: #4285ff;
  cursor: pointer;
}

.login-button {
  width: 100%;
  height: 54px;
  border: none;
  border-radius: 7px;
  background: #4285ff;
  color: #ffffff;
  font-size: 17px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 12px 26px rgba(66, 133, 255, 0.24);
}

.login-button:hover:not(:disabled) {
  background: #3478f6;
  transform: translateY(-1px);
}

.login-button:disabled {
  background: #6f93d6;
  cursor: not-allowed;
  box-shadow: none;
}

.error-message {
  margin: 18px 0 0;
  padding: 12px 14px;
  border: 1px solid rgba(248, 113, 113, 0.35);
  border-radius: 8px;
  background: rgba(127, 29, 29, 0.22);
  color: #fecaca;
  text-align: center;
  font-size: 14px;
}

.default-account {
  margin-top: 18px;
  padding: 12px 14px;
  border: 1px solid rgba(98, 126, 178, 0.3);
  border-radius: 8px;
  background: rgba(9, 15, 29, 0.48);
  color: #aebbdd;
  font-size: 13px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.default-account code {
  color: #dbeafe;
  background: rgba(15, 23, 42, 0.72);
  border: 1px solid rgba(98, 126, 178, 0.3);
  border-radius: 6px;
  padding: 4px 8px;
}

.copyright {
  margin: 30px 0 0;
  padding-top: 22px;
  border-top: 1px solid rgba(98, 126, 178, 0.2);
  text-align: center;
  color: #b2bdd5;
  font-size: 13px;
}

.modal-mask {
  position: fixed;
  inset: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(3, 7, 18, 0.68);
  backdrop-filter: blur(8px);
}

.help-modal {
  width: 100%;
  max-width: 620px;
  border: 1px solid rgba(90, 130, 215, 0.48);
  border-radius: 20px;
  background: #111827;
  color: #e5ecff;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.38);
  overflow: hidden;
}

.modal-header,
.modal-footer {
  padding: 18px 22px;
  border-bottom: 1px solid rgba(98, 126, 178, 0.22);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
}

.modal-body {
  padding: 22px;
  color: #c7d2ea;
  line-height: 1.7;
}

.modal-body h4 {
  margin: 18px 0 8px;
  color: #f1f5ff;
  font-size: 15px;
}

.modal-body h4:first-child {
  margin-top: 0;
}

.modal-body p {
  margin: 0 0 14px;
}

.modal-body ol,
.modal-body ul {
  margin: 0;
  padding-left: 22px;
}

.modal-footer {
  border-top: 1px solid rgba(98, 126, 178, 0.22);
  border-bottom: none;
  text-align: right;
}

.icon-button {
  width: 34px;
  height: 34px;
  border: 1px solid rgba(105, 147, 230, 0.35);
  border-radius: 8px;
  background: rgba(18, 27, 45, 0.72);
  color: #dbe7ff;
  cursor: pointer;
}

.primary-button {
  height: 38px;
  min-width: 90px;
  border: none;
  border-radius: 8px;
  background: #4285ff;
  color: #ffffff;
  font-weight: 800;
  cursor: pointer;
}

.primary-button:hover {
  background: #3478f6;
}

@media (max-width: 1180px) {
  .admin-login-page {
    grid-template-columns: 1fr;
    gap: 36px;
    padding: 72px 40px 48px;
  }

  .login-panel {
    justify-content: center;
  }

  .top-actions {
    right: 40px;
  }
}

@media (max-width: 680px) {
  .admin-login-page {
    min-height: 100vh;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 72px 16px 28px;
    overflow-y: auto;
  }

  .top-actions {
    top: 14px;
    right: 16px;
    left: 16px;
    justify-content: space-between;
    gap: 8px;
  }

  .top-action-button {
    min-width: 72px;
    height: 34px;
    padding: 0 10px;
    font-size: 12px;
  }

  .admin-login-page .language-select {
    width: 128px;
    height: 34px;
    font-size: 12px;
  }

  .login-intro {
    display: none;
  }

  .login-panel {
    width: 100%;
    justify-content: center;
  }

  .login-card {
    width: 100%;
    max-width: 420px;
    padding: 28px 22px 24px;
    border-radius: 22px;
  }

  .brand-logo {
    width: 56px;
    height: 56px;
    flex-basis: 56px;
    border-radius: 18px;
    font-size: 28px;
  }

  .default-account {
    flex-direction: column;
    gap: 8px;
    font-size: 12px;
  }

  .modal-mask {
    align-items: flex-start;
    padding: 72px 16px 24px;
  }
}
</style>