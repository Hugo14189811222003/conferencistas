<template>
    <div class="container">
        <div class="form-card card">
            <h1>Crear Nuevo Evento</h1>
            <div v-if="error" class="error-message">{{ error }}</div>
            <form @submit.prevent="handleCreate">
                <div class="form-group">
                    <label for="nombre">Nombre del Evento *</label>
                    <input
                        type="text"
                        id="nombre"
                        v-model="form.nombre"
                        required
                        placeholder="Nombre del evento"
                    />
                </div>
                <div class="form-group">
                    <label for="descripcion">Descripción</label>
                    <textarea
                        id="descripcion"
                        v-model="form.descripcion"
                        rows="4"
                        placeholder="Describe tu evento..."
                    ></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="fecha">Fecha *</label>
                        <input
                            type="date"
                            id="fecha"
                            v-model="form.fecha"
                            required
                        />
                    </div>
                    <div class="form-group">
                        <label for="horario">Horario</label>
                        <input
                            type="time"
                            id="horario"
                            v-model="form.horario"
                        />
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="capacidad">Capacidad *</label>
                        <input
                            type="number"
                            id="capacidad"
                            v-model.number="form.capacidad"
                            required
                            min="1"
                            placeholder="Número de asistentes"
                        />
                    </div>
                    <div class="form-group">
                        <label for="costo_entrada">Costo de Entrada</label>
                        <input
                            type="number"
                            id="costo_entrada"
                            v-model.number="form.costo_entrada"
                            min="0"
                            step="0.01"
                            placeholder="0 para gratis"
                        />
                    </div>
                </div>
                <div class="form-group">
                    <label for="lugar_id">Lugar</label>
                    <select id="lugar_id" v-model="form.lugar_id">
                        <option :value="null">Seleccionar lugar...</option>
                        <option v-for="lugar in lugares" :key="lugar.id" :value="lugar.id">
                            {{ lugar.direccion || 'Lugar ' + lugar.id }}
                        </option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Categorías</label>
                    <div class="categorias-checkboxes">
                        <label v-for="cat in categorias" :key="cat.id" class="checkbox-label">
                            <input
                                type="checkbox"
                                :value="cat.id"
                                v-model="form.categorias"
                            />
                            {{ cat.nombre }}
                        </label>
                    </div>
                </div>
                <div class="acciones">
                    <button type="submit" class="btn btn-success" :disabled="loading">
                        {{ loading ? 'Creando...' : 'Crear Evento' }}
                    </button>
                    <router-link to="/dashboard" class="btn btn-secondary">
                        Cancelar
                    </router-link>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { eventosService } from '../services/api'

const router = useRouter()

const form = ref({
    nombre: '',
    descripcion: '',
    fecha: '',
    horario: '',
    capacidad: 100,
    costo_entrada: 0,
    lugar_id: null,
    categorias: []
})

const categorias = ref([])
const lugares = ref([])
const loading = ref(false)
const error = ref(null)

const loadData = async () => {
    try {
        const [catResponse, lugResponse] = await Promise.all([
            eventosService.getCategorias(),
            eventosService.getLugares()
        ])
        categorias.value = catResponse.data
        lugares.value = lugResponse.data
    } catch (err) {
        error.value = 'Error al cargar datos'
    }
}

const handleCreate = async () => {
    try {
        loading.value = true
        error.value = null
        const response = await eventosService.create(form.value)
        router.push(`/eventos/${response.data.id}`)
    } catch (err) {
        error.value = err.response?.data?.error || 'Error al crear evento'
    } finally {
        loading.value = false
    }
}

onMounted(loadData)
</script>

<style scoped>
.form-card {
    max-width: 700px;
    margin: 2rem auto;
}

h1 {
    margin-bottom: 1.5rem;
    color: #2c3e50;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-family: inherit;
    resize: vertical;
}

textarea:focus,
input:focus,
select:focus {
    outline: none;
    border-color: #3498db;
}

.categorias-checkboxes {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    padding: 1rem;
    background-color: #f8f9fa;
    border-radius: 4px;
}

.checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
}

.checkbox-label input {
    width: auto;
}

.acciones {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
}
</style>
