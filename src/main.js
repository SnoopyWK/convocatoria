import { createApp } from 'vue'
import App from './App.vue'
import { leerInvitacion } from './payload.js'
import './estilo.css'

leerInvitacion().then((inv) => createApp(App, { inv }).mount('#app'))
