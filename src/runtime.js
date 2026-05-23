'use strict'

// The runtime is injected as a plain JS block at the top of every transpiled file.
// It's self-contained (no require/import) so the output works standalone.
const RUNTIME_CODE = `
/* ── BroLang Runtime ── */
const spam          = (...a) => console.log(...a)
const omfg          = (...a) => console.error(...a)
const omg           = (...a) => console.warn(...a)
const spreadshit    = (...a) => console.table(...a)
const debugshit     = (...a) => console.debug(...a)
const clearshit     = ()     => console.clear()
const timeshit      = (l)    => console.time(l)
const timeshitdone  = (l)    => console.timeEnd(l)

const laterbruh     = (fn, ms) => setTimeout(fn, ms)
const keepspamming  = (fn, ms) => setInterval(fn, ms)
const nevermind     = (id)     => clearTimeout(id)
const shutup        = (id)     => clearInterval(id)

const dice          = ()        => Math.random()
const lowball       = (n)       => Math.floor(n)
const highball      = (n)       => Math.ceil(n)
const ballpark      = (n)       => Math.round(n)
const bigbro        = (...a)    => Math.max(...a)
const smolbro       = (...a)    => Math.min(...a)
const nominus       = (n)       => Math.abs(n)
const whatroot      = (n)       => Math.sqrt(n)
const tothepower    = (b, e)    => Math.pow(b, e)
const PI            = Math.PI

const listkeys      = (o)       => Object.keys(o)
const listvals      = (o)       => Object.values(o)
const listpairs     = (o)       => Object.entries(o)
const mash          = (t, ...s) => Object.assign(t, ...s)
const frozensolid   = (o)       => Object.freeze(o)
const sealitup      = (o)       => Object.seal(o)

const textify       = (v)       => JSON.stringify(v)
const textifypretty = (v, n=2)  => JSON.stringify(v, null, n)
const untext        = (s)       => JSON.parse(s)

const isalist       = (x)       => Array.isArray(x)
const isnothing     = (x)       => x === null || x === undefined
const exists        = (x)       => x !== null && x !== undefined
const freshobj      = (proto)   => Object.create(proto)

const grab          = (...a)    => fetch(...a)

const pinkyswear = Object.assign(
  function(fn) { return new Promise(fn) },
  {
    sorted:      (v) => Promise.resolve(v),
    noped:       (e) => Promise.reject(e),
    waitforall:  (a) => Promise.all(a),
    firstfinish: (a) => Promise.race(a),
    nodrama:     (a) => Promise.allSettled(a),
  }
)

// DOM helpers (no-op stubs in Node; real functions in browser)
const findthisshit  = typeof document !== 'undefined' ? (id)  => document.getElementById(id)  : () => null
const findme        = typeof document !== 'undefined' ? (sel) => document.querySelector(sel)   : () => null
const findallofthem = typeof document !== 'undefined' ? (sel) => document.querySelectorAll(sel): () => []
const makething     = typeof document !== 'undefined' ? (tag) => document.createElement(tag)   : () => null

// Array prototype extensions
Array.prototype.cook        = Array.prototype.map
Array.prototype.keeponly    = Array.prototype.filter
Array.prototype.smashdown   = Array.prototype.reduce
Array.prototype.vibecheck   = Array.prototype.forEach
Array.prototype.findone     = Array.prototype.find
Array.prototype.findindex   = Array.prototype.findIndex
Array.prototype.gotthis     = Array.prototype.includes
Array.prototype.allfine     = Array.prototype.every
Array.prototype.anyonegood  = Array.prototype.some
Array.prototype.stuffin     = Array.prototype.push
Array.prototype.yeetlast    = Array.prototype.pop
Array.prototype.stufffirst  = Array.prototype.unshift
Array.prototype.yeetfirst   = Array.prototype.shift
Array.prototype.glue        = Array.prototype.join
Array.prototype.cutout      = Array.prototype.slice
Array.prototype.surgery     = Array.prototype.splice
Array.prototype.sortitout   = Array.prototype.sort
Array.prototype.flipit      = Array.prototype.reverse
Array.prototype.flatten     = Array.prototype.flat
Array.prototype.flatmash    = Array.prototype.flatMap
Object.defineProperty(Array.prototype, 'howmany', {
  get() { return this.length },
  configurable: true,
})

// String prototype extensions
String.prototype.cutout     = String.prototype.slice
String.prototype.chop       = String.prototype.split
String.prototype.cleanitup  = String.prototype.trim
String.prototype.cleanfront = String.prototype.trimStart
String.prototype.cleanback  = String.prototype.trimEnd
String.prototype.gotthis    = String.prototype.includes
String.prototype.swapout    = String.prototype.replace
String.prototype.swapallout = String.prototype.replaceAll
String.prototype.smallify   = String.prototype.toLowerCase
String.prototype.bigify     = String.prototype.toUpperCase
String.prototype.startswith = String.prototype.startsWith
String.prototype.endswith   = String.prototype.endsWith
String.prototype.pad        = String.prototype.padStart
String.prototype.padback    = String.prototype.padEnd
String.prototype.atpos      = String.prototype.charAt
String.prototype.numcode    = String.prototype.charCodeAt
Object.defineProperty(String.prototype, 'howlong', {
  get() { return this.length },
  configurable: true,
})

// Promise prototype extensions
Promise.prototype.thendo       = Promise.prototype.then
Promise.prototype.otherwise    = Promise.prototype.catch
Promise.prototype.nomatterwhat = Promise.prototype.finally

// DOM prototype extensions (browser only)
if (typeof EventTarget !== 'undefined') {
  EventTarget.prototype.whenthishappens = EventTarget.prototype.addEventListener
  EventTarget.prototype.stoplistening   = EventTarget.prototype.removeEventListener
}
if (typeof Node !== 'undefined') {
  Node.prototype.addtodoc = Node.prototype.appendChild
  Node.prototype.kickout  = Node.prototype.removeChild
}
if (typeof Element !== 'undefined') {
  Element.prototype.attr    = Element.prototype.setAttribute
  Element.prototype.getattr = Element.prototype.getAttribute
  Object.defineProperty(Element.prototype, 'text', {
    get() { return this.textContent },
    set(v) { this.textContent = v },
    configurable: true,
  })
  Object.defineProperty(Element.prototype, 'html', {
    get() { return this.innerHTML },
    set(v) { this.innerHTML = v },
    configurable: true,
  })
  Object.defineProperty(Element.prototype, 'classes', {
    get() { return this.classList },
    configurable: true,
  })
}
/* ── End BroLang Runtime ── */
`

function getRuntimeCode() {
  return RUNTIME_CODE
}

// Runtime function object for REPL injection (evaluated fresh each call)
function buildRuntimeContext() {
  const ctx = {}
  // Evaluate the runtime block to capture var-declared names
  // We rebuild it using Function so const → visible in returned ctx
  const lines = RUNTIME_CODE
    .split('\n')
    .filter(l => /^\s*const\s+/.test(l))
    .map(l => l.trim())
  const names = lines.map(l => l.match(/^const\s+(\w+)/)[1])
  const body = RUNTIME_CODE + '\nreturn {' + names.join(',') + '}'
  // eslint-disable-next-line no-new-func
  return new Function(body)()
}

module.exports = { getRuntimeCode, buildRuntimeContext }
