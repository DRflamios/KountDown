import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Preview from '@/views/Preview.vue'
import Dashboard from '@/views/Dashboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/preview',
      name: 'preview',
      component: Preview,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
    },
  ],
})

export default router
