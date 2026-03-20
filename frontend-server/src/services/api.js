import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json'
    }
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export const authService = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getPerfil: () => api.get('/auth/perfil'),
    updatePerfil: (data) => api.put('/auth/perfil', data),
    forgotPassword: (gmail) => api.post('/auth/forgot-password', { gmail }),
    resetPassword: (token, password) => api.post('/auth/reset-password', { token, password })
}

export const eventosService = {
    getAll: () => api.get('/eventos'),
    getById: (id) => api.get(`/eventos/${id}`),
    getMyEventos: () => api.get('/eventos/mis-eventos'),
    create: (data) => api.post('/eventos', data),
    update: (id, data) => api.put(`/eventos/${id}`, data),
    delete: (id) => api.delete(`/eventos/${id}`),
    participar: (id, data) => api.post(`/eventos/${id}/participar`, data),
    getAsistentes: (id) => api.get(`/eventos/${id}/asistentes`),
    getCategorias: () => api.get('/eventos/categorias'),
    getLugares: () => api.get('/eventos/lugares')
}

export const adminService = {
    getDashboard: () => api.get('/admin/dashboard'),
    getUsuarios: () => api.get('/admin/usuarios'),
    createUsuario: (data) => api.post('/admin/usuarios', data),
    updateUsuario: (id, data) => api.put(`/admin/usuarios/${id}`, data),
    deleteUsuario: (id) => api.delete(`/admin/usuarios/${id}`),
    getCategorias: () => api.get('/admin/categorias'),
    createCategoria: (data) => api.post('/admin/categorias', data),
    updateCategoria: (id, data) => api.put(`/admin/categorias/${id}`, data),
    deleteCategoria: (id) => api.delete(`/admin/categorias/${id}`),
    getLugares: () => api.get('/admin/lugares'),
    createLugar: (data) => api.post('/admin/lugares', data),
    updateLugar: (id, data) => api.put(`/admin/lugares/${id}`, data),
    deleteLugar: (id) => api.delete(`/admin/lugares/${id}`),
    getAsistentes: () => api.get('/admin/asistentes'),
    deleteAsistente: (id) => api.delete(`/admin/asistentes/${id}`)
}

export default api
