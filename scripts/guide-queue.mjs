import fs from 'node:fs'
import path from 'node:path'
import {spawnSync} from 'node:child_process'
import {fileURLToPath, pathToFileURL} from 'node:url'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const generated = 'content/daily-travel-guide.md'
const topics = ['index', 'itinerary', 'activities-and-food', 'cheap-eats', 'farms-and-rural-industries', 'folklore-and-ancient-sites', 'ruins-and-abbeys', 'horse-riding', 'independent-makers', 'art-culture-and-music', 'howto']
export const allowedPaths = new Set([...topics.map(n => `content/${n}.md`), 'data/guide-options.json', generated])

export function execute(root, program, args, {capture = false} = {}) {
  const result = spawnSync(program, args, {cwd: root, shell: false, encoding: 'utf8', stdio: capture ? ['ignore', 'pipe', 'pipe'] : 'inherit'})
  if (result.error) throw result.error
  if (result.status !== 0) throw Error(`${program} ${args.join(' ')} failed (${result.status}).${capture ? '\n' + result.stderr.trim() : ''}`)
  return result.stdout || ''
}
const git = (root, args) => execute(root, 'git', args, {capture: true})
const paths = (root, staged = false) => git(root, ['diff', ...(staged ? ['--cached'] : []), '--name-only', '-z']).split('\0').filter(Boolean)

export function validatePath(root, file) {
  if (!allowedPaths.has(file) || path.isAbsolute(file) || file.split('/').includes('..')) throw Error(`Not an approved public source path: ${file}`)
  let part = root
  for (const segment of file.split('/')) {
    part = path.join(part, segment)
    if (!fs.existsSync(part) || fs.lstatSync(part).isSymbolicLink()) throw Error(`Missing or symlinked source: ${file}`)
  }
  if (!fs.statSync(part).isFile()) throw Error(`Not a source file: ${file}`)
}

function ensureBranch(root) {
  const branch = git(root, ['branch', '--show-current']).trim()
  if (!branch || branch === 'main' || branch === 'master') throw Error('Use an editorial branch before queueing changes; main is protected.')
  return branch
}

export function inspectQueue(root) {
  return {branch: git(root, ['branch', '--show-current']).trim(), staged: paths(root, true), unstaged: paths(root)}
}

export function stageSources(root, selected, run = execute, {reviewedRestage = false} = {}) {
  ensureBranch(root)
  const files = [...new Set(selected)]
  if (!files.length) throw Error('Specify the approved public source files to stage.')
  for (const file of files) {
    validatePath(root, file)
    if (file === generated) throw Error('Name the source guide or mapping, not the generated daily guide.')
  }
  const before = inspectQueue(root)
  for (const file of files) {
    if (!reviewedRestage && before.staged.includes(file) && before.unstaged.includes(file)) throw Error(`Partially staged file: ${file}. Review the combined diff before deliberately restaging it.`)
  }
  if (before.unstaged.includes(generated)) throw Error('Generated daily guide has unstaged edits; preserve and inspect them before regeneration.')
  const otherInputs = before.unstaged.filter(f => allowedPaths.has(f) && f !== generated && !files.includes(f))
  if (otherInputs.length) throw Error(`Other public input changes need review first: ${otherInputs.join(', ')}`)
  const indexBeforeChecks = git(root, ['ls-files', '--stage', '-z'])
  run(root, process.execPath, ['scripts/build-daily-guide.mjs'])
  run(root, process.execPath, ['--test', 'scripts/build-daily-guide.test.mjs'])
  run(root, process.execPath, ['scripts/check.mjs', 'quick'])
  if (git(root, ['ls-files', '--stage', '-z']) !== indexBeforeChecks) throw Error('Index changed during validation; refusing to stage over another task.')
  git(root, ['add', '--', ...files, generated])
  run(root, process.execPath, ['scripts/check.mjs', 'quick'])
  return inspectQueue(root)
}

export function commitQueue(root, message, run = execute) {
  ensureBranch(root)
  if (!message?.trim() || message.includes('\n')) throw Error('Provide a concise one-line commit message.')
  const queue = inspectQueue(root)
  if (!queue.staged.length) throw Error('No staged batch to commit.')
  const unrelated = queue.staged.filter(f => !allowedPaths.has(f))
  if (unrelated.length) throw Error(`Unrelated staged paths preserved; content-only commit refused: ${unrelated.join(', ')}`)
  if (queue.unstaged.length) throw Error('Unstaged tracked changes exist. Review and queue them separately before committing this batch.')
  for (const file of queue.staged) validatePath(root, file)
  const snapshot = git(root, ['ls-files', '--stage', '-z'])
  run(root, process.execPath, ['--test', 'scripts/build-daily-guide.test.mjs'])
  run(root, process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'build'])
  if (git(root, ['ls-files', '--stage', '-z']) !== snapshot || paths(root).length) throw Error('Files or index changed during the build; no commit made. Review the new diff.')
  git(root, ['diff', '--cached', '--check'])
  run(root, 'git', ['commit', '-m', message])
  return {commit: git(root, ['rev-parse', 'HEAD']).trim(), ...inspectQueue(root)}
}

export function withQueueLock(root, fn) {
  const parent = path.join(root, 'private')
  fs.mkdirSync(parent, {recursive: true})
  // This repository deliberately ignores private/. Never create a public lock/status file.
  git(root, ['check-ignore', '-q', '--', 'private/guide-queue.lock/owner.json'])
  const directory = path.join(parent, 'guide-queue.lock')
  try { fs.mkdirSync(directory) } catch (error) {
    if (error.code === 'EEXIST') throw Error('Another publishing operation holds the queue lock. Inspect its owner before retrying; do not delete a live lock.')
    throw error
  }
  try {
    fs.writeFileSync(path.join(directory, 'owner.json'), JSON.stringify({pid: process.pid, started: new Date().toISOString()}))
    return fn()
  } finally { fs.rmSync(directory, {recursive: true}) }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const [mode = 'status', ...args] = process.argv.slice(2)
    let result
    if (mode === 'status') result = inspectQueue(projectRoot)
    else if (mode === 'stage') {
      const reviewedRestage = args.includes('--reviewed-restage')
      const selected = args.filter(arg => arg !== '--reviewed-restage')
      result = withQueueLock(projectRoot, () => stageSources(projectRoot, selected, execute, {reviewedRestage}))
    }
    else if (mode === 'commit' && args.length === 2 && args[0] === '--message') result = withQueueLock(projectRoot, () => commitQueue(projectRoot, args[1]))
    else throw Error('Use status, stage <public source paths>, or commit --message "message".')
    console.log(JSON.stringify(result, null, 2))
  } catch (error) { console.error(`Guide queue stopped: ${error.message}`); process.exitCode = 1 }
}
