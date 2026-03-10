import { createRouter, createWebHistory } from 'vue-router'
import { useStore } from '@/stores'
import routes from './routes'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _from, next) => {
  const store = useStore()

  if (to.meta.requiresAuth && !store.isLoggedIn)                    return next('/login')
  if (to.meta.guest       && store.isLoggedIn)                      return next('/dashboard')
  if (to.meta.roles       && !to.meta.roles.includes(store.user?.role)) return next('/dashboard')

  next()
})

export default router