// Render every ```mermaid fence in content/**/*.md to a static PNG under
// static/img/mermaid/<page-key>-<n>.png, where <page-key> is the content
// path with the extension (and a trailing /index) stripped and slashes
// replaced by dashes — e.g.
//   content/post/foo/index.md            → post-foo-1.png
//   content/courses/how-to-make-oncall/chapter10.md
//                                        → courses-how-to-make-oncall-chapter10-1.png
//
// The markdown render hook (layouts/_default/_markup/render-codeblock-mermaid.html)
// derives the same key and, when the PNG exists, tags the diagram with a
// data-static URL that the content-portable partial uses for RSS/Substack
// output. The site itself keeps rendering diagrams client-side.
//
// Run via `make mermaid` (or `npm run mermaid`) after editing a diagram and
// commit the PNGs — they are deliberately not generated on Netlify to keep
// the CI build free of puppeteer/Chromium. A PNG is re-rendered when its
// source markdown file is newer than the existing image.
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(fileURLToPath(import.meta.url), '..', '..')
const contentDir = join(root, 'content')
const outDir = join(root, 'static', 'img', 'mermaid')
const mmdc = join(root, 'node_modules', '.bin', 'mmdc')

const mdFiles = []
const walk = (dir) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name)
    if (entry.isDirectory()) walk(p)
    else if (entry.name.endsWith('.md')) mdFiles.push(p)
  }
}
walk(contentDir)

let rendered = 0
let skipped = 0
for (const md of mdFiles) {
  const src = readFileSync(md, 'utf8')
  const fences = [...src.matchAll(/^```mermaid\r?\n([\s\S]*?)^```/gm)].map((m) => m[1])
  if (fences.length === 0) continue

  const key = relative(contentDir, md)
    .replace(/\.md$/, '')
    .replace(/\/index$/, '')
    .replaceAll('/', '-')

  mkdirSync(outDir, { recursive: true })
  fences.forEach((code, i) => {
    const out = join(outDir, `${key}-${i + 1}.png`)
    if (existsSync(out) && statSync(out).mtimeMs > statSync(md).mtimeMs) {
      skipped++
      return
    }
    const tmp = join(tmpdir(), `mermaid-${key}-${i + 1}.mmd`)
    writeFileSync(tmp, code)
    execFileSync(mmdc, ['-i', tmp, '-o', out, '-s', '2', '-b', 'white', '--quiet'], {
      stdio: 'inherit',
    })
    console.log(`rendered ${relative(root, out)}`)
    rendered++
  })
}
console.log(`mermaid: ${rendered} rendered, ${skipped} up to date`)
