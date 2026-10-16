<script setup>
import { onBeforeUnmount, ref } from 'vue'

const emit = defineEmits(['aceptar', 'seguir'])
const pct = ref(0)
const texto = ref('Procesando rechazo…')
const fin = ref(false)
const timers = []
let vivo = true
const luego = (fn, ms) => timers.push(setTimeout(() => vivo && fn(), ms))

function subir(hasta, ms, despues) {
  const desde = pct.value
  const t0 = performance.now()
  const tick = (t) => {
    const k = Math.min(1, (t - t0) / ms)
    pct.value = Math.round(desde + (hasta - desde) * (1 - (1 - k) ** 3))
    if (!vivo) return
    if (k < 1) requestAnimationFrame(tick)
    else despues && despues()
  }
  requestAnimationFrame(tick)
}

subir(99, 2200, () =>
  luego(() => {
    texto.value = 'Reintentando con más ganas…'
    pct.value = 3
    luego(() =>
      subir(99, 1800, () =>
        luego(() => {
          texto.value = 'Error 418: soy una tetera. No puedo procesar un no. 🫖'
          fin.value = true
        }, 1200),
      ), 600)
  }, 1300),
)
onBeforeUnmount(() => {
  vivo = false
  timers.forEach((t) => clearTimeout(t))
})
</script>

<template>
  <main class="pantalla" style="justify-content: center">
    <section class="caja entrar" style="display: grid; gap: 14px">
      <div class="tag">Sistema de rechazos v0.0.1-beta</div>
      <p class="estado" :class="{ error: fin }">{{ texto }}</p>
      <div class="barra"><i :style="{ width: `${pct}%` }" :class="{ error: fin }"></i></div>
      <div class="pct">{{ pct }}%</div>
    </section>
    <div v-if="fin" class="entrar" style="display: grid; gap: 10px">
      <button class="btn btn-no" @click="emit('seguir')">Intentar una última vez</button>
      <button class="btn btn-si" @click="emit('aceptar')">Bueno, acepto</button>
    </div>
  </main>
</template>

<style scoped>
.estado { margin: 0; font-size: 17px; min-height: 48px; }
.estado.error { color: #ff7b8a; }
.barra { height: 12px; border-radius: 99px; background: #ffffff14; overflow: hidden; }
.barra i { display: block; height: 100%; background: var(--neon); box-shadow: 0 0 14px var(--neon); border-radius: 99px; }
.barra i.error { background: #ff7b8a; box-shadow: 0 0 14px #ff7b8a; }
.pct { font-family: var(--mono); color: var(--tx2); text-align: right; }
</style>
