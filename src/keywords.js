'use strict'

// Multi-word patterns — checked FIRST, only horizontal whitespace is skipped
// between parts (no newline-crossing to avoid surprises).
// Format: [broLangPattern, jsEquivalent]
const MULTI_WORD_MAP = [
  ['nocap bro', 'async function'],
  ['nah sus',   'else if'],
]

// Single-word keyword substitutions.
// With word-boundary matching, ordering only matters to break ties on prefix
// overlaps — there are none here, so order is just for readability.
const KEYWORD_MAP = [
  // Declarations
  ['lilbro',      'let'],
  ['crew',        'class'],
  ['setup',       'constructor'],
  ['fresh',       'new'],

  // Functions / async
  ['bro',         'function'],
  ['nocap',       'async'],
  ['holdmybeer',  'await'],
  ['fuckoff',     'return'],

  // Control flow
  ['sus',         'if'],
  ['nah',         'else'],
  ['pickone',     'switch'],
  ['when',        'case'],
  ['whatever',    'default'],

  // Loops
  ['nosyping',    'for'],
  ['vibing',      'for'],
  ['grind',       'for'],
  ['keepgoing',   'while'],
  ['doitonce',    'do'],
  ['gtfo',        'break'],
  ['peace',       'break'],
  ['skip',        'continue'],

  // Error handling
  ['yolo',        'try'],
  ['lol',         'catch'],
  ['anyway',      'finally'],
  // 'yeet' is handled separately (throw vs delete heuristic)

  // Modules
  ['shareall',    'export default'],
  ['yoink',       'import'],
  ['share',       'export'],

  // Operators / misc
  ['ispartof',    'instanceof'],
  ['wtf',         'typeof'],
  ['me',          'this'],

  // Literals
  ['cool',        'true'],
  ['notcool',     'false'],
  ['shit',        'null'],
  ['idk',         'undefined'],
]

module.exports = { KEYWORD_MAP, MULTI_WORD_MAP }
