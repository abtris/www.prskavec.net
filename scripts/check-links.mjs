import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, extname, join, normalize, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(fileURLToPath(import.meta.url), '..', '..')
const contentDir = join(root, 'content')
const staticDir = join(root, 'static')
const targets = [
  join(contentDir, 'talk'),
  join(contentDir, 'post'),
  join(contentDir, 'courses', 'how-to-make-oncall'),
]
const checkExternal = process.argv.includes('--external')
const timeoutMs = 15000

const mdFiles = []
const walk = (dir) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name)
    if (entry.isDirectory()) walk(p)
    else if (entry.name.endsWith('.md')) mdFiles.push(p)
  }
}
targets.forEach(walk)

const slug = (text) =>
  text
    .trim()
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/\s*\/\s*/g, '--')
    .replace(/[()]/g, '')
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '')

const stripCodeFences = (text) => text.replace(/^```[\s\S]*?^```/gm, '')
const withoutComments = (text) =>
  text
    .split('\n')
    .filter((line) => !line.trimStart().startsWith('#'))
    .join('\n')

const fileAnchors = new Map()
for (const file of mdFiles) {
  const src = stripCodeFences(readFileSync(file, 'utf8'))
  const anchors = new Set()
  for (const match of src.matchAll(/^#{1,6}\s+(.+)$/gm)) anchors.add(slug(match[1]))
  fileAnchors.set(file, anchors)
}

const links = []
const addLink = (file, value) => {
  let url = value.trim().replace(/^<|>$/g, '').replace(/^["']|["']$/g, '')
  if (!url || url.startsWith('mailto:') || url.startsWith('tel:')) return
  url = url.replace(/[),.;]+$/, '')
  links.push({ file, url })
}

for (const file of mdFiles) {
  const src = withoutComments(stripCodeFences(readFileSync(file, 'utf8')))

  for (const match of src.matchAll(/!?\[[^\]]*]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
    addLink(file, match[1])
  }
  for (const match of src.matchAll(/<((?:https?|ftp):\/\/[^>\s]+)>/g)) {
    addLink(file, match[1])
  }
  for (const match of src.matchAll(/(?:^|[\s"'])((?:https?|ftp):\/\/[^\s"'<>)]+)/gm)) {
    addLink(file, match[1])
  }
}

const uniqueLinks = [
  ...new Map(links.map((link) => [`${link.file}\0${link.url}`, link])).values(),
]

const localExists = (file, url) => {
  const [pathPart, anchor] = url.split('#')
  const base = pathPart || relative(dirname(file), file)
  const candidates = []

  if (base.startsWith('/')) {
    candidates.push(join(staticDir, base))
    candidates.push(join(contentDir, base))
    candidates.push(join(contentDir, base, 'index.md'))
  } else {
    candidates.push(resolve(dirname(file), base))
    candidates.push(resolve(dirname(file), base, 'index.md'))
  }

  const target = candidates.find((p) => existsSync(p) && statSync(p).isFile())
  if (!target) return false
  if (!anchor) return true
  if (extname(target) !== '.md') return true
  return fileAnchors.get(normalize(target))?.has(anchor) ?? false
}

const checkHttp = async ({ file, url }) => {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    let res = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'user-agent': 'www.prskavec.net link checker' },
    })
    if ([405, 403].includes(res.status)) {
      res = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        signal: controller.signal,
        headers: { 'user-agent': 'www.prskavec.net link checker' },
      })
    }
    if (res.status === 403) return
    if (res.status >= 400) return `${rel(file)}: ${url} -> HTTP ${res.status}`
  } catch (err) {
    return `${rel(file)}: ${url} -> ${err.name === 'AbortError' ? 'timeout' : err.message}`
  } finally {
    clearTimeout(timer)
  }
}

const rel = (file) => relative(root, file)
const failures = []
const external = []

for (const link of uniqueLinks) {
  if (/^(https?|ftp):\/\//.test(link.url)) {
    external.push(link)
  } else if (!localExists(link.file, link.url)) {
    failures.push(`${rel(link.file)}: ${link.url}`)
  }
}

if (checkExternal) {
  for (let i = 0; i < external.length; i += 8) {
    const batch = external.slice(i, i + 8)
    const results = await Promise.all(batch.map(checkHttp))
    failures.push(...results.filter(Boolean))
  }
}

if (failures.length) {
  console.error(`link check failed (${failures.length}):`)
  failures.forEach((failure) => console.error(`- ${failure}`))
  process.exit(1)
}

const suffix = checkExternal ? `, ${external.length} external` : ''
console.log(`link check passed: ${uniqueLinks.length} links (${uniqueLinks.length - external.length} local${suffix})`)
