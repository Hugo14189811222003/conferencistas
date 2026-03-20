<template>
    <div class="container">
        <h1>Eventos</h1>
        <div v-if="loading" class="loading">Cargando eventos...</div>
        <div v-else-if="error" class="error-message">{{ error }}</div>
        <div v-else class="eventos-grid">
            <div v-for="evento in eventos" :key="evento.id" class="evento-card card">
                <h2>{{ evento.nombre }}</h2>
                <p class="descripcion">{{ truncateDescripcion(evento.descripcion) }}</p>
                <div class="evento-info">
                    <p><strong>Fecha:</strong> {{ formatDate(evento.fecha) }}</p>
                    <p><strong>Horario:</strong> {{ evento.horario || 'Por definir' }}</p>
                    <p><strong>Lugar:</strong> {{ evento.lugar_direccion || 'Por definir' }}</p>
                    <p><strong>Costo:</strong> {{ formatCosto(evento.costo_entrada) }}</p>
                    <p><strong>Aforo:</strong> {{ evento.asistentes_count }} / {{ evento.capacidad }}</p>
                    <p><strong>Organizador:</strong> {{ evento.host_nombre }}</p>
                </div>
                <div class="categorias">
                    <span v-for="cat in evento.categorias" :key="cat.id" class="categoria-tag">
                        {{ cat.nombre }}
                    </span>
                </div>
                <router-link :to="`/eventos/${evento.id}`" class="btn">Ver Detalles</router-link>
            </div>
        </div>
        <div v-if="!loading && eventos.length === 0" class="no-eventos">
            <p>No hay eventos disponibles.</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { eventosService } from '../services/api'

const eventos = ref([])
const loading = ref(true)
const error = ref(null)

const loadEventos = async () => {
    try {
        loading.value = true
        const response = await eventosService.getAll()
        eventos.value = response.data
    } catch (err) {
        error.value = 'Error al cargar eventos'
    } finally {
        loading.value = false
    }
}

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

const formatCosto = (costo) => {
    return costo > 0 ? `$${parseFloat(costo).toFixed(2)}` : 'Gratis'
}

const truncateDescripcion = (desc) => {
    if (!desc) return ''
    return desc.length > 150 ? desc.substring(0, 150) + '...' : desc
}

onMounted(loadEventos)
</script>

<style scoped>
h1 {
    margin-bottom: 2rem;
    color: #2c3e50;
}

.eventos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
}

.evento-card {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.evento-card h2 {
    color: #2c3e50;
    font-size: 1.25rem;
}

.descripcion {
    color: #666;
    flex-grow: 1;
}

.evento-info p {
    margin: 0.25rem 0;
    font-size: 0.9rem;
}

.categorias {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: 0.5rem 0;
}

.categoria-tag {
    background-color: #e8f4f8;
    color: #3498db;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
}

.no-eventos {
    text-align: center;
    padding: 3rem;
    color: #666;
}
</style>
