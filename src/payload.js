const b64 = (t) => Uint8Array.from(atob(t.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (t.length % 4)) % 4)), (c) => c.charCodeAt(0))

function valida(d) {
  return d && d.v === 1 && d.n && d.l && d.d ? d : null
}

// Enlace corto: #<id>.<llave>; la invitación cifrada vive en i/<id>.json
async function leerCifrada(id, llave) {
  const r = await fetch(`${import.meta.env.BASE_URL}i/${id}.json`, { cache: 'no-store' })
  if (!r.ok) return null
  const { iv, ct } = await r.json()
  const k = await crypto.subtle.importKey('raw', b64(llave), 'AES-GCM', false, ['decrypt'])
  const plano = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(iv) }, k, b64(ct))
  return valida(JSON.parse(new TextDecoder().decode(plano)))
}

// Lee la invitación a partir de lo que viene después del # del enlace
export async function leerInvitacion(hash = location.hash) {
  const raw = hash.replace(/^#/, '')
  if (!raw) return null
  try {
    const corto = raw.match(/^([A-Za-z0-9_-]{6,16})\.([A-Za-z0-9_-]{20,64})$/)
    if (corto) return await leerCifrada(corto[1], corto[2])
    return valida(JSON.parse(new TextDecoder().decode(b64(raw))))
  } catch {
    return null
  }
}

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

// La fecha se muestra tal cual se escribió, sin depender de la zona del celular
export function partesFecha(local) {
  const [fecha, hora] = local.split('T')
  const [y, m, d] = fecha.split('-').map(Number)
  const dia = DIAS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()]
  return { texto: `${dia} ${d} de ${MESES[m - 1]}`, hora: `${hora.slice(0, 5)} h` }
}

export function urlMaps(inv) {
  if (/^https?:\/\//.test(inv.m || '')) return inv.m
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(inv.m || `${inv.l} ${inv.z || ''}`)}`
}

export function urlCalendario(inv) {
  const inicio = new Date(`${inv.d}:00${inv.o || '-03:00'}`)
  const fin = new Date(inicio.getTime() + 6 * 3600 * 1000)
  const f = (dt) => dt.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const q = new URLSearchParams({
    action: 'TEMPLATE',
    text: inv.e || 'Fiesta',
    dates: `${f(inicio)}/${f(fin)}`,
    location: [inv.l, inv.z].filter(Boolean).join(', '),
  })
  return `https://calendar.google.com/calendar/render?${q}`
}

export function nombreCorto(inv) {
  return (inv.c || inv.n.split(' ')[0]).trim()
}

export function usuarioTerminal(inv) {
  return nombreCorto(inv).toLowerCase().normalize('NFD').replace(/[^a-z0-9]/g, '')
}
