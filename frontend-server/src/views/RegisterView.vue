<template>
    <div class="container">
        <div class="form-card card">
            <h1>Crear Cuenta</h1>
            <div v-if="error" class="error-message">{{ error }}</div>
            <form @submit.prevent="handleRegister">
                <div class="form-group">
                    <label for="nombre">Nombre Completo</label>
                    <input
                        type="text"
                        id="nombre"
                        v-model="form.nombre"
                        required
                        placeholder="Tu nombre"
                    />
                </div>
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
                        minlength="6"
                        placeholder="Mínimo 6 caracteres"
                    />
                </div>
                <div class="form-group">
                    <label for="bio">Biografía (opcional)</label>
                    <textarea
                        id="bio"
                        v-model="form.bio"
                        rows="3"
                        placeholder="Cuéntanos sobre ti..."
                    ></textarea>
                </div>
                <button type="submit" class="btn" :disabled="loading">
                    {{ loading ? 'Creando cuenta...' : 'Crear Cuenta' }}
                </button>
            </form>
            <p class="form-footer">
                ¿Ya tienes cuenta? <router-link to="/login">Inicia sesión</router-link>
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
    nombre: '',
    gmail: '',
    password: '',
    bio: ''
})

const loading = ref(false)
const error = ref(null)

const handleRegister = async () => {
    try {
        loading.value = true
        error.value = null
        await authStore.register(form.value)
        router.push('/dashboard')
    } catch (err) {
        error.value = err.response?.data?.error || 'Error al crear cuenta'
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

textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    font-family: inherit;
    resize: vertical;
}

textarea:focus {
    outline: none;
    border-color: #3498db;
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
