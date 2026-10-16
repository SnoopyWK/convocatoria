<script setup>
import { inject, onBeforeUnmount, ref } from 'vue'
import { usuarioTerminal } from '../../payload.js'

const emit = defineEmits(['aceptar', 'seguir'])
const u = usuarioTerminal(inject('inv'))
const GUION = [
  ['cmd', 'rechazar --invitacion'],
  ['err', 'Error: operación no permitida.'],
  ['cmd', 'rechazar --invitacion --force'],
  ['err', 'Error: --force no aplica a fiestas con asado.'],
  ['cmd', 'sudo rechazar --invitacion --force'],
  ['out', `[sudo] contraseña de ${u}: ********`],
  ['err', `${u} no está en el archivo sudoers. Este incidente será reportado. 🚨`],
]
const lineas = ref([])
const listo = ref(false)
let timer

function escribir(i = 0, j = 0) {
  if (i >= GUION.length) return (listo.value = true)
  const [tipo, texto] = GUION[i]
  if (j === 0) lineas.value.push({ tipo, texto: '' })
  if (tipo === 'cmd' && j < texto.length) {
    lineas.value[i].texto = texto.slice(0, j + 1)
    timer = setTimeout(() => escribir(i, j + 1), 38 + Math.random() * 60)
    return
  }
  lineas.value[i].texto = texto
  timer = setTimeout(() => escribir(i + 1, 0), tipo === 'cmd' ? 420 : 700)
}
escribir()
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <main class="pantalla" style="justify-content: center">
    <section class="term entrar">
      <div class="barra"><i></i><i></i><i></i><span>{{ u }}@fiesta: ~</span></div>
      <div class="cuerpo">
        <div v-for="(l, i) in lineas" :key="i" :class="l.tipo">
          <template v-if="l.tipo === 'cmd'"><span class="prompt">$</span> </template>{{ l.texto }}<span v-if="i === lineas.length - 1 && !listo" class="cursor">▍</span>
        </div>
      </div>
    </section>
    <div v-if="listo" class="entrar" style="display: grid; gap: 10px">
      <button class="btn btn-no" @click="emit('seguir')">Reintentar como administradora</button>
      <button class="btn btn-si" @click="emit('aceptar')">Acepto, no quiero problemas</button>
    </div>
  </main>
</template>

<style scoped>
.term { background: #02060c; border: 1px solid var(--neon-dim); border-radius: 14px; overflow: hidden; box-shadow: 0 0 30px #5cc8ff22; }
.barra { display: flex; align-items: center; gap: 6px; padding: 9px 12px; background: #0b1626; font-family: var(--mono); font-size: 12px; color: var(--tx2); }
.barra i { width: 10px; height: 10px; border-radius: 50%; background: #ff5f57; }
.barra i:nth-child(2) { background: #febc2e; }
.barra i:nth-child(3) { background: #28c840; }
.barra span { margin-left: 8px; }
.cuerpo { padding: 14px; font-family: var(--mono); font-size: 13px; line-height: 1.6; min-height: 230px; word-break: break-word; }
.cmd { color: #e6efff; }
.prompt { color: var(--neon); }
.err { color: #ff7b8a; }
.out { color: var(--tx2); }
.cursor { animation: parpadeo 0.9s steps(1) infinite; color: var(--neon); }
@keyframes parpadeo { 50% { opacity: 0; } }
</style>
