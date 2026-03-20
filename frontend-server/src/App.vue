<template>
    <div id="app">
        <nav class="navbar">
            <div class="container">
                <router-link to="/" class="logo">Conferencistas</router-link>
                <div class="nav-links">
                    <router-link to="/">Eventos</router-link>
                    <template v-if="isAuthenticated">
                        <router-link to="/dashboard">Mi Panel</router-link>
                        <router-link v-if="isAdmin" to="/admin">Admin</router-link>
                        <button @click="logout" class="btn-link">Cerrar Sesión</button>
                    </template>
                    <template v-else>
                        <router-link to="/login">Iniciar Sesión</router-link>
                        <router-link to="/register">Registrarse</router-link>
                    </template>
                </div>
            </div>
        </nav>
        <main class="main-content">
            <router-view />
        </main>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const isAdmin = computed(() => authStore.isAdmin)

const logout = () => {
    authStore.logout()
    router.push('/')
}
</script>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background-color: #f5f5f5;
    color: #333;
    line-height: 1.6;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.navbar {
    background-color: #2c3e50;
    color: white;
    padding: 1rem 0;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.navbar .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: white;
    text-decoration: none;
}

.nav-links {
    display: flex;
    gap: 1.5rem;
    align-items: center;
}

.nav-links a {
    color: white;
    text-decoration: none;
    transition: opacity 0.2s;
}

.nav-links a:hover {
    opacity: 0.8;
}

.btn-link {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 1rem;
    font-family: inherit;
    transition: opacity 0.2s;
}

.btn-link:hover {
    opacity: 0.8;
}

.main-content {
    padding: 2rem 0;
    min-height: calc(100vh - 80px);
}

.btn {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    text-decoration: none;
    font-size: 1rem;
    transition: background-color 0.2s;
}

.btn:hover {
    background-color: #2980b9;
}

.btn-secondary {
    background-color: #95a5a6;
}

.btn-secondary:hover {
    background-color: #7f8c8d;
}

.btn-danger {
    background-color: #e74c3c;
}

.btn-danger:hover {
    background-color: #c0392b;
}

.btn-success {
    background-color: #27ae60;
}

.btn-success:hover {
    background-color: #229954;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
}

.form-group input,
.form-group textarea,
.form-group select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
    outline: none;
    border-color: #3498db;
}

.error-message {
    background-color: #fee;
    border: 1px solid #fcc;
    color: #c00;
    padding: 0.75rem;
    border-radius: 4px;
    margin-bottom: 1rem;
}

.success-message {
    background-color: #efe;
    border: 1px solid #cfc;
    color: #060;
    padding: 0.75rem;
    border-radius: 4px;
    margin-bottom: 1rem;
}

.card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    padding: 1.5rem;
}

.loading {
    text-align: center;
    padding: 2rem;
    color: #666;
}
</style>
