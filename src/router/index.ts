// Composables
import { useAppStore } from '@/store/app';
import { createRouter, createWebHistory } from 'vue-router'


const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        // route level code-splitting
        // this generates a separate chunk (Home-[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('@/views/Home.vue'),
      },
    ],
  },
  {
    path: '/auth',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Auth',
        // route level code-splitting
        // this generates a separate chunk (Home-[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('@/views/Auth.vue'),
      },
    ],
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const globalStore = useAppStore(); // Evite usar hooks diretamente aqui
  const user = globalStore.user;

  const screen = to.name || 'home';

  if (screen.toUpperCase() !== 'AUTH' && user.id === 0) {
    next({ name: 'Auth' }); // Redireciona para a rota de autenticação se o usuário não estiver autenticado e a rota atual não for 'Auth'
  } else {
    next(); // Continua a navegação normalmente
  }
});

export default router
