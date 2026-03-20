<template>
    <div class="container">
        <div class="form-card card">
            <h1>Iniciar Sesión</h1>
            <div v-if="error" class="error-message">{{ error }}</div>
            <form @submit.prevent="handleLogin">
                <div class="form-group">
                    <label for="gmail">Correo Electrónico</label>
                    <input
                        type="email"
                        id="gmail"
                        v-model="form.gmail"
                        required
                        placeholder="correo@ejemplo.com"
                    />
                </div>
                <div class="form-group">
                    <label for="password">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        v-model="form.password"
                        required
                        placeholder="Tu contraseña"
                    />
                </div>
                <button type="submit" class="btn" :disabled="loading">
                    {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
                </button>
            </form>
            <p class="form-footer">
                ¿Olvidaste tu contraseña? <router-link to="/forgot-password">Restablecer</router-link>
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const form = ref({
    gmail: '',
    password: ''
})

const loading = ref(false)
const error = ref(null)

const handleLogin = async () => {
    try {
        loading.value = true
        error.value = null
        await authStore.login(form.value.gmail, form.value.password)
        const redirect = route.query.redirect || '/dashboard'
        router.push(redirect)
    } catch (err) {
        error.value = err.response?.data?.error || 'Error al iniciar sesión'
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.form-card {
    max-width: 450px;
    margin: 2rem auto;
}

h1 {
    margin-bottom: 1.5rem;
    color: #2c3e50;
}

.form-footer {
    margin-top: 1rem;
    text-align: center;
    color: #666;
}

.form-footer a {
    color: #3498db;
}
</style>
