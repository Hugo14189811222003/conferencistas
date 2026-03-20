<template>
    <div class="container">
        <div class="form-card card">
            <h1>Editar Evento</h1>
            <div v-if="loading" class="loading">Cargando...</div>
            <div v-else-if="error" class="error-message">{{ error }}</div>
            <form v-else @submit.prevent="handleUpdate">
                <div class="form-group">
                    <label for="nombre">Nombre del Evento *</label>
                    <input
                        type="text"
                        id="nombre"
                        v-model="form.nombre"
                        required
                    />
                </div>
                <div class="form-group">
                    <label for="descripcion">Descripción</label>
                    <textarea
                        id="descripcion"
                        v-model="form.descripcion"
                        rows="4"
                    ></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="fecha">Fecha *</label>
                        <input type="date" id="fecha" v-model="form.fecha" required />
                    </div>
                    <div class="form-group">
                        <label for="horario">Horario</label>
                        <input type="time" id="horario" v-model="form.horario" />
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
                    <button type="submit" class="btn btn-success" :disabled="saving">
                        {{ saving ? 'Guardando...' : 'Guardar Cambios' }}
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
const loading = ref(true)
const saving = ref(false)
const error = ref(null)

const loadData = async () => {
    try {
        const [eventoResponse, catResponse, lugResponse] = await Promise.all([
            eventosService.getById(eventoId),
            eventosService.getCategorias(),
            eventosService.getLugares()
        ])
        
        const evento = eventoResponse.data
        form.value = {
            nombre: evento.nombre,
            descripcion: evento.descripcion || '',
            fecha: evento.fecha,
            horario: evento.horario || '',
            capacidad: evento.capacidad,
            costo_entrada: evento.costo_entrada || 0,
            lugar_id: evento.lugar_id,
            categorias: evento.categorias.map(c => c.id)
        }
        
        categorias.value = catResponse.data
        lugares.value = lugResponse.data
    } catch (err) {
        error.value = 'Error al cargar datos'
    } finally {
        loading.value = false
    }
}

const handleUpdate = async () => {
    try {
        saving.value = true
        error.value = null
        await eventosService.update(eventoId, form.value)
        router.push(`/eventos/${eventoId}`)
    } catch (err) {
        error.value = err.response?.data?.error || 'Error al actualizar evento'
    } finally {
        saving.value = false
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
