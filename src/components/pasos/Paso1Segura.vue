<script setup>
import { inject, ref } from 'vue'

const emit = defineEmits(['aceptar', 'seguir'])
const toast = inject('toast')
const toques = ref(0)
const FRASES = ['¿Segura segura?', '¿Segura segura segura?']

function si() {
  if (toques.value < FRASES.length) {
    toast(FRASES[toques.value])
    toques.value++
    return
  }
  emit('seguir')
}
</script>

<template>
  <main class="pantalla" style="justify-content: center">
    <section class="caja modal entrar">
      <div class="tag">Confirmación requerida</div>
      <h1 class="titulo">¿Estás segura?</h1>
      <p class="lead">Pensalo bien. Hay asado.</p>
      <div class="fila">
        <button class="btn btn-si" style="flex: 3" @click="emit('aceptar')">No, quiero ir</button>
        <button class="btn btn-no chico" :style="{ transform: `scale(${1 - toques * 0.22})` }" @click="si">sí</button>
      </div>
    </section>
  </main>
</template>

<style scoped>
.modal { display: grid; gap: 14px; padding: 24px 20px; }
.fila { display: flex; gap: 10px; align-items: center; margin-top: 8px; }
.chico { flex: 1; font-size: 13px; padding: 10px; transition: transform 0.25s cubic-bezier(0.3, 1.6, 0.5, 1); }
</style>
