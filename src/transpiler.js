'use strict'

const { KEYWORD_MAP, MULTI_WORD_MAP } = require('./keywords')
const { getRuntimeCode } = require('./runtime')

// JS value-keywords — after these `/` is division, not a regex literal
const EXPR_VALUE_JS = new Set(['true', 'false', 'null', 'undefined', 'this'])

function transpile(source) {
  return getRuntimeCode() + '\n' + substituteKeywords(source)
}

function substituteKeywords(source) {
  let result = ''
  let i = 0
  const len = source.length
  let prevIsExpr = false  // tracks whether `/` should be division or regex start

  while (i < len) {
    const ch = source[i]

    // Single-quoted string
    if (ch === "'") {
      let j = i + 1
      while (j < len) {
        if (source[j] === '\\') { j += 2; continue }
        if (source[j] === "'") { j++; break }
        j++
      }
      result += source.slice(i, j)
      i = j
      prevIsExpr = true
      continue
    }

    // Double-quoted string
    if (ch === '"') {
      let j = i + 1
      while (j < len) {
        if (source[j] === '\\') { j += 2; continue }
        if (source[j] === '"') { j++; break }
        j++
      }
      result += source.slice(i, j)
      i = j
      prevIsExpr = true
      continue
    }

    // Template literal — recurse into ${...} expressions so keywords are substituted there too
    if (ch === '`') {
      result += '`'
      i++
      while (i < len) {
        const c = source[i]
        if (c === '\\') {
          result += source.slice(i, i + 2)
          i += 2
        } else if (c === '`') {
          result += '`'
          i++
          break
        } else if (c === '$' && i + 1 < len && source[i + 1] === '{') {
          result += '${'
          i += 2
          const [inner, endIdx] = extractBraced(source, i, len)
          result += substituteKeywords(inner) + '}'
          i = endIdx
        } else {
          result += c
          i++
        }
      }
      prevIsExpr = true
      continue
    }

    // Line comment
    if (ch === '/' && source[i + 1] === '/') {
      let j = i + 2
      while (j < len && source[j] !== '\n') j++
      result += source.slice(i, j)
      i = j
      // prevIsExpr unchanged — comment is invisible to the grammar
      continue
    }

    // Block comment
    if (ch === '/' && source[i + 1] === '*') {
      let j = i + 2
      while (j < len && !(source[j] === '*' && source[j + 1] === '/')) j++
      j += 2
      result += source.slice(i, j)
      i = j
      continue
    }

    // Regex literal vs division operator
    // Heuristic: if the previous expression-ending token makes `/` a division,
    // treat as division; otherwise treat as the start of a regex literal.
    if (ch === '/') {
      if (!prevIsExpr) {
        // regex literal: /pattern/flags
        let j = i + 1
        while (j < len) {
          if (source[j] === '\\') { j += 2; continue }
          if (source[j] === '[') {
            // character class [...] — `]` doesn't end the regex inside here
            j++
            while (j < len && source[j] !== ']') {
              if (source[j] === '\\') j++
              j++
            }
            if (j < len) j++  // skip ]
            continue
          }
          if (source[j] === '/') { j++; break }
          j++
        }
        // flags: g i m s u y
        while (j < len && /[gimsuy]/.test(source[j])) j++
        result += source.slice(i, j)
        i = j
        prevIsExpr = true
      } else {
        result += ch
        i++
        prevIsExpr = false
      }
      continue
    }

    // Identifier or keyword
    if (/[a-zA-Z_$]/.test(ch)) {
      let j = i + 1
      while (j < len && /[a-zA-Z0-9_$]/.test(source[j])) j++
      const word = source.slice(i, j)

      // Check multi-word patterns first (no newline-crossing)
      let matched = false
      for (const [from, to] of MULTI_WORD_MAP) {
        const parts = from.split(' ')
        if (parts[0] !== word) continue

        let k = j
        let ok = true
        for (let p = 1; p < parts.length; p++) {
          while (k < len && (source[k] === ' ' || source[k] === '\t')) k++
          const ws = k
          while (k < len && /[a-zA-Z0-9_$]/.test(source[k])) k++
          if (source.slice(ws, k) !== parts[p]) { ok = false; break }
        }

        if (ok) {
          result += to
          i = k
          matched = true
          prevIsExpr = false  // multi-word patterns are all statement constructs
          break
        }
      }

      if (!matched) {
        if (word === 'yeet') {
          result += resolveYeet(source, j)
          prevIsExpr = false
        } else {
          const entry = KEYWORD_MAP.find(([from]) => from === word)
          if (entry) {
            result += entry[1]
            prevIsExpr = EXPR_VALUE_JS.has(entry[1])
          } else {
            result += word
            prevIsExpr = true  // plain identifier ends an expression
          }
        }
        i = j
      }
      continue
    }

    // Default: single character — update prevIsExpr based on its role
    result += ch
    i++
    if (ch === ')' || ch === ']' || ch === '}') {
      prevIsExpr = true
    } else if (/[0-9]/.test(ch)) {
      prevIsExpr = true  // digit — part of a number literal
    } else if (/\s/.test(ch)) {
      // whitespace: no change (invisible to grammar)
    } else {
      prevIsExpr = false  // operator or punctuation
    }
  }

  return result
}

// Extract the content inside a matched `{...}` block, handling nested strings,
// template literals, and comments so brace-counting is accurate.
// `start` = index right after the opening `{`.
// Returns [content, indexAfterClosingBrace].
function extractBraced(source, start, len) {
  let depth = 1
  let j = start

  while (j < len) {
    const c = source[j]

    if (c === '{') {
      depth++
      j++
    } else if (c === '}') {
      depth--
      if (depth === 0) break  // j is now at the closing }
      j++
    } else if (c === '"' || c === "'") {
      const q = c
      j++
      while (j < len && source[j] !== q) {
        if (source[j] === '\\') j++
        j++
      }
      if (j < len) j++  // skip closing quote
    } else if (c === '`') {
      // skip template literal body (simplified: doesn't re-count ${} inside)
      j++
      while (j < len && source[j] !== '`') {
        if (source[j] === '\\') { j += 2; continue }
        j++
      }
      if (j < len) j++  // skip closing `
    } else if (c === '/' && j + 1 < len && source[j + 1] === '/') {
      while (j < len && source[j] !== '\n') j++
    } else if (c === '/' && j + 1 < len && source[j + 1] === '*') {
      j += 2
      while (j + 1 < len && !(source[j] === '*' && source[j + 1] === '/')) j++
      if (j + 1 < len) j += 2
    } else {
      j++
    }
  }

  // j is at the closing `}` (depth===0) or at len (unterminated)
  return [source.slice(start, j), j + 1]
}

// Heuristic: `yeet identifier.prop` → `delete`, everything else → `throw`
function resolveYeet(source, afterYeet) {
  let j = afterYeet
  const len = source.length
  while (j < len && (source[j] === ' ' || source[j] === '\t')) j++
  const start = j
  while (j < len && /[a-zA-Z0-9_$]/.test(source[j])) j++
  const nextWord = source.slice(start, j)
  while (j < len && (source[j] === ' ' || source[j] === '\t')) j++
  if (nextWord && source[j] === '.') return 'delete'
  return 'throw'
}

module.exports = { transpile, substituteKeywords }
