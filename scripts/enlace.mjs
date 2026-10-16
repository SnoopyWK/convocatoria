// Genera el enlace corto de la invitación: node scripts/enlace.mjs datos/celeste.json
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { randomBytes, createCipheriv } from 'node:crypto'

const archivo = process.argv[2]
if (!archivo) {
  console.error('Uso: npm run enlace -- datos/<invitada>.json')
  process.exit(1)
}
const d = JSON.parse(readFileSync(archivo, 'utf8'))
d.k ||= `conv-${randomBytes(12).toString('hex')}`
d.id ||= randomBytes(6).toString('base64url')
d.llave ||= randomBytes(16).toString('base64url')
writeFileSync(archivo, `${JSON.stringify(d, null, 2)}\n`)

const { id, llave, base = 'https://snoopywk.github.io/convocatoria/', ...inv } = d
const iv = randomBytes(12)
const c = createCipheriv('aes-128-gcm', Buffer.from(llave, 'base64url'), iv)
const ct = Buffer.concat([c.update(JSON.stringify({ v: 1, ...inv }), 'utf8'), c.final(), c.getAuthTag()])
mkdirSync('public/i', { recursive: true })
writeFileSync(`public/i/${id}.json`, JSON.stringify({ iv: iv.toString('base64url'), ct: ct.toString('base64url') }))

console.log(`${base}#${id}.${llave}`)
console.error(`\nArchivo cifrado: public/i/${id}.json (subilo con git push antes de mandar el enlace)`)
console.error(`Avisos en: https://ntfy.sh/${d.k}`)
