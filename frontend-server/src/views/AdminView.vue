<template>
    <div class="container">
        <h1>Panel de Administración</h1>
        <div v-if="loading" class="loading">Cargando...</div>
        <div v-else>
            <div class="stats-grid">
                <div class="stat-card card">
                    <h3>Usuarios</h3>
                    <p class="stat-number">{{ stats.usuarios }}</p>
                </div>
                <div class="stat-card card">
                    <h3>Eventos</h3>
                    <p class="stat-number">{{ stats.eventos }}</p>
                </div>
                <div class="stat-card card">
                    <h3>Asistentes</h3>
                    <p class="stat-number">{{ stats.asistentes }}</p>
                </div>
            </div>

            <div class="admin-section">
                <h2>Gestionar Usuarios</h2>
                <div class="table-container card">
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Correo</th>
                                <th>Rol</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="user in usuarios" :key="user.id">
                                <td>{{ user.nombre }}</td>
                                <td>{{ user.gmail }}</td>
                                <td>{{ user.role }}</td>
                                <td>
                                    <button @click="deleteUsuario(user.id)" class="btn-small btn-danger">
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="admin-section">
                <h2>Gestionar Categorías</h2>
                <div class="form-row">
                    <input v-model="newCategoria" placeholder="Nueva categoría" />
                    <button @click="createCategoria" class="btn btn-success">Agregar</button>
                </div>
                <div class="tags-list">
                    <div v-for="cat in categorias" :key="cat.id" class="tag-item">
                        <span>{{ cat.nombre }}</span>
                        <button @click="deleteCategoria(cat.id)" class="btn-small btn-danger">X</button>
                    </div>
                </div>
            </div>

            <div class="admin-section">
                <h2>Gestionar Lugares</h2>
                <div class="form-row">
                    <input v-model="newLugar" placeholder="Nueva dirección" />
                    <button @click="createLugar" class="btn btn-success">Agregar</button>
                </div>
                <div class="lugares-list">
                    <div v-for="lugar in lugares" :key="lugar.id" class="lugar-item card">
                        <span>{{ lugar.direccion || 'Dirección ' + lugar.id }}</span>
                        <button @click="deleteLugar(lugar.id)" class="btn-small btn-danger">X</button>
                    </div>
                </div>
            </div>

            <div class="admin-section">
                <h2>Todos los Asistentes</h2>
                <div class="table-container card">
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Teléfono</th>
                                <th>Evento</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="asistente in asistentes" :key="asistente.id">
                                <td>{{ asistente.nombre }}</td>
                                <td>{{ asistente.email }}</td>
                                <td>{{ asistente.telefono || '-' }}</td>
                                <td>{{ asistente.evento_nombre }}</td>
                                <td>
                                    <button @click="deleteAsistente(asistente.id)" class="btn-small btn-danger">
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { adminService } from '../services/api'

const loading = ref(true)
const stats = ref({ usuarios: 0, eventos: 0, asistentes: 0 })
const usuarios = ref([])
const categorias = ref([])
const lugares = ref([])
const asistentes = ref([])
const newCategoria = ref('')
const newLugar = ref('')

const loadData = async () => {
    try {
        const [dashRes, usersRes, catsRes, lugRes, asisRes] = await Promise.all([
            adminService.getDashboard(),
            adminService.getUsuarios(),
            adminService.getCategorias(),
            adminService.getLugares(),
            adminService.getAsistentes()
        ])
        stats.value = dashRes.data
        usuarios.value = usersRes.data
        categorias.value = catsRes.data
        lugares.value = lugRes.data
        asistentes.value = asisRes.data
    } catch (err) {
        console.error(err)
    } finally {
        loading.value = false
    }
}

const createCategoria = async () => {
    if (!newCategoria.value.trim()) return
    try {
        await adminService.createCategoria({ nombre: newCategoria.value })
        newCategoria.value = ''
        const res = await adminService.getCategorias()
        categorias.value = res.data
    } catch (err) {
        alert('Error al crear categoría')
    }
}

const deleteCategoria = async (id) => {
    if (!confirm('¿Eliminar esta categoría?')) return
    try {
        await adminService.deleteCategoria(id)
        categorias.value = categorias.value.filter(c => c.id !== id)
    } catch (err) {
        alert('Error al eliminar categoría')
    }
}

const createLugar = async () => {
    if (!newLugar.value.trim()) return
    try {
        await adminService.createLugar({ direccion: newLugar.value })
        newLugar.value = ''
        const res = await adminService.getLugares()
        lugares.value = res.data
    } catch (err) {
        alert('Error al crear lugar')
    }
}

const deleteLugar = async (id) => {
    if (!confirm('¿Eliminar este lugar?')) return
    try {
        await adminService.deleteLugar(id)
        lugares.value = lugares.value.filter(l => l.id !== id)
    } catch (err) {
        alert('Error al eliminar lugar')
    }
}

const deleteUsuario = async (id) => {
    if (!confirm('¿Eliminar este usuario?')) return
    try {
        await adminService.deleteUsuario(id)
        usuarios.value = usuarios.value.filter(u => u.id !== id)
    } catch (err) {
        alert('Error al eliminar usuario')
    }
}

const deleteAsistente = async (id) => {
    if (!confirm('¿Eliminar este asistente?')) return
    try {
        await adminService.deleteAsistente(id)
        asistentes.value = asistentes.value.filter(a => a.id !== id)
    } catch (err) {
        alert('Error al eliminar asistente')
    }
}

onMounted(loadData)
</script>

<style scoped>
h1 {
    margin-bottom: 2rem;
    color: #2c3e50;
}

h2 {
    margin: 2rem 0 1rem;
    color: #2c3e50;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
}

.stat-card {
    text-align: center;
    padding: 1.5rem;
}

.stat-card h3 {
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
}

.stat-number {
    font-size: 2.5rem;
    font-weight: bold;
    color: #3498db;
}

.table-container {
    overflow-x: auto;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th, td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #eee;
}

th {
    background-color: #f8f9fa;
    font-weight: 600;
}

.form-row {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
}

.form-row input {
    flex: 1;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.tags-list,
.lugares-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.tag-item,
.lugar-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: #f8f9fa;
    border-radius: 20px;
}

.lugar-item {
    padding: 0.75rem 1rem;
}

.btn-small {
    padding: 0.25rem 0.5rem;
    font-size: 0.8rem;
    border-radius: 4px;
}

.btn-danger {
    background-color: #e74c3c;
    color: white;
    border: none;
    cursor: pointer;
}

.btn-danger:hover {
    background-color: #c0392b;
}
</style>
