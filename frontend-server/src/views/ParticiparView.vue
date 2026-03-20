<template>
    <div class="container">
        <div class="form-card card">
            <h1>Registrarme como Asistente</h1>
            <div v-if="error" class="error-message">{{ error }}</div>
            <form @submit.prevent="handleParticipar">
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
                    <label for="email">Correo Electrónico</label>
                    <input
                        type="email"
                        id="email"
                        v-model="form.email"
                        required
                        placeholder="correo@ejemplo.com"
                    />
                </div>
                <div class="form-group">
                    <label for="telefono">Número de Teléfono (opcional)</label>
                    <input
                        type="tel"
                        id="telefono"
                        v-model="form.telefono"
                        placeholder="5551234567"
                    />
                </div>
                <div class="acciones">
                    <button type="submit" class="btn btn-success" :disabled="loading">
                        {{ loading ? 'Registrando...' : 'Confirmar Registro' }}
                    </button>
                    <router-link :to="`/eventos/${eventoId}`" class="btn btn-secondary">
                        Cancelar
                    </router-link>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { eventosService } from '../services/api'

const route = useRoute()
const router = useRouter()
const eventoId = route.params.id

const form = ref({
    nombre: '',
    email: '',
    telefono: ''
})

const loading = ref(false)
const error = ref(null)

const handleParticipar = async () => {
    try {
        loading.value = true
        error.value = null
        await eventosService.participar(eventoId, form.value)
        router.push(`/eventos/${eventoId}/confirmacion`)
    } catch (err) {
        error.value = err.response?.data?.error || 'Error al registrarse'
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.form-card {
    max-width: 500px;
    margin: 2rem auto;
}

h1 {
    margin-bottom: 1.5rem;
    color: #2c3e50;
}

.acciones {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
}
</style>
