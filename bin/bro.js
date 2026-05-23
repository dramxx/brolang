#!/usr/bin/env node
'use strict'

const path = require('path')
const fs = require('fs')
const { spawn } = require('child_process')
const repl = require('repl')

const { transpile, substituteKeywords } = require('../src/transpiler')
const { buildRuntimeContext } = require('../src/runtime')
const { version } = require('../package.json')

// ── ANSI colors ───────────────────────────────────────────────────────────────
const red   = (s) => `\x1b[31m${s}\x1b[0m`
const green = (s) => `\x1b[32m${s}\x1b[0m`
const cyan  = (s) => `\x1b[1;36m${s}\x1b[0m`
const gray  = (s) => `\x1b[90m${s}\x1b[0m`

// ── CLI entry ─────────────────────────────────────────────────────────────────
const [,, cmd, ...args] = process.argv

const HELP = `
BroLang ${version} — JavaScript for people who peaked in 1997

Usage: bro <command> [options]

Commands:
  run <file>             Transpile and execute a .bro file
  build <file> [-o out]  Transpile a .bro file to JavaScript
  check <file>           Check a .bro file for transpile errors
  repl                   Start an interactive BroLang REPL

Options:
  -v, --version          Show version
  -h, --help             Show this help
`.trim()

if (!cmd || cmd === '-h' || cmd === '--help') {
  console.log(HELP)
  process.exit(0)
}

if (cmd === '-v' || cmd === '--version') {
  console.log(version)
  process.exit(0)
}

if      (cmd === 'run')   runFile(args[0])
else if (cmd === 'build') buildFile(args)
else if (cmd === 'check') checkFile(args[0])
else if (cmd === 'repl')  startRepl()
else {
  console.error(red(`bro: unknown command '${cmd}'. Run 'bro --help' for usage.`))
  process.exit(1)
}

// ── helpers ───────────────────────────────────────────────────────────────────

function resolveFile(file) {
  if (!file) {
    console.error(red('bro: no file specified'))
    process.exit(1)
  }
  let p = path.resolve(file)
  if (!fs.existsSync(p) && !file.endsWith('.bro')) {
    p = path.resolve(file + '.bro')
  }
  if (!fs.existsSync(p)) {
    console.error(red(`bro: file not found: ${file}`))
    process.exit(1)
  }
  return p
}

// ── commands ──────────────────────────────────────────────────────────────────

function runFile(file) {
  const filePath = resolveFile(file)
  const source = fs.readFileSync(filePath, 'utf8')

  let js
  try {
    js = transpile(source)
  } catch (err) {
    console.error(red('transpile error:'), err.message)
    process.exit(1)
  }

  const hasModuleSyntax = /^(?:import|export)\s/m.test(js)
  const ext = hasModuleSyntax ? '.mjs' : '.js'
  const tmp = path.join(path.dirname(filePath), `__bro_${process.pid}_${Date.now()}${ext}`)

  fs.writeFileSync(tmp, js, 'utf8')

  const child = spawn(process.execPath, [tmp], { stdio: 'inherit' })
  child.on('exit', (code, signal) => {
    fs.unlink(tmp, () => {})
    if (signal) process.kill(process.pid, signal)
    else process.exit(code ?? 0)
  })
  child.on('error', (err) => {
    console.error(red('run error:'), err.message)
    fs.unlink(tmp, () => {})
    process.exit(1)
  })
}

function buildFile(args) {
  let file = null
  let out = null
  for (let i = 0; i < args.length; i++) {
    if ((args[i] === '-o' || args[i] === '--out') && args[i + 1]) {
      out = args[++i]
    } else if (!file) {
      file = args[i]
    }
  }

  const filePath = resolveFile(file)
  const source = fs.readFileSync(filePath, 'utf8')

  let js
  try {
    js = transpile(source)
  } catch (err) {
    console.error(red('transpile error:'), err.message)
    process.exit(1)
  }

  const outPath = out ? path.resolve(out) : filePath.replace(/\.bro$/, '.js')
  fs.writeFileSync(outPath, js, 'utf8')
  console.log(green('built:'), outPath)
}

function checkFile(file) {
  const filePath = resolveFile(file)
  const source = fs.readFileSync(filePath, 'utf8')
  try {
    transpile(source)
    console.log(green(`✓ ${file} — looks good, bro`))
  } catch (err) {
    console.error(red(`✗ ${file} — ${err.message}`))
    process.exit(1)
  }
}

function startRepl() {
  console.log(cyan('BroLang REPL') + gray('  (.exit to quit)\n'))

  const rtFns = buildRuntimeContext()

  const r = repl.start({
    prompt: cyan('bro> '),
    useGlobal: true,
    ignoreUndefined: true,
  })

  Object.assign(r.context, rtFns)

  const origEval = r.eval
  r.eval = function broEval(input, ctx, filename, cb) {
    origEval.call(r, substituteKeywords(input), ctx, filename, cb)
  }
}
