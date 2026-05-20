import { createApp } from 'vue'
import 'bootstrap-icons/font/bootstrap-icons.css'

import App from './App.vue'
import router from './router'
import i18n from './i18n'
import './styles/admin.css'

createApp(App).use(router).use(i18n).mount('#app')