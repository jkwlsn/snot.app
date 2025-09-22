import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from './views/AppDashboard.vue';
import Settings from './views/AppSettings.vue';
import About from './views/AboutPage.vue';
import Data from './views/AppData.vue';

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
  },
  {
    path: '/data',
    name: 'Data',
    component: Data,
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
