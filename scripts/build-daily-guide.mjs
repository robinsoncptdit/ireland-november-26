import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath, pathToFileURL} from 'node:url'
import GithubSlugger from 'github-slugger'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const categories = [
  ['Food and drink', new Set(['food', 'drink'])],
  ['Things to do and nearby interests', new Set(['activity', 'shop', 'farm', 'riding'])],
  ['Art, culture and music', new Set(['culture'])],
]

export function itinerarySections(itinerary) {
  const headings = [...itinerary.matchAll(/^## (.+)$/gm)]
  return headings.flatMap((h, i) => {
    const date = /^November (\d+)(?:[–-](\d+))? · /.exec(h[1])
    if (!date) return []
    const first = Number(date[1]), last = Number(date[2] || date[1])
    if (first < 2 || last > 13 || first > last) throw Error(`Invalid itinerary range: ${h[1]}`)
    return [{heading: h[1], body: itinerary.slice(h.index + h[0].length, headings[i + 1]?.index ?? itinerary.length).trim(),
      dates: Array.from({length: last - first + 1}, (_, n) => `2026-11-${String(first + n).padStart(2, '0')}`)}]
  })
}

export function renderDailyGuide(itinerary, options, sourceText) {
  const sections = itinerarySections(itinerary)
  const days = sections.flatMap(s => s.dates)
  if (new Set(days).size !== 12 || days.length !== 12) throw Error('Expected all 12 itinerary days, without overlap')
  const ids = new Set()
  const anchors = new Map()
  for (const item of options) {
    for (const key of ['id', 'name', 'dates', 'category', 'summary', 'source_file', 'source_heading']) {
      if (!item[key] || (Array.isArray(item[key]) && !item[key].length)) throw Error(`Missing option field ${key}`)
    }
    if (ids.has(item.id)) throw Error(`Duplicate option ID: ${item.id}`)
    ids.add(item.id)
    if (!categories.some(([, cats]) => cats.has(item.category))) throw Error(`Unknown category: ${item.category}`)
    if (!Array.isArray(item.dates) || item.dates.some(d => !days.includes(d))) throw Error(`Option date outside itinerary: ${item.id}`)
    if (!/^[a-z0-9-]+\.md$/.test(item.source_file)) throw Error(`Invalid public source: ${item.source_file}`)
    if (!anchors.has(item.source_file)) {
      const slugger = new GithubSlugger()
      const headings = [...sourceText(item.source_file).matchAll(/^#{1,6} (.+)$/gm)]
      anchors.set(item.source_file, new Map(headings.map(h => [h[1], slugger.slug(h[1])])))
    }
    if (!anchors.get(item.source_file).has(item.source_heading)) throw Error(`Source heading missing: ${item.id}`)
  }
  const lines = ['---', 'title: "Daily travel guide"', 'date: 2026-10-15', '---', '',
    '**The adopted plan, with a reserve of maybes beneath each day.**', '',
    'Wanderlog defines the where, when and what. The current-plan text below is copied from our [public itinerary summary](itinerary.md), not the complete private plan. Its recorded uncertainties remain unchanged.', '',
    'The wiki suggestions are **unadopted amendments**: possibilities for closures, weather, low energy, spare time or a deliberate change. A discussion, approved wiki edit or booking does not itself amend Wanderlog. Choose alternatives rather than trying to fit everything in.', '',
    'Research dates, source links and uncertainties are in the linked topic guides. This page is assembled from those sources; rebuilding it does not recheck hours, ticket availability or weather.', '',
    '[Browse art, culture and music](art-culture-and-music.md) · [Explore all topics](index.md)', '']
  for (const section of sections) {
    lines.push(`## ${section.heading}`, '', '### Wanderlog — current plan summary', '', section.body, '')
    for (const date of section.dates) {
      const entries = options.filter(item => item.dates.includes(date))
      if (!entries.length) continue
      lines.push(`### Wiki maybes — November ${Number(date.slice(-2))}`, '', 'All options below remain unadopted suggestions; competing activities are alternatives.', '')
      for (const [label, cats] of categories) {
        const group = entries.filter(item => cats.has(item.category))
        if (!group.length) continue
        lines.push(`#### ${label}`, '')
        for (const item of group) {
          const dest = `${item.source_file}#${encodeURIComponent(anchors.get(item.source_file).get(item.source_heading))}`
          lines.push(`- **${item.name}:** ${item.summary} [Research](${dest})`)
        }
        lines.push('')
      }
    }
  }
  const choices = itinerary.indexOf('## Choices still to settle')
  if (choices !== -1) lines.push(itinerary.slice(choices).trim(), '')
  return lines.join('\n')
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const itinerary = fs.readFileSync(path.join(root, 'content/itinerary.md'), 'utf8')
  const options = JSON.parse(fs.readFileSync(path.join(root, 'data/guide-options.json'), 'utf8'))
  const output = renderDailyGuide(itinerary, options, name => fs.readFileSync(path.join(root, 'content', name), 'utf8'))
  const target = path.join(root, 'content/daily-travel-guide.md')
  if (process.argv.includes('--check')) {
    if (!fs.existsSync(target) || fs.readFileSync(target, 'utf8') !== output) throw Error('Daily guide differs from its public sources; rebuild')
    console.log('Daily guide matches public sources (12 days).')
  } else {
    fs.writeFileSync(target, output)
    console.log(`Built public daily guide: 12 days, ${options.length} optional suggestions.`)
  }
}
