<script setup>
import { inject, ref } from 'vue'

const emit = defineEmits(['aceptar', 'seguir'])
const toast = inject('toast')
const OPCIONES = [
  ['Ir a la fiesta', 'Necesaria'],
  ['Comer asado', 'Necesaria'],
  ['Conocer a los enanitos', 'Esencial'],
  ['Escuchar música en vivo', 'Obligatoria'],
  ['Viajar con chofer personal', 'Incluida, sin costo'],
]
const temblando = ref(-1)
const guardando = ref(false)

function intentar(i) {
  temblando.value = -1
  requestAnimationFrame(() => (temblando.value = i))
  toast('Esta opción es necesaria para el funcionamiento de la fiesta.')
}
function guardar() {
  if (guardando.value) return
  guardando.value = true
  toast('Preferencias guardadas: vas a la fiesta 🎉', 1800)
  setTimeout(() => emit('seguir'), 1900)
}
</script>

<template>
  <main class="pantalla" style="justify-content: flex-end">
    <section class="caja entrar banner">
      <div class="tag">Tu privacidad nos importa (poco)</div>
      <p class="texto">Usamos enanitos propios y de terceros para mejorar tu experiencia. Podés gestionar tus preferencias.</p>
      <div v-for="(o, i) in OPCIONES" :key="o[0]" class="opcion" :class="{ temblar: temblando === i }" @click="intentar(i)">
        <div>
          <b>{{ o[0] }}</b><small>{{ o[1] }}</small>
        </div>
        <span class="switch" role="switch" aria-checked="true" aria-disabled="true"><i></i></span>
      </div>
      <div class="fila-botones" style="margin-top: 6px">
        <button class="btn btn-si" @click="emit('aceptar')">Aceptar todo</button>
        <button class="btn btn-no" style="font-size: 13px" :disabled="guardando" @click="guardar">Guardar preferencias</button>
      </div>
    </section>
  </main>
</template>

<style scoped>
.banner { display: grid; gap: 10px; }
.texto { margin: 0; font-size: 14px; color: var(--tx2); }
.opcion { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--line); cursor: pointer; }
.opcion b { display: block; font-weight: 600; font-size: 15px; }
.opcion small { color: var(--tx2); font-size: 12px; }
.switch { position: relative; flex: none; width: 44px; height: 24px; border-radius: 99px; background: var(--neon); box-shadow: 0 0 12px #5cc8ff88; opacity: 0.85; }
.switch i { position: absolute; right: 3px; top: 3px; width: 18px; height: 18px; border-radius: 50%; background: #04101f; }
.switch::after { content: '🔒'; position: absolute; left: -22px; top: 2px; font-size: 13px; }
</style>
