import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/HomeView.vue')
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/LoginView.vue')
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('../views/RegisterView.vue')
    },
    {
        path: '/forgot-password',
        name: 'ForgotPassword',
        component: () => import('../views/ForgotPasswordView.vue')
    },
    {
        path: '/reset-password/:token',
        name: 'ResetPassword',
        component: () => import('../views/ResetPasswordView.vue')
    },
    {
        path: '/eventos/:id',
        name: 'EventoDetalle',
        component: () => import('../views/EventoDetalleView.vue')
    },
    {
        path: '/eventos/:id/participar',
        name: 'Participar',
        component: () => import('../views/ParticiparView.vue')
    },
    {
        path: '/eventos/:id/confirmacion',
        name: 'Confirmacion',
        component: () => import('../views/ConfirmacionView.vue')
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('../views/DashboardView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/dashboard/eventos/new',
        name: 'CrearEvento',
        component: () => import('../views/CrearEventoView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/dashboard/eventos/:id/edit',
        name: 'EditarEvento',
        component: () => import('../views/EditarEventoView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/admin',
        name: 'Admin',
        component: () => import('../views/AdminView.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next({ name: 'Login', query: { redirect: to.fullPath } })
    } else if (to.meta.requiresAdmin && !authStore.isAdmin) {
        next({ name: 'Home' })
    } else {
        next()
    }
})

export default router
