<script setup>
import { inject, ref } from 'vue'

const emit = defineEmits(['aceptar', 'seguir'])
const toast = inject('toast')
const pensando = ref(false)

function responder() {
  if (pensando.value) return
  pensando.value = true
  toast('Respuesta ambigua. Escalando a soporte…', 1600)
  setTimeout(() => emit('seguir'), 1500)
}
</script>

<template>
  <main class="pantalla" style="justify-content: center; text-align: center">
    <div class="sticker entrar">🥺</div>
    <section class="caja entrar" style="display: grid; gap: 16px; animation-delay: 0.1s">
      <h1 class="titulo" style="font-size: clamp(24px, 7vw, 30px)">¿Confirmás que no querés no rechazar la invitación?</h1>
      <div class="fila-botones">
        <button class="btn btn-no" :disabled="pensando" @click="responder">Sí</button>
        <button class="btn btn-no" :disabled="pensando" @click="responder">No</button>
      </div>
    </section>
    <button class="btn btn-link" @click="emit('aceptar')">Ok, mejor voy</button>
  </main>
</template>

<style scoped>
.sticker { font-size: 96px; animation: rebote 1.2s ease-in-out infinite; filter: drop-shadow(0 0 18px #5cc8ff55); }
@keyframes rebote {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-10px) scale(1.06); }
}
</style>
