<script setup>
import { onMounted } from 'vue'
import confetti from 'canvas-confetti'
import { partesFecha, urlCalendario, urlMaps } from '../payload.js'

const props = defineProps({ inv: Object, estado: String })
const f = partesFecha(props.inv.d)

onMounted(() => {
  const colores = ['#5cc8ff', '#ffffff', '#3a7bff', '#b8ecff']
  const fin = Date.now() + 1800
  ;(function lluvia() {
    confetti({ particleCount: 5, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors: colores })
    confetti({ particleCount: 5, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors: colores })
    if (Date.now() < fin) requestAnimationFrame(lluvia)
  })()
})
</script>

<template>
  <main class="pantalla entrar" style="justify-content: center; text-align: center">
    <div class="tag">Respuesta registrada</div>
    <h1 class="titulo">Excelente decisión.</h1>
    <p class="lead">El chofer ha sido notificado.</p>
    <div class="caja">
      <b>{{ inv.l }}</b><br />
      <span style="color: var(--tx2)">{{ f.texto }} · {{ f.hora }}</span>
    </div>
    <a class="btn btn-si" :href="urlCalendario(inv)" target="_blank" rel="noopener">Agregar al calendario</a>
    <a class="btn btn-no" :href="urlMaps(inv)" target="_blank" rel="noopener">Ver ubicación</a>
    <p v-if="estado === 'enviando'" class="nota">Enviando tu respuesta…</p>
    <p v-else-if="estado !== 'ok' && estado !== 'pendiente'" class="nota">No pude avisar automáticamente. Mandale una captura de esta pantalla a quien te invitó.</p>
  </main>
</template>

<style scoped>
.nota { font-size: 13px; color: var(--tx2); margin: 0; }
</style>
