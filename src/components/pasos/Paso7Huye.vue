<script setup>
import { computed, ref } from 'vue'

const emit = defineEmits(['aceptar', 'seguir'])
const LIMITE = 12
const FRASES = ['Casi', 'Uy', 'Más rápido', 'Ni cerca', 'Esto es cardio', 'Seguí participando', 'Fallaste', 'Por poquito', 'Jajaja', 'No', 'Último aviso', 'Bueno…']
const saltos = ref(0)
const pos = ref(null)
const giro = ref(0)
const rastros = ref([])
let idRastro = 0

const rendido = computed(() => saltos.value >= LIMITE)
const escalaSi = computed(() => Math.min(1 + saltos.value * 0.07, 1.8))
const escalaNo = computed(() => Math.max(1 - saltos.value * 0.04, 0.6))
const frase = computed(() => (saltos.value ? FRASES[saltos.value - 1] : 'Último intento.'))

function huir(e) {
  if (rendido.value) return
  e.preventDefault()
  const btn = e.currentTarget.getBoundingClientRect()
  const id = idRastro++
  rastros.value.push({ id, x: btn.left, y: btn.top, w: btn.width, h: btn.height })
  setTimeout(() => (rastros.value = rastros.value.filter((r) => r.id !== id)), 650)
  const m = 16
  const maxX = window.innerWidth - btn.width - m
  const maxY = window.innerHeight - btn.height - m
  let x, y
  do {
    x = m + Math.random() * (maxX - m)
    y = m + Math.random() * (maxY - m)
  } while (Math.hypot(x - btn.left, y - btn.top) < 140)
  pos.value = { x, y }
  giro.value = (Math.random() - 0.5) * 70
  saltos.value++
}
function tocar(e) {
  if (!rendido.value) return huir(e)
  emit('seguir')
}
</script>

<template>
  <main class="pantalla" style="justify-content: center; text-align: center; overflow: hidden">
    <div class="tag">Nivel final</div>
    <h1 class="titulo" :key="frase">{{ frase }}</h1>
    <p class="lead">{{ rendido ? 'Está bien… si de verdad querés.' : 'Si lo alcanzás, rechazás. Si no, venís.' }}</p>
    <div style="display: grid; place-items: center; min-height: 200px">
      <button class="btn btn-si grande" :style="{ transform: `scale(${escalaSi})` }" @click="emit('aceptar')">Acepto</button>
    </div>
    <div v-for="r in rastros" :key="r.id" class="rastro" :style="{ left: `${r.x}px`, top: `${r.y}px`, width: `${r.w}px`, height: `${r.h}px` }"></div>
    <button
      class="btn btn-no fugitivo"
      :class="{ suelto: pos }"
      :style="pos ? { left: `${pos.x}px`, top: `${pos.y}px`, transform: `rotate(${giro}deg) scale(${escalaNo})` } : {}"
      @pointerenter="huir"
      @pointerdown="huir"
      @click="tocar"
    >
      {{ rendido ? 'Rechazar 😔' : 'Rechazar' }}
    </button>
  </main>
</template>

<style scoped>
.grande { padding: 18px 42px; font-size: 18px; transition: transform 0.35s cubic-bezier(0.3, 1.6, 0.5, 1); }
.fugitivo { align-self: center; width: 150px; }
.fugitivo.suelto {
  position: fixed;
  margin: 0;
  z-index: 10;
  transition: left 0.28s cubic-bezier(0.2, 1.4, 0.4, 1), top 0.28s cubic-bezier(0.2, 1.4, 0.4, 1), transform 0.28s;
  box-shadow: 0 0 18px #5cc8ff55;
  background: #070b14cc;
}
.rastro { position: fixed; border-radius: 14px; border: 1px solid var(--neon); box-shadow: 0 0 20px var(--neon); pointer-events: none; animation: desvanecer 0.65s ease-out forwards; }
@keyframes desvanecer { to { opacity: 0; transform: scale(1.4); } }
</style>
