<script setup>
import { computed } from 'vue'
import { partesFecha, urlMaps } from '../payload.js'

const props = defineProps({ inv: Object })
defineEmits(['aceptar', 'rechazar'])
const fecha = computed(() => partesFecha(props.inv.d))
</script>

<template>
  <main class="pantalla">
    <div class="tag entrar">Convocatoria oficial</div>
    <h1 class="titulo entrar" style="animation-delay: 0.08s">{{ inv.h || `Señorita ${inv.n}:` }}</h1>
    <p class="lead entrar" style="animation-delay: 0.16s">{{ inv.s || 'Se ha determinado que la fiesta no funciona sin usted.' }}</p>

    <section class="caja entrar datos" style="animation-delay: 0.24s">
      <div class="dato"><span class="ico">📍</span><div><b>{{ inv.l }}</b><small v-if="inv.z">{{ inv.z }}</small></div></div>
      <div class="dato"><span class="ico">🗓</span><div><b>{{ fecha.texto }}</b><small>{{ fecha.hora }}</small></div></div>
      <a class="mapa" :href="urlMaps(inv)" target="_blank" rel="noopener">↗ Ver ubicación</a>
    </section>

    <ul class="extras">
      <li v-for="(x, i) in inv.x" :key="i" class="entrar" :style="{ animationDelay: `${0.32 + i * 0.08}s` }">
        <span class="nombre">{{ x[0] }}</span><i v-if="x[1]"> — {{ x[1] }}</i>
      </li>
    </ul>

    <div class="fila-botones entrar" style="animation-delay: 0.7s">
      <button class="btn btn-si latir" @click="$emit('aceptar')">Acepto</button>
      <button class="btn btn-no" @click="$emit('rechazar')">Rechazar</button>
    </div>
  </main>
</template>

<style scoped>
.datos { display: grid; gap: 14px; }
.dato { display: flex; gap: 12px; align-items: flex-start; }
.dato b { display: block; font-weight: 600; }
.dato small { color: var(--tx2); font-size: 14px; }
.ico { font-size: 20px; line-height: 1.2; }
.mapa { color: var(--neon); font-weight: 600; text-decoration: none; text-shadow: 0 0 10px #5cc8ff66; }
.extras { list-style: none; padding: 0; margin: 4px 0 0; display: grid; gap: 10px; font-family: var(--serif); font-size: 17px; }
.extras .nombre { font-style: italic; color: #fff; }
.extras i { color: var(--neon); opacity: 0.85; }
.latir { animation: latir 2.4s ease-in-out infinite; }
@keyframes latir {
  0%, 100% { box-shadow: 0 0 18px #5cc8ff88; }
  50% { box-shadow: 0 0 34px #5cc8ffdd; }
}
</style>
