<script setup>
import { provide, ref, shallowRef } from 'vue'
import { leerInvitacion } from './payload.js'
import { avisar } from './aviso.js'
import Invitacion from './components/Invitacion.vue'
import Aceptado from './components/Aceptado.vue'
import Rechazado from './components/Rechazado.vue'
import Paso1Segura from './components/pasos/Paso1Segura.vue'
import Paso2Confusa from './components/pasos/Paso2Confusa.vue'
import Paso3Preferencias from './components/pasos/Paso3Preferencias.vue'
import Paso4Captcha from './components/pasos/Paso4Captcha.vue'
import Paso5Terminal from './components/pasos/Paso5Terminal.vue'
import Paso6Carga from './components/pasos/Paso6Carga.vue'
import Paso7Huye from './components/pasos/Paso7Huye.vue'

const PASOS = [Paso1Segura, Paso2Confusa, Paso3Preferencias, Paso4Captcha, Paso5Terminal, Paso6Carga, Paso7Huye]
const inv = leerInvitacion()
const clave = inv ? `convocatoria:${inv.k || inv.n}` : ''

function leerGuardada() {
  if (!inv || inv.t) return null
  try { return localStorage.getItem(clave) } catch { return null }
}
function guardar(r) {
  if (inv.t) return
  try { localStorage.setItem(clave, r) } catch {}
}

const guardada = leerGuardada()
const pantalla = ref(!inv ? 'invalida' : guardada === 'ACEPTÓ' ? 'aceptado' : guardada === 'RECHAZÓ' ? 'rechazado' : 'invitacion')
const paso = ref(0)
const pasoMax = ref(0)
const estadoAviso = ref(guardada ? 'ok' : 'pendiente')

const toast = shallowRef(null)
let toastTimer
function avisarEnPantalla(texto, ms = 2600) {
  toast.value = texto
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (toast.value = null), ms)
}
provide('toast', avisarEnPantalla)
provide('inv', inv)

async function responder(respuesta) {
  guardar(respuesta)
  estadoAviso.value = 'enviando'
  const r = await avisar(inv, `${respuesta} ${respuesta === 'ACEPTÓ' ? '✅' : '❌'}`, pasoMax.value)
  estadoAviso.value = r.ok ? 'ok' : r.motivo
}

function aceptar() {
  pantalla.value = 'aceptado'
  responder('ACEPTÓ')
}
function rechazarFinal() {
  pantalla.value = 'rechazado'
  responder('RECHAZÓ')
}
function seguir() {
  if (paso.value >= PASOS.length) return rechazarFinal()
  paso.value++
  pasoMax.value = Math.max(pasoMax.value, paso.value)
  pantalla.value = 'rechazo'
}
</script>

<template>
  <main v-if="pantalla === 'invalida'" class="pantalla entrar" style="justify-content: center; text-align: center">
    <div class="tag">Error 404</div>
    <h1 class="titulo">Esta invitación no existe</h1>
    <p class="lead">O el enlace llegó incompleto. Pedile a quien te lo mandó que lo vuelva a enviar.</p>
  </main>
  <Invitacion v-else-if="pantalla === 'invitacion'" :inv="inv" @aceptar="aceptar" @rechazar="seguir" />
  <component :is="PASOS[paso - 1]" v-else-if="pantalla === 'rechazo'" :key="paso" @aceptar="aceptar" @seguir="seguir" />
  <Aceptado v-else-if="pantalla === 'aceptado'" :inv="inv" :estado="estadoAviso" />
  <Rechazado v-else-if="pantalla === 'rechazado'" :estado="estadoAviso" @cambiar="aceptar" />
  <div v-if="toast" class="aviso-flotante" role="status">{{ toast }}</div>
</template>
