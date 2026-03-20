<template>
    <div class="container">
        <div v-if="loading" class="loading">Cargando...</div>
        <div v-else-if="error" class="error-message">{{ error }}</div>
        <div v-else-if="evento" class="evento-detalle">
            <div class="evento-header">
                <h1>{{ evento.nombre }}</h1>
                <div class="categorias">
                    <span v-for="cat in evento.categorias" :key="cat.id" class="categoria-tag">
                        {{ cat.nombre }}
                    </span>
                </div>
            </div>
            <div class="evento-content card">
                <div class="evento-info-grid">
                    <div class="info-item">
                        <strong>Fecha:</strong>
                        <span>{{ formatDate(evento.fecha) }}</span>
                    </div>
                    <div class="info-item">
                        <strong>Horario:</strong>
                        <span>{{ evento.horario || 'Por definir' }}</span>
                    </div>
                    <div class="info-item">
                        <strong>Lugar:</strong>
                        <span>{{ evento.lugar_direccion || 'Por definir' }}</span>
                    </div>
                    <div class="info-item">
                        <strong>Costo de Entrada:</strong>
                        <span>{{ formatCosto(evento.costo_entrada) }}</span>
                    </div>
                    <div class="info-item">
                        <strong>Aforo:</strong>
                        <span>{{ evento.asistentes_count }} / {{ evento.capacidad }}</span>
                    </div>
                    <div class="info-item">
                        <strong>Organizador:</strong>
                        <span>{{ evento.host_nombre }}</span>
                    </div>
                </div>
                <div v-if="evento.host_bio" class="host-bio">
                    <strong>Sobre el organizador:</strong>
                    <p>{{ evento.host_bio }}</p>
                </div>
                <div class="descripcion">
                    <strong>Descripción:</strong>
                    <p>{{ evento.descripcion || 'Sin descripción disponible.' }}</p>
                </div>
                <div class="acciones">
                    <router-link 
                        :to="`/eventos/${evento.id}/participar`" 
                        class="btn btn-success"
                    >
                        Participar en este Evento
                    </router-link>
                    <router-link to="/" class="btn btn-secondary">Volver</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { eventosService } from '../services/api'

const route = useRoute()
const evento = ref(null)
const loading = ref(true)
const error = ref(null)

const loadEvento = async () => {
    try {
        loading.value = true
        const response = await eventosService.getById(route.params.id)
        evento.value = response.data
    } catch (err) {
        error.value = 'Error al cargar el evento'
    } finally {
        loading.value = false
    }
}

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-MX', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

const formatCosto = (costo) => {
    return costo > 0 ? `$${parseFloat(costo).toFixed(2)}` : 'Gratis'
}

onMounted(loadEvento)
</script>

<style scoped>
.evento-header {
    margin-bottom: 1.5rem;
}

.evento-header h1 {
    color: #2c3e50;
    margin-bottom: 1rem;
}

.categorias {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.categoria-tag {
    background-color: #e8f4f8;
    color: #3498db;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.9rem;
}

.evento-content {
    padding: 2rem;
}

.evento-info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.info-item {
    padding: 0.75rem;
    background-color: #f8f9fa;
    border-radius: 4px;
}

.info-item strong {
    display: block;
    color: #666;
    font-size: 0.85rem;
    margin-bottom: 0.25rem;
}

.host-bio,
.descripcion {
    margin-bottom: 1.5rem;
}

.host-bio strong,
.descripcion strong {
    display: block;
    color: #2c3e50;
    margin-bottom: 0.5rem;
}

.acciones {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
}
</style>
