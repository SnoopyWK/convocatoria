<script setup>
defineProps({ estado: String })
defineEmits(['cambiar'])
</script>

<template>
  <main class="pantalla entrar" style="justify-content: center; text-align: center">
    <div class="sticker">😢</div>
    <div class="tag">Rechazo registrado</div>
    <h1 class="titulo">Lo lograste.</h1>
    <p class="lead">El chofer está llorando. Los enanitos no quieren hablar del tema.</p>
    <button class="btn btn-si" @click="$emit('cambiar')">Cambié de opinión</button>
    <p v-if="estado !== 'ok' && estado !== 'enviando' && estado !== 'pendiente'" class="nota">No pude avisar automáticamente.</p>
  </main>
</template>

<style scoped>
.sticker { font-size: 84px; animation: llorar 1.6s ease-in-out infinite; }
@keyframes llorar {
  0%, 100% { transform: rotate(-6deg); }
  50% { transform: rotate(6deg) translateY(4px); }
}
.nota { font-size: 13px; color: var(--tx2); margin: 0; }
</style>
