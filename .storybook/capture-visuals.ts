import { createReadStream } from 'node:fs'
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, resolve, sep } from 'node:path'
import { parseArgs } from 'node:util'

import { chromium } from 'playwright'

type StorybookIndexEntry = {
  id: string
  name: string
  tags?: string[]
  title: string
  type: string
}

type CaptureTheme = 'default' | 'aqua' | 'neutral'
type CaptureMode = 'dark' | 'light'
type CaptureProfile = {
  directory: string
  effectiveMode?: CaptureMode
  globalMode?: CaptureMode
  theme: CaptureTheme
}

const captureProfiles: readonly CaptureProfile[] = [
  { directory: 'default', theme: 'default' },
  { directory: 'aqua', theme: 'aqua' },
  { directory: 'neutral-dark', effectiveMode: 'dark', theme: 'neutral' },
  {
    directory: 'neutral-light',
    effectiveMode: 'light',
    globalMode: 'light',
    theme: 'neutral',
  },
]
const viewport = { width: 1280, height: 800 }
const resizeObserverLoopMessage = 'ResizeObserver loop completed with undelivered notifications.'
const contentTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.gif', 'image/gif'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.jpeg', 'image/jpeg'],
  ['.jpg', 'image/jpeg'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.mjs', 'text/javascript; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
])

const { values } = parseArgs({
  options: {
    'exclude-tag': { default: '', type: 'string' },
    'include-tag': { default: 'visual', type: 'string' },
    'output-dir': { default: '.visual-reference', type: 'string' },
    'story-id-pattern': { default: '', type: 'string' },
    'storybook-dir': { default: 'storybook-static', type: 'string' },
  },
})

const excludeTag = values['exclude-tag']
const includeTag = values['include-tag']
const storyIdPattern = values['story-id-pattern']
const storyIdExpression = storyIdPattern === '' ? undefined : new RegExp(storyIdPattern)
const storybookDirectory = resolve(values['storybook-dir'])
const outputDirectory = resolve(values['output-dir'])

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isStorybookIndexEntry(value: unknown): value is StorybookIndexEntry {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.title === 'string' &&
    typeof value.type === 'string' &&
    (value.tags === undefined ||
      (Array.isArray(value.tags) && value.tags.every((tag) => typeof tag === 'string')))
  )
}

function getIndexEntries(value: unknown): StorybookIndexEntry[] {
  if (!isRecord(value) || !isRecord(value.entries)) {
    throw new Error('Storybook index.json does not contain an entries object.')
  }

  return Object.values(value.entries).filter(isStorybookIndexEntry)
}

function closeServer(server: ReturnType<typeof createServer>) {
  return new Promise<void>((resolveClose, reject) => {
    server.close((error) => {
      if (error) reject(error)
      else resolveClose()
    })
  })
}

const server = createServer(async (request, response) => {
  try {
    const requestUrl = new URL(request.url ?? '/', 'http://127.0.0.1')
    const relativePath = decodeURIComponent(requestUrl.pathname).replace(/^\/+/, '') || 'index.html'
    const requestedPath = resolve(storybookDirectory, relativePath)

    if (
      requestedPath !== storybookDirectory &&
      !requestedPath.startsWith(`${storybookDirectory}${sep}`)
    ) {
      response.writeHead(403).end('Forbidden')
      return
    }

    const requestedStats = await stat(requestedPath)
    const filePath = requestedStats.isDirectory()
      ? resolve(requestedPath, 'index.html')
      : requestedPath
    response.setHeader(
      'content-type',
      contentTypes.get(extname(filePath).toLowerCase()) ?? 'application/octet-stream',
    )
    createReadStream(filePath).pipe(response)
  } catch {
    response.writeHead(404).end('Not found')
  }
})

await new Promise<void>((resolveListen, reject) => {
  server.once('error', reject)
  server.listen(0, '127.0.0.1', () => {
    server.off('error', reject)
    resolveListen()
  })
})

const address = server.address()
if (!address || typeof address === 'string') {
  await closeServer(server)
  throw new Error('Could not determine the Storybook server port.')
}

const rawIndex: unknown = JSON.parse(
  await readFile(resolve(storybookDirectory, 'index.json'), 'utf8'),
)
const visualStories = getIndexEntries(rawIndex)
  .filter(
    (entry) =>
      entry.type === 'story' &&
      (includeTag === '' || entry.tags?.includes(includeTag)) &&
      (excludeTag === '' || !entry.tags?.includes(excludeTag)) &&
      (storyIdExpression === undefined || storyIdExpression.test(entry.id)),
  )
  // The project target predates Array.prototype.toSorted.
  // oxlint-disable-next-line unicorn/no-array-sort
  .sort((left, right) => left.id.localeCompare(right.id))

if (visualStories.length === 0) {
  await closeServer(server)
  throw new Error(
    includeTag === ''
      ? 'No stories were found in the built Storybook index.'
      : `No stories tagged "${includeTag}" were found in the built Storybook index.`,
  )
}

await mkdir(outputDirectory, { recursive: true })

const browser = await chromium.launch({ headless: true })
const captures: Array<{
  effectiveMode?: CaptureMode
  file: string
  id: string
  name: string
  profile: string
  theme: CaptureTheme
  title: string
}> = []

try {
  const context = await browser.newContext({
    colorScheme: 'dark',
    reducedMotion: 'reduce',
    viewport,
  })
  const page = await context.newPage()
  let unexpectedPageErrors: Error[] = []

  page.on('pageerror', (error) => {
    if (error.message !== resizeObserverLoopMessage) unexpectedPageErrors.push(error)
  })

  for (const profile of captureProfiles) {
    const profileDirectory = resolve(outputDirectory, profile.directory)
    await mkdir(profileDirectory, { recursive: true })

    for (const story of visualStories) {
      unexpectedPageErrors = []
      const storyUrl = new URL('/iframe.html', `http://127.0.0.1:${address.port}`)
      const globals = [`theme:${profile.theme}`]
      if (profile.globalMode !== undefined) globals.push(`mode:${profile.globalMode}`)
      storyUrl.searchParams.set('globals', globals.join(';'))
      storyUrl.searchParams.set('id', story.id)
      storyUrl.searchParams.set('viewMode', 'story')

      await page.goto(storyUrl.href, { waitUntil: 'networkidle' })
      await page.locator('#storybook-root').waitFor({ state: 'attached' })
      if (includeTag !== '') {
        await page.waitForFunction(
          () => (document.querySelector('#storybook-root')?.childElementCount ?? 0) > 0,
        )
      }
      await page.evaluate(async () => {
        await document.fonts.ready
      })
      await page.waitForTimeout(100)

      if (unexpectedPageErrors.length > 0) throw unexpectedPageErrors[0]

      const file = resolve(profileDirectory, `${story.id}.png`)
      await page.screenshot({ animations: 'disabled', fullPage: true, path: file })
      captures.push({
        effectiveMode: profile.effectiveMode,
        file: file.slice(outputDirectory.length + 1),
        id: story.id,
        name: story.name,
        profile: profile.directory,
        theme: profile.theme,
        title: story.title,
      })
    }
  }

  await context.close()
} finally {
  await browser.close()
  await closeServer(server)
}

const expectedCaptureCount = visualStories.length * captureProfiles.length
if (captures.length !== expectedCaptureCount) {
  throw new Error(
    `Expected ${expectedCaptureCount} captures for ${visualStories.length} stories across ${captureProfiles.length} profiles, but received ${captures.length}.`,
  )
}

const componentCount = new Set(visualStories.map((story) => story.title)).size
await writeFile(
  resolve(outputDirectory, 'manifest.json'),
  `${JSON.stringify(
    {
      captureCount: captures.length,
      componentCount,
      generatedAt: new Date().toISOString(),
      profiles: captureProfiles.map(({ directory, effectiveMode, theme }) => ({
        directory,
        effectiveMode,
        theme,
      })),
      stories: visualStories.length,
      viewport,
      captures,
    },
    null,
    2,
  )}\n`,
)

console.log(
  `Captured ${visualStories.length} visual stories across ${componentCount} components and ${captureProfiles.length} profiles (${captures.length} images).`,
)
