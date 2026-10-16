// Lee la invitación empaquetada después del # del enlace
export function leerInvitacion(hash = location.hash) {
  const raw = hash.replace(/^#/, '')
  if (!raw) return null
  try {
    const b64 = raw.replace(/-/g, '+').replace(/_/g, '/')
    const bin = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4))
    const json = new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)))
    const d = JSON.parse(json)
    if (d.v !== 1 || !d.n || !d.l || !d.d) return null
    return d
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
