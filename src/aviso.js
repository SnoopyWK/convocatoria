// Publica la respuesta en el canal secreto de ntfy que viaja en el enlace
export async function avisar(inv, respuesta, paso) {
  if (!inv.k) return { ok: false, motivo: 'sin_canal' }
  const titulo = `${inv.t ? '[PRUEBA] ' : ''}${inv.n}: ${respuesta}`
  const ahora = new Date().toLocaleString('es-PY', { dateStyle: 'full', timeStyle: 'short' })
  const cuerpo = [
    `Cuándo: ${ahora}`,
    `Paso del rechazo al que llegó: ${paso === 0 ? 'ninguno (aceptó de una)' : `${paso} de 7`}`,
  ].join('\n')
  for (let intento = 0; intento < 4; intento++) {
    try {
      const r = await fetch('https://ntfy.sh/', {
        method: 'POST',
        body: JSON.stringify({ topic: inv.k, title: titulo, message: cuerpo, priority: 5, tags: [respuesta.includes('ACEPT') ? 'tada' : 'broken_heart'] }),
      })
      if (r.ok) return { ok: true }
    } catch {}
    await new Promise((res) => setTimeout(res, 800 * 2 ** intento))
  }
  return { ok: false, motivo: 'red' }
}
