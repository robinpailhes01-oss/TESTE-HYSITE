// Génère, pour chaque photo de public/images, des variantes WebP à 480, 800,
// 1200 et 1600 px de large (jamais plus large que l'original). L'original reste
// la plus grande taille. Les logos et l'image OG sont exclus. Idempotent : une
// variante déjà présente et plus récente que sa source n'est pas refaite.
import { readdirSync, statSync, existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
const DIR = 'public/images'
const WIDTHS = [480, 800, 1200, 1600]
const skip = /^(logo-|og-)|-\d{3,4}\.webp$/
const files = readdirSync(DIR).filter((f) => /\.(jpe?g|webp|png)$/i.test(f) && !skip.test(f))
const py = `
import sys
from PIL import Image
src, dst, w = sys.argv[1], sys.argv[2], int(sys.argv[3])
im = Image.open(src).convert('RGB')
if im.width <= w: sys.exit(3)
im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
im.save(dst, 'WEBP', quality=78, method=6)
`
let made = 0, kept = 0
for (const f of files) {
  const base = f.replace(/\.(jpe?g|webp|png)$/i, '')
  for (const w of WIDTHS) {
    const dst = `${DIR}/${base}-${w}.webp`
    if (existsSync(dst) && statSync(dst).mtimeMs >= statSync(`${DIR}/${f}`).mtimeMs) { kept++; continue }
    try { execFileSync('python3', ['-c', py, `${DIR}/${f}`, dst, String(w)], { stdio: 'pipe' }); made++ }
    catch (e) { if (e.status !== 3) throw e }
  }
}
console.log(`variantes : ${made} générées, ${kept} déjà à jour`)
// Le manifeste des largeurs réelles (src/images.json) est produit par le même
// passage : voir la commande « npm run images ».
