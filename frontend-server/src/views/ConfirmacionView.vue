<template>
    <div class="container">
        <div class="confirmacion-card card">
            <div class="confirmacion-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="80" height="80">
                    <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" />
                </svg>
            </div>
            <h1>¡Registro Exitoso!</h1>
            <p>Tu confirmación ha sido enviada a tu correo electrónico.</p>
            <p>Gracias por registrarte. Te esperamos en el evento.</p>
            <div class="acciones">
                <router-link to="/" class="btn">Ver Más Eventos</router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
</script>

<style scoped>
.confirmacion-card {
    max-width: 500px;
    margin: 3rem auto;
    text-align: center;
    padding: 3rem;
}

.confirmacion-icon {
    color: #27ae60;
    margin-bottom: 1.5rem;
}

h1 {
    color: #2c3e50;
    margin-bottom: 1rem;
}

p {
    color: #666;
    margin-bottom: 0.5rem;
}

.acciones {
    margin-top: 2rem;
}
</style>
