import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import {fileURLToPath} from 'node:url'
import path from 'node:path'
import {spawnSync} from 'node:child_process'
import {stageSources, commitQueue, validatePath, withQueueLock} from './guide-queue.mjs'

function git(root, ...args) {
  const p = spawnSync('git', args, {cwd: root, encoding: 'utf8'})
  assert.equal(p.status, 0, p.stderr)
  return p.stdout
}
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'guide-queue-'))
  t.after(() => fs.rmSync(root, {recursive: true, force: true}))
  fs.mkdirSync(path.join(root, 'content'))
  fs.mkdirSync(path.join(root, 'data'))
  const topics = ['index','itinerary','activities-and-food','cheap-eats','farms-and-rural-industries','folklore-and-ancient-sites','ruins-and-abbeys','horse-riding','independent-makers','art-culture-and-music','daily-travel-guide','howto']
  for (const name of topics) fs.writeFileSync(path.join(root, `content/${name}.md`), '# Public content\n')
  fs.writeFileSync(path.join(root, 'data/guide-options.json'), '[]\n')
  fs.writeFileSync(path.join(root, '.gitignore'), 'private/\n')
  fs.writeFileSync(path.join(root, 'README.md'), 'Readme\n')
  git(root, 'init', '-b', 'main')
  git(root, 'config', 'user.email', 'test@example.invalid')
  git(root, 'config', 'user.name', 'Queue Test')
  git(root, 'add', '.')
  git(root, 'commit', '-m', 'Fixture')
  git(root, 'switch', '-c', 'test-batch')
  return root
}
const noValidation = () => ''

test('explicit staging preserves unrelated staged work; content commit refuses to include it', t => {
  const root = fixture(t)
  fs.appendFileSync(path.join(root, 'README.md'), 'Unrelated staged change\n')
  git(root, 'add', 'README.md')
  const before = git(root, 'show', ':README.md')
  fs.appendFileSync(path.join(root, 'content/cheap-eats.md'), 'Approved food finding\n')
  const queue = stageSources(root, ['content/cheap-eats.md'], noValidation)
  assert.deepEqual(queue.staged.sort(), ['README.md', 'content/cheap-eats.md'])
  assert.equal(git(root, 'show', ':README.md'), before)
  assert.throws(() => commitQueue(root, 'Food batch', noValidation), /Unrelated staged paths preserved/)
})

test('partially staged target is refused without overwriting selected hunks', t => {
  const root = fixture(t), file = path.join(root, 'content/cheap-eats.md')
  fs.appendFileSync(file, 'Approved part\n')
  git(root, 'add', 'content/cheap-eats.md')
  const before = git(root, 'show', ':content/cheap-eats.md')
  fs.appendFileSync(file, 'Not yet approved\n')
  assert.throws(() => stageSources(root, ['content/cheap-eats.md'], noValidation), /Partially staged file/)
  assert.equal(git(root, 'show', ':content/cheap-eats.md'), before)
})

test('private paths, traversal, symlinks and unreviewed other input changes are refused', t => {
  const root = fixture(t)
  assert.throws(() => validatePath(root, 'private/notes.md'), /Not an approved/)
  assert.throws(() => validatePath(root, 'content/../README.md'), /Not an approved/)
  const file = path.join(root, 'content/cheap-eats.md')
  fs.unlinkSync(file)
  fs.symlinkSync(path.join(root, 'README.md'), file)
  assert.throws(() => validatePath(root, 'content/cheap-eats.md'), /symlinked/)
  fs.unlinkSync(file); fs.writeFileSync(file, '# Public content\n')
  fs.appendFileSync(path.join(root, 'content/itinerary.md'), 'Unreviewed change\n')
  assert.throws(() => stageSources(root, ['content/cheap-eats.md'], noValidation), /Other public input changes/)
})

test('index changes during validation prevent a commit', t => {
  const root = fixture(t)
  fs.appendFileSync(path.join(root, 'content/cheap-eats.md'), 'Approved\n')
  git(root, 'add', 'content/cheap-eats.md')
  const head = git(root, 'rev-parse', 'HEAD')
  const mutateIndex = (_root, program) => {
    if (program === 'npm' || program === 'npm.cmd') {
      fs.appendFileSync(path.join(root, 'README.md'), 'Concurrent work\n')
      git(root, 'add', 'README.md')
    }
  }
  assert.throws(() => commitQueue(root, 'Food batch', mutateIndex), /Index|index changed/)
  assert.equal(git(root, 'rev-parse', 'HEAD'), head)
})

test('queue lock prevents overlapping operations and preserves a live lock', t => {
  const root = fixture(t)
  withQueueLock(root, () => {
    assert.throws(() => withQueueLock(root, () => {}), /holds the queue lock/)
    assert.ok(fs.existsSync(path.join(root, 'private/guide-queue.lock/owner.json')))
  })
  assert.equal(fs.existsSync(path.join(root, 'private/guide-queue.lock')), false)
})

test('quick privacy check inspects index even when working file has been cleaned', t => {
  const root = fixture(t), file = path.join(root, 'content/cheap-eats.md')
  fs.writeFileSync(file, ['https://', 'wanderlog', '.com', '/plan/', 'synthetic-private-test\n'].join(''))
  git(root, 'add', 'content/cheap-eats.md')
  fs.writeFileSync(file, '# Sanitized worktree\n')
  const check = spawnSync(process.execPath, [fileURLToPath(new URL('./check.mjs', import.meta.url)), 'quick'], {cwd: root, encoding: 'utf8'})
  assert.notEqual(check.status, 0)
  assert.match(check.stderr, /Private marker in staged index/)
})


test('explicit reviewed-restage runs the same checks before queueing combined approved edits', t => {
  const root = fixture(t), file = path.join(root, 'content/cheap-eats.md')
  fs.appendFileSync(file, 'Earlier approved note\n')
  git(root, 'add', 'content/cheap-eats.md')
  fs.appendFileSync(file, 'Newly approved note\n')
  const validations = []
  const recordCheck = (_root, program, args) => validations.push([program, ...args].join(' '))
  stageSources(root, ['content/cheap-eats.md'], recordCheck, {reviewedRestage: true})
  assert.match(git(root, 'show', ':content/cheap-eats.md'), /Earlier approved note\nNewly approved note/)
  assert.ok(validations.some(s => s.includes('build-daily-guide.mjs')))
  assert.ok(validations.some(s => s.includes('--test')))
  assert.equal(validations.filter(s => s.includes('check.mjs quick')).length, 2)
})
