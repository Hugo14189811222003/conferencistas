<template>
    <div class="container">
        <div class="form-card card">
            <h1>Nueva Contraseña</h1>
            <div v-if="error" class="error-message">{{ error }}</div>
            <div v-if="success" class="success-message">
                {{ success }}
                <router-link to="/login" class="btn" style="margin-top: 1rem; display: inline-block;">
                    Ir a Iniciar Sesión
                </router-link>
            </div>
            <form v-if="!success" @submit.prevent="handleReset">
                <div class="form-group">
                    <label for="password">Nueva Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        v-model="form.password"
                        required
                        minlength="6"
                        placeholder="Mínimo 6 caracteres"
                    />
                </div>
                <div class="form-group">
                    <label for="confirmPassword">Confirmar Contraseña</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        v-model="form.confirmPassword"
                        required
                        placeholder="Repite tu contraseña"
                    />
                </div>
                <button type="submit" class="btn" :disabled="loading">
                    {{ loading ? 'Guardando...' : 'Guardar Contraseña' }}
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { authService } from '../services/api'

const route = useRoute()

const form = ref({
    password: '',
    confirmPassword: ''
})

const loading = ref(false)
const error = ref(null)
const success = ref(null)

const handleReset = async () => {
    if (form.value.password !== form.value.confirmPassword) {
        error.value = 'Las contraseñas no coinciden'
        return
    }

    try {
        loading.value = true
        error.value = null
        const response = await authService.resetPassword(route.params.token, form.value.password)
        success.value = response.data.message
    } catch (err) {
        error.value = err.response?.data?.error || 'Error al restablecer contraseña'
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
</style>
