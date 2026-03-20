<template>
    <div class="container">
        <div class="dashboard-header">
            <h1>Mi Panel</h1>
            <router-link to="/dashboard/eventos/new" class="btn btn-success">
                Crear Nuevo Evento
            </router-link>
        </div>
        <div v-if="loading" class="loading">Cargando...</div>
        <div v-else-if="error" class="error-message">{{ error }}</div>
        <div v-else>
            <div class="mis-eventos">
                <h2>Mis Eventos</h2>
                <div v-if="eventos.length === 0" class="no-eventos">
                    <p>Aún no has creado ningún evento.</p>
                    <router-link to="/dashboard/eventos/new" class="btn">
                        Crear mi primer evento
                    </router-link>
                </div>
                <div v-else class="eventos-list">
                    <div v-for="evento in eventos" :key="evento.id" class="evento-item card">
                        <div class="evento-info">
                            <h3>{{ evento.nombre }}</h3>
                            <p><strong>Fecha:</strong> {{ formatDate(evento.fecha) }}</p>
                            <p><strong>Asistentes:</strong> {{ evento.asistentes_count }} / {{ evento.capacidad }}</p>
                            <div class="categorias">
                                <span v-for="cat in evento.categorias" :key="cat.id" class="categoria-tag">
                                    {{ cat.nombre }}
                                </span>
                            </div>
                        </div>
                        <div class="evento-acciones">
                            <router-link :to="`/eventos/${evento.id}`" class="btn btn-secondary">
                                Ver
                            </router-link>
                            <router-link :to="`/dashboard/eventos/${evento.id}/edit`" class="btn">
                                Editar
                            </router-link>
                            <button @click="confirmDelete(evento.id)" class="btn btn-danger">
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="perfil-section card">
                <h2>Mi Perfil</h2>
                <div v-if="success" class="success-message">{{ success }}</div>
                <form @submit.prevent="handleUpdatePerfil">
                    <div class="form-group">
                        <label for="nombre">Nombre</label>
                        <input type="text" id="nombre" v-model="perfil.nombre" required />
                    </div>
                    <div class="form-group">
                        <label for="bio">Biografía</label>
                        <textarea id="bio" v-model="perfil.bio" rows="3"></textarea>
                    </div>
                    <button type="submit" class="btn">Guardar Cambios</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { eventosService } from '../services/api'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const eventos = ref([])
const loading = ref(true)
const error = ref(null)
const success = ref(null)

const perfil = ref({
    nombre: '',
    bio: ''
})

const loadData = async () => {
    try {
        loading.value = true
        const response = await eventosService.getMyEventos()
        eventos.value = response.data
        await authStore.getPerfil()
        perfil.value.nombre = authStore.user.nombre || ''
        perfil.value.bio = authStore.user.bio || ''
    } catch (err) {
        error.value = 'Error al cargar datos'
    } finally {
        loading.value = false
    }
}

const handleUpdatePerfil = async () => {
    try {
        success.value = null
        await authStore.updatePerfil(perfil.value)
        success.value = 'Perfil actualizado exitosamente'
        setTimeout(() => { success.value = null }, 3000)
    } catch (err) {
        error.value = 'Error al actualizar perfil'
    }
}

const confirmDelete = async (id) => {
    if (confirm('¿Estás seguro de eliminar este evento?')) {
        try {
            await eventosService.delete(id)
            eventos.value = eventos.value.filter(e => e.id !== id)
        } catch (err) {
            alert('Error al eliminar el evento')
        }
    }
}

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

onMounted(loadData)
</script>

<style scoped>
.dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.dashboard-header h1 {
    color: #2c3e50;
}

.mis-eventos {
    margin-bottom: 3rem;
}

.mis-eventos h2,
.perfil-section h2 {
    color: #2c3e50;
    margin-bottom: 1rem;
}

.no-eventos {
    text-align: center;
    padding: 2rem;
    background: white;
    border-radius: 8px;
}

.no-eventos p {
    margin-bottom: 1rem;
    color: #666;
}

.eventos-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.evento-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
}

.evento-info {
    flex: 1;
}

.evento-info h3 {
    color: #2c3e50;
    margin-bottom: 0.5rem;
}

.evento-info p {
    margin: 0.25rem 0;
    font-size: 0.9rem;
    color: #666;
}

.categorias {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.5rem;
}

.categoria-tag {
    background-color: #e8f4f8;
    color: #3498db;
    padding: 0.15rem 0.5rem;
    border-radius: 15px;
    font-size: 0.75rem;
}

.evento-acciones {
    display: flex;
    gap: 0.5rem;
}

.perfil-section {
    padding: 1.5rem;
}

textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-family: inherit;
    resize: vertical;
}
</style>
