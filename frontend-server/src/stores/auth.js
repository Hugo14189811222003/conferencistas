import { defineStore } from 'pinia'
import { authService } from '../services/api'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || null,
        loading: false,
        error: null
    }),
    getters: {
        isAuthenticated: (state) => !!state.token,
        isAdmin: (state) => state.user?.role === 'admin',
        isUser: (state) => state.user?.role === 'user'
    },
    actions: {
        async register(data) {
            this.loading = true
            this.error = null
            try {
                const response = await authService.register(data)
                this.token = response.data.token
                this.user = response.data.user
                localStorage.setItem('token', this.token)
                localStorage.setItem('user', JSON.stringify(this.user))
                return response.data
            } catch (error) {
                this.error = error.response?.data?.error || 'Error al registrar'
                throw error
            } finally {
                this.loading = false
            }
        },
        async login(gmail, password) {
            this.loading = true
            this.error = null
            try {
                const response = await authService.login({ gmail, password })
                this.token = response.data.token
                this.user = response.data.user
                localStorage.setItem('token', this.token)
                localStorage.setItem('user', JSON.stringify(this.user))
                return response.data
            } catch (error) {
                this.error = error.response?.data?.error || 'Credenciales inválidas'
                throw error
            } finally {
                this.loading = false
            }
        },
        async getPerfil() {
            try {
                const response = await authService.getPerfil()
                this.user = { ...this.user, ...response.data }
                localStorage.setItem('user', JSON.stringify(this.user))
            } catch (error) {
                throw error
            }
        },
        async updatePerfil(data) {
            try {
                const response = await authService.updatePerfil(data)
                this.user = { ...this.user, ...response.data }
                localStorage.setItem('user', JSON.stringify(this.user))
                return response.data
            } catch (error) {
                throw error
            }
        },
        logout() {
            this.user = null
            this.token = null
            this.error = null
            localStorage.removeItem('token')
            localStorage.removeItem('user')
        },
        clearError() {
            this.error = null
        }
    }
})
