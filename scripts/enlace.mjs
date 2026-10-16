// Genera el enlace de la invitación: node scripts/enlace.mjs datos/celeste.json
import { readFileSync } from 'node:fs'
import { randomBytes } from 'node:crypto'

const archivo = process.argv[2]
if (!archivo) {
  console.error('Uso: npm run enlace -- datos/<invitada>.json')
  process.exit(1)
}
const d = JSON.parse(readFileSync(archivo, 'utf8'))
if (!d.k) {
  d.k = `conv-${randomBytes(12).toString('hex')}`
  console.error(`Sin canal "k" en ${archivo}: usé uno nuevo. Guardalo en el archivo para reutilizarlo: ${d.k}`)
}
const base = d.base || 'https://snoopywk.github.io/convocatoria/'
delete d.base
const paquete = Buffer.from(JSON.stringify({ v: 1, ...d }), 'utf8').toString('base64url')
console.log(`${base}#${paquete}`)
console.error(`\nAvisos en: https://ntfy.sh/${d.k}  (suscribite a "${d.k}" en la app ntfy)`)
