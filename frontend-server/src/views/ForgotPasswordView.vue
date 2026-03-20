<template>
    <div class="container">
        <div class="form-card card">
            <h1>Restablecer Contraseña</h1>
            <p class="description">Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.</p>
            <div v-if="success" class="success-message">
                {{ success }}
            </div>
            <div v-if="error" class="error-message">{{ error }}</div>
            <form v-if="!success" @submit.prevent="handleForgot">
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
                <button type="submit" class="btn" :disabled="loading">
                    {{ loading ? 'Enviando...' : 'Enviar Enlace' }}
                </button>
            </form>
            <p class="form-footer">
                <router-link to="/login">Volver a iniciar sesión</router-link>
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { authService } from '../services/api'

const form = ref({
    gmail: ''
})

const loading = ref(false)
const error = ref(null)
const success = ref(null)

const handleForgot = async () => {
    try {
        loading.value = true
        error.value = null
        const response = await authService.forgotPassword(form.value.gmail)
        success.value = response.data.message
    } catch (err) {
        error.value = err.response?.data?.error || 'Error al procesar solicitud'
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
    margin-bottom: 1rem;
    color: #2c3e50;
}

.description {
    margin-bottom: 1.5rem;
    color: #666;
}

.form-footer {
    margin-top: 1rem;
    text-align: center;
}

.form-footer a {
    color: #3498db;
}
</style>
