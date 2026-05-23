'use strict'

const { substituteKeywords, transpile } = require('../src/transpiler')

let passed = 0
let failed = 0

function test(name, fn) {
  try {
    fn()
    console.log(`  \x1b[32m✓\x1b[0m ${name}`)
    passed++
  } catch (err) {
    console.error(`  \x1b[31m✗\x1b[0m ${name}\n    ${err.message}`)
    failed++
  }
}

function eq(actual, expected) {
  if (actual !== expected) {
    throw new Error(`expected: ${JSON.stringify(expected)}\n    got:      ${JSON.stringify(actual)}`)
  }
}

function has(actual, sub) {
  if (!actual.includes(sub)) {
    throw new Error(`expected output to contain ${JSON.stringify(sub)}`)
  }
}

function not(actual, sub) {
  if (actual.includes(sub)) {
    throw new Error(`expected output NOT to contain ${JSON.stringify(sub)}`)
  }
}

// ── keyword substitutions ─────────────────────────────────────────────────────

console.log('\nkeywords')
test('lilbro → let',        () => eq(substituteKeywords('lilbro x = 5'),       'let x = 5'))
test('bro → function',      () => eq(substituteKeywords('bro greet() {}'),     'function greet() {}'))
test('fuckoff → return',    () => eq(substituteKeywords('fuckoff 42'),         'return 42'))
test('sus → if',            () => eq(substituteKeywords('sus (x)'),            'if (x)'))
test('nah → else',          () => eq(substituteKeywords('nah {}'),             'else {}'))
test('nah sus → else if',   () => eq(substituteKeywords('nah sus (x > 0)'),   'else if (x > 0)'))
test('pickone → switch',    () => eq(substituteKeywords('pickone(x)'),         'switch(x)'))
test('when → case',         () => eq(substituteKeywords('when 1:'),            'case 1:'))
test('whatever → default',  () => eq(substituteKeywords('whatever:'),          'default:'))
test('grind → for',         () => eq(substituteKeywords('grind(;;)'),          'for(;;)'))
test('vibing → for',        () => eq(substituteKeywords('vibing(x of y)'),     'for(x of y)'))
test('nosyping → for',      () => eq(substituteKeywords('nosyping(k in o)'),   'for(k in o)'))
test('keepgoing → while',   () => eq(substituteKeywords('keepgoing(true)'),    'while(true)'))
test('doitonce → do',       () => eq(substituteKeywords('doitonce {}'),        'do {}'))
test('gtfo → break',        () => eq(substituteKeywords('gtfo'),               'break'))
test('peace → break',       () => eq(substituteKeywords('peace'),              'break'))
test('skip → continue',     () => eq(substituteKeywords('skip'),               'continue'))
test('yolo → try',          () => eq(substituteKeywords('yolo {}'),            'try {}'))
test('lol → catch',         () => eq(substituteKeywords('lol(e) {}'),          'catch(e) {}'))
test('anyway → finally',    () => eq(substituteKeywords('anyway {}'),          'finally {}'))
test('crew → class',        () => eq(substituteKeywords('crew Dog {}'),        'class Dog {}'))
test('setup → constructor', () => eq(substituteKeywords('setup() {}'),         'constructor() {}'))
test('fresh → new',         () => eq(substituteKeywords('fresh Dog()'),        'new Dog()'))
test('me → this',           () => eq(substituteKeywords('me.name'),            'this.name'))
test('yoink → import',      () => eq(substituteKeywords("yoink x from 'y'"),  "import x from 'y'"))
test('share → export',      () => eq(substituteKeywords('share lilbro x = 1'), 'export let x = 1'))
test('shareall → export default', () => eq(substituteKeywords('shareall bro f()'), 'export default function f()'))
test('nocap → async (standalone)', () => eq(substituteKeywords('nocap (x) => x'), 'async (x) => x'))
test('holdmybeer → await',  () => eq(substituteKeywords('holdmybeer p'),      'await p'))
test('ispartof → instanceof', () => eq(substituteKeywords('x ispartof Y'),    'x instanceof Y'))
test('wtf → typeof',        () => eq(substituteKeywords('wtf(x)'),            'typeof(x)'))
test('cool → true',         () => eq(substituteKeywords('cool'),              'true'))
test('notcool → false',     () => eq(substituteKeywords('notcool'),           'false'))
test('shit → null',         () => eq(substituteKeywords('shit'),              'null'))
test('idk → undefined',     () => eq(substituteKeywords('idk'),               'undefined'))

// ── multi-word patterns ───────────────────────────────────────────────────────

console.log('\nmulti-word patterns')
test('nocap bro → async function', () =>
  eq(substituteKeywords('nocap bro fetchData()'), 'async function fetchData()'))

test('nocap bro with extra spaces', () =>
  eq(substituteKeywords('nocap  bro  main()'), 'async function  main()'))

test('nocap alone → async (not consumed by lookahead)', () =>
  eq(substituteKeywords('nocap (x) => x'), 'async (x) => x'))

test('nah sus across tokens', () =>
  has(substituteKeywords('} nah sus (x > 0) {'), 'else if'))

// ── yeet heuristic ────────────────────────────────────────────────────────────

console.log('\nyeet heuristic')
test('yeet fresh Error → throw new Error', () =>
  eq(substituteKeywords('yeet fresh Error("oops")'), 'throw new Error("oops")'))

test('yeet string → throw', () =>
  eq(substituteKeywords('yeet "oops"'), 'throw "oops"'))

test('yeet obj.prop → delete', () =>
  eq(substituteKeywords('yeet obj.prop'), 'delete obj.prop'))

test('yeet me.field → delete this.field', () =>
  eq(substituteKeywords('yeet me.field'), 'delete this.field'))

// ── string / comment protection ───────────────────────────────────────────────

console.log('\nstring & comment protection')
test('no replacement inside double-quoted string', () => {
  const r = substituteKeywords('"lilbro fuckoff sus nah"')
  has(r, 'lilbro'); has(r, 'fuckoff'); has(r, 'sus')
})
test('no replacement inside single-quoted string', () => {
  const r = substituteKeywords("'bro grind yolo'")
  has(r, 'bro'); has(r, 'grind'); has(r, 'yolo')
})
test('no replacement inside line comment', () => {
  const r = substituteKeywords('// lilbro = cool')
  has(r, 'lilbro'); has(r, 'cool')
})
test('no replacement inside block comment', () => {
  const r = substituteKeywords('/* fuckoff shit */')
  has(r, 'fuckoff'); has(r, 'shit')
})
test('replacement after string continues', () => {
  eq(substituteKeywords('"str" lilbro x = 1'), '"str" let x = 1')
})

// ── word boundary — no partial matches ───────────────────────────────────────

console.log('\nword boundary')
test('broth not replaced', () => eq(substituteKeywords('lilbro broth = 1'), 'let broth = 1'))
test('cooldown not replaced', () => eq(substituteKeywords('lilbro cooldown = 0'), 'let cooldown = 0'))
test('bullshit not replaced', () => eq(substituteKeywords('lilbro bullshit = "yep"'), 'let bullshit = "yep"'))
test('nobleman not replaced', () => not(substituteKeywords('nobleman'), 'this'))

// ── full transpile has runtime ────────────────────────────────────────────────

console.log('\nruntime injection')
test('transpile() prepends runtime block', () => {
  const out = transpile('spam("hi")')
  has(out, 'BroLang Runtime')
  has(out, 'spam("hi")')
})
test('runtime defines spam', () => has(transpile(''), 'const spam'))
test('runtime defines Array.prototype.cook', () => has(transpile(''), 'Array.prototype.cook'))

// ── regex literal protection ──────────────────────────────────────────────────

console.log('\nregex literals')
test('/bro/g not replaced', () =>
  eq(substituteKeywords('lilbro re = /bro/gi'), 'let re = /bro/gi'))

test('/shit|me/g not replaced', () =>
  eq(substituteKeywords('lilbro re = /shit|me/g'), 'let re = /shit|me/g'))

test('division is not regex', () =>
  eq(substituteKeywords('lilbro x = 10 / 2'), 'let x = 10 / 2'))

test('division after identifier is not regex', () =>
  eq(substituteKeywords('lilbro z = total / count'), 'let z = total / count'))

test('regex after = is regex', () =>
  eq(substituteKeywords('lilbro r = /bro/'), 'let r = /bro/'))

test('regex after ( is regex', () =>
  eq(substituteKeywords('sus (/bro/.test(s))'), 'if (/bro/.test(s))'))

test('regex after return is regex', () =>
  eq(substituteKeywords('fuckoff /bro/'), 'return /bro/'))

test('character class with / inside regex not ending early', () =>
  eq(substituteKeywords('lilbro re = /[a/b]/'), 'let re = /[a/b]/'))

// ── template literal ${} substitution ────────────────────────────────────────

console.log('\ntemplate literals')
test('keyword in ${} is substituted', () =>
  eq(substituteKeywords('`val: ${fuckoff x}`'), '`val: ${return x}`'))

test('keyword in nested ${} is substituted', () =>
  eq(substituteKeywords('`${fresh Dog("rex")}`'), '`${new Dog("rex")}`'))

test('string inside template literal not touched', () => {
  const r = substituteKeywords('`hello lilbro world`')
  has(r, 'lilbro')  // plain text inside template, not in ${}, not replaced
})

test('multiple substitutions in one ${}', () =>
  eq(substituteKeywords('`${lilbro x = cool}`'), '`${let x = true}`'))

// ── result ────────────────────────────────────────────────────────────────────

console.log(`\n${passed + failed} tests: \x1b[32m${passed} passed\x1b[0m${failed ? `, \x1b[31m${failed} failed\x1b[0m` : ''}`)
if (failed > 0) process.exit(1)
