import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import PrizeConfigView from '../views/PrizeConfigView.vue'
import SimulatorView from '../views/SimulatorView.vue'
import ResultReportView from '../views/ResultReportView.vue'

const routes = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: {
      public: true,
      title: 'Login',
    },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: {
      title: 'Dashboard',
    },
  },
  {
    path: '/prize-config',
    name: 'PrizeConfig',
    component: PrizeConfigView,
    meta: {
      title: 'Prize Configuration',
    },
  },
  {
    path: '/simulator',
    name: 'Simulator',
    component: SimulatorView,
    meta: {
      title: 'RTP Simulator',
    },
  },
  {
    path: '/result-report',
    name: 'ResultReport',
    component: ResultReportView,
    meta: {
      title: 'Result Report',
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const isLoggedIn = localStorage.getItem('rtpSimulatorLoggedIn') === 'true'

  if (!to.meta.public && !isLoggedIn) {
    return '/login'
  }

  if (to.path === '/login' && isLoggedIn) {
    return '/prize-config'
  }

  return true
})

export default router