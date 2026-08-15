// Génère public/sitemap.xml à partir de la liste unique des pages
// (seo-paths.mjs), pour ne jamais avoir deux listes à maintenir à la main.
// Exécuté avant `react-router build` (voir package.json).
import { writeFileSync } from 'node:fs'
import { PUBLIC_PATHS, SITE_URL } from '../seo-paths.mjs'

const urls = PUBLIC_PATHS.map((path) => `  <url><loc>${SITE_URL}${path}</loc></url>`).join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`

writeFileSync(new URL('../public/sitemap.xml', import.meta.url), xml)
console.log(`sitemap.xml généré (${PUBLIC_PATHS.length} pages)`)
