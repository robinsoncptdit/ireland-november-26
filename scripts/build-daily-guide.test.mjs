import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import {itinerarySections, renderDailyGuide} from './build-daily-guide.mjs'

const itinerary = fs.readFileSync(new URL('../content/itinerary.md', import.meta.url), 'utf8')
const options = JSON.parse(fs.readFileSync(new URL('../data/guide-options.json', import.meta.url), 'utf8'))
const source = file => fs.readFileSync(new URL(`../content/${file}`, import.meta.url), 'utf8')

test('public guide preserves all baseline sections and places each option under its own day', () => {
  const guide = renderDailyGuide(itinerary, options, source)
  const sections = itinerarySections(itinerary)
  assert.equal(sections.flatMap(s => s.dates).length, 12)
  for (const section of sections) assert.ok(guide.includes('### Wanderlog — current plan summary\n\n' + section.body))
  for (const item of options) {
    for (const date of item.dates) {
      const day = Number(date.slice(-2))
      const marker = `### Wiki maybes — November ${day}\n`
      const start = guide.indexOf(marker)
      assert.notEqual(start, -1)
      const remaining = guide.slice(start + marker.length)
      const text = remaining.split(/^### Wiki maybes|^## /m)[0]
      assert.ok(text.includes(`**${item.name}:**`), `${item.id} absent from November ${day}`)
    }
  }
})

test('new options cannot change the baseline; dates outside the itinerary are rejected', () => {
  const revised = structuredClone(options)
  revised[0].summary = 'Synthetic optional change'
  const guide = renderDailyGuide(itinerary, revised, source)
  for (const section of itinerarySections(itinerary)) assert.ok(guide.includes(section.body))
  revised[0].dates = ['2026-11-14']
  assert.throws(() => renderDailyGuide(itinerary, revised, source), /outside itinerary/)
})

test('missing evidence headings and duplicate place IDs are rejected', () => {
  const revised = structuredClone(options)
  revised[0].source_heading = 'Nonexistent evidence heading'
  assert.throws(() => renderDailyGuide(itinerary, revised, source), /Source heading missing/)
  assert.throws(() => renderDailyGuide(itinerary, [...options, options[0]], source), /Duplicate option ID/)
})
