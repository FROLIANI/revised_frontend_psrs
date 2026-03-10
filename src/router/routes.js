
import LoginView        from '@/views/LoginView.vue'
import RegisterView     from '@/views/RegisterView.vue'
import ForgotPassword   from '@/views/ForgotPasswordView.vue'
import DashboardView    from '@/views/DashboardView.vue'
import JobsView         from '@/views/JobsView.vue'
import JobDetailView    from '@/views/JobDetailView.vue'
import ApplyView        from '@/views/ApplyView.vue'
import ApplicationsView from '@/views/ApplicationsView.vue'

const routes = [
  { path: '/',                redirect: '/dashboard' },
  { path: '/login',           component: LoginView,        meta: { guest: true } },
  { path: '/register',        component: RegisterView,     meta: { guest: true } },
  { path: '/forgot-password', component: ForgotPassword,   meta: { guest: true } },
  { path: '/dashboard',       component: DashboardView,    meta: { requiresAuth: true } },
  { path: '/jobs',            component: JobsView },
  { path: '/jobs/:id',        component: JobDetailView },
  { path: '/apply/:id',       component: ApplyView },
  {
    path: '/admin/applications',
    component: ApplicationsView,
    meta: { requiresAuth: true, roles: ['admin', 'editor'] },
  },
]

export default routes