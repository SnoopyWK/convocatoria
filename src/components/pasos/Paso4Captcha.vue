<script setup>
import { inject, ref } from 'vue'

const emit = defineEmits(['aceptar', 'seguir'])
const toast = inject('toast')
const POOL = ['🌳', '🍖', '🚗', '🎸', '🏡', '🌙', '🔥', '🥤', '🎈', '🌵', '🐕', '🪩', '🍕', '🚦', '🌻', '🎤', '🛻', '🍉']
const celdas = ref([])
const marcadas = ref(new Set())
const fallos = ref(0)
const temblar = ref(false)

function mezclar() {
  celdas.value = [...POOL].sort(() => Math.random() - 0.5).slice(0, 9)
  marcadas.value = new Set()
}
function marcar(i) {
  const s = new Set(marcadas.value)
  s.has(i) ? s.delete(i) : s.add(i)
  marcadas.value = s
}
function verificar() {
  fallos.value++
  temblar.value = false
  requestAnimationFrame(() => (temblar.value = true))
  toast(fallos.value === 1 ? 'Inténtelo de nuevo.' : 'Verificación fallida. Intente con más enanitos.')
  mezclar()
}
function sinEnanitos() {
  toast('Exacto. Están todos en la fiesta. Esperándote.', 2200)
  setTimeout(() => emit('seguir'), 2200)
}
mezclar()
</script>

<template>
  <main class="pantalla" style="justify-content: center">
    <section class="caja entrar captcha" :class="{ temblar }">
      <div class="cabeza">
        <small>Tus preferencias indican que vas. Para rechazar igual, verificá que sos humana.</small>
        <p>Seleccioná todas las imágenes con un <b>enanito</b></p>
      </div>
      <div class="grilla">
        <button v-for="(c, i) in celdas" :key="c + i" class="celda" :class="{ on: marcadas.has(i) }" @click="marcar(i)">{{ c }}</button>
      </div>
      <div class="pie">
        <button v-if="fallos >= 2" class="btn btn-link" @click="sinEnanitos">No veo ningún enanito</button>
        <span v-else></span>
        <button class="btn btn-si" style="padding: 11px 18px" @click="verificar">Verificar</button>
      </div>
    </section>
    <button class="btn btn-link" @click="emit('aceptar')">Mejor acepto</button>
  </main>
</template>

<style scoped>
.captcha { display: grid; gap: 12px; padding: 12px; }
.cabeza { background: #1d4f8a; border-radius: 10px; padding: 14px; }
.cabeza small { display: block; color: #cfe6ff; font-size: 12px; margin-bottom: 6px; }
.cabeza p { margin: 0; font-size: 18px; }
.grilla { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
.celda { aspect-ratio: 1; border-radius: 8px; background: #ffffff10; font-size: clamp(30px, 10vw, 40px); transition: transform 0.15s, box-shadow 0.15s; }
.celda.on { transform: scale(0.88); box-shadow: inset 0 0 0 3px var(--neon); }
.pie { display: flex; justify-content: space-between; align-items: center; }
</style>
