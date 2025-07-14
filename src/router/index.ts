import { createRouter, createWebHistory } from 'vue-router';

import { env } from '@/config/env';
const router = createRouter({
  history: createWebHistory(env.VITE_APP_BASE_PATH),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/dashboard',
      name: 'Home',
      component: () => import('../views/Home.vue')
    }
  ]
});

export default router;
