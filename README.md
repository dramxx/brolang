# BroLang

**File extension:** `.bro`  
**Runtime:** Node.js  
**Transpiles to:** Vanilla JavaScript

---

## Table of Contents

1. [Installation](#installation)
2. [CLI](#cli)
3. [Language Reference](#language-reference)
   - [Variables](#variables)
   - [Functions](#functions)
   - [Control Flow](#control-flow)
   - [Loops](#loops)
   - [Error Handling](#error-handling)
   - [Classes](#classes)
   - [Modules](#modules)
   - [Async / Await](#async--await)
   - [Values & Operators](#values--operators)
4. [Standard Library](#standard-library)
   - [Console](#console)
   - [Timers](#timers)
   - [Math](#math)
   - [Array Methods](#array-methods)
   - [String Methods](#string-methods)
   - [Object Utilities](#object-utilities)
   - [JSON](#json)
   - [Promises](#promises)
   - [DOM](#dom-browser)
   - [Type Checking](#type-checking)
5. [Quick Reference](#quick-reference)

---

## Installation

```sh
npm install -g brolang
```

---

## CLI

```sh
bro run <file.bro>      # Execute a .bro file
bro build <file.bro>    # Transpile to .js
bro check <file.bro>    # Check for syntax errors without running
bro repl                # Start interactive REPL
```

---

## Language Reference

### Variables

Variables are declared with `lilbro`. There is one declaration keyword — BroLang does not distinguish between mutable and immutable at the declaration site.

```js
lilbro name = "Chad"
lilbro count = 0
lilbro isActive = cool
lilbro data = shit
```

```js
let name = "Chad";
let count = 0;
let isActive = true;
let data = null;
```

---

### Functions

Function declarations use `bro`. Functions return values with `fuckoff`.

```js
bro greet(name) {
  fuckoff "Yo " + name
}

lilbro add = bro(a, b) {
  fuckoff a + b
}
```

```js
function greet(name) {
  return "Yo " + name;
}

const add = function (a, b) {
  return a + b;
};
```

Arrow functions use native `=>` syntax unchanged:

```js
lilbro double = (n) => n * 2
lilbro greetAll = (names) => names.cook((n) => greet(n))
```

```js
const double = (n) => n * 2;
const greetAll = (names) => names.map((n) => greet(n));
```

---

### Control Flow

#### Conditionals

```js
sus (score > 90) {
  spam("legend")
} nah sus (score > 50) {
  spam("mid")
} nah {
  spam("skill issue")
}
```

```js
if (score > 90) {
  console.log("legend");
} else if (score > 50) {
  console.log("mid");
} else {
  console.log("skill issue");
}
```

#### Switch

`pickone` evaluates a value against `when` clauses. Use `peace` to exit a case.

```js
pickone (day) {
  when "Monday":
    spam("ugh")
    peace
  when "Friday":
    spam("let's go")
    peace
  whatever:
    spam("whatever")
}
```

```js
switch (day) {
  case "Monday":
    console.log("ugh");
    break;
  case "Friday":
    console.log("let's go");
    break;
  default:
    console.log("whatever");
}
```

---

### Loops

#### Index loop

```js
grind (lilbro i = 0; i < 10; i++) {
  spam(i)
}
```

```js
for (let i = 0; i < 10; i++) {
  console.log(i);
}
```

#### Iteration

```js
vibing (lilbro item of items) {
  spam(item)
}
```

```js
for (let item of items) {
  console.log(item);
}
```

#### Object key enumeration

```js
nosyping (lilbro key in obj) {
  spam(key, obj[key])
}
```

```js
for (let key in obj) {
  console.log(key, obj[key]);
}
```

#### Condition-based loops

```js
keepgoing (queue.howmany > 0) {
  process(queue.yeetfirst())
}

doitonce {
  tryThis()
} keepgoing (failed)
```

```js
while (queue.length > 0) {
  process(queue.shift());
}

do {
  tryThis();
} while (failed);
```

Use `skip` to advance to the next iteration. Use `gtfo` to exit the loop entirely.

```js
vibing (lilbro n of nums) {
  sus (n === 0) { skip }
  sus (n < 0) { gtfo }
  spam(n)
}
```

```js
for (let n of nums) {
  if (n === 0) {
    continue;
  }
  if (n < 0) {
    break;
  }
  console.log(n);
}
```

---

### Error Handling

```js
bro riskyBusiness() {
  yolo {
    lilbro result = doSomethingStupid()
    fuckoff result
  } lol (err) {
    omfg("bruh:", err)
    yeet fresh Error("it broke again")
  } anyway {
    spam("tried my best")
  }
}
```

```js
function riskyBusiness() {
  try {
    let result = doSomethingStupid();
    return result;
  } catch (err) {
    console.error("bruh:", err);
    throw new Error("it broke again");
  } finally {
    console.log("tried my best");
  }
}
```

`yeet` throws any value as an error. When followed by a property access, `yeet` acts as `delete` instead — see [Values & Operators](#values--operators).

---

### Classes

```js
crew Animal {
  setup (name) {
    me.name = name
  }

  speak() {
    fuckoff me.name + " says something"
  }
}

crew Dog extends Animal {
  setup (name) {
    super(name)
  }

  speak() {
    fuckoff me.name + " says woof"
  }
}

lilbro dog = fresh Dog("Rex")
spam(dog.speak())
```

```js
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    return this.name + " says something";
  }
}

class Dog extends Animal {
  constructor(name) {
    super(name);
  }

  speak() {
    return this.name + " says woof";
  }
}

let dog = new Dog("Rex");
console.log(dog.speak());
```

- `crew` defines a class
- `setup()` is the constructor
- `me` is the current instance
- `fresh` instantiates a new object
- `extends`, `super`, and `static` are unchanged from their standard forms

---

### Modules

```js
yoink { useState, useEffect } from 'react'
yoink axios from 'axios'
yoink * as utils from './utils'

shareall bro MyComponent() {
  fuckoff shit
}

share lilbro MAX_RETRIES = 3
```

```js
import { useState, useEffect } from "react";
import axios from "axios";
import * as utils from "./utils";

export default function MyComponent() {
  return null;
}

export let MAX_RETRIES = 3;
```

---

### Async / Await

```js
nocap bro fetchData(url) {
  yolo {
    lilbro res = holdmybeer grab(url)
    lilbro data = holdmybeer res.json()
    fuckoff data
  } lol (err) {
    omfg("fetch failed:", err)
  }
}

lilbro getData = nocap bro(id) {
  fuckoff holdmybeer fetchData("/api/" + id)
}
```

```js
async function fetchData(url) {
  try {
    let res = await fetch(url);
    let data = await res.json();
    return data;
  } catch (err) {
    console.error("fetch failed:", err);
  }
}

const getData = async function (id) {
  return await fetchData("/api/" + id);
};
```

- `nocap bro name()` declares an async named function
- `nocap` alone marks an arrow function as async: `lilbro fn = nocap (x) => doThing(x)`
- `holdmybeer` suspends execution until the awaited expression resolves

---

### Values & Operators

#### Literal values

| BroLang   | Value       |
| --------- | ----------- |
| `cool`    | `true`      |
| `notcool` | `false`     |
| `shit`    | `null`      |
| `idk`     | `undefined` |

```js
lilbro flag = cool
lilbro empty = shit
lilbro unknown = idk
lilbro opposite = notcool
```

```js
let flag = true;
let empty = null;
let unknown = undefined;
let opposite = false;
```

All standard operators work unchanged: `+`, `-`, `*`, `/`, `%`, `===`, `!==`, `&&`, `||`, `??`, `?.`, spread `...`, and so on.

#### Delete

`yeet` before a property access removes that property:

```js
yeet obj.secretField
```

```js
delete obj.secretField;
```

When used with `fresh` (or any non-property expression), `yeet` throws instead:

```js
yeet fresh Error("unacceptable")
```

```js
throw new Error("unacceptable");
```

#### Type inspection

```js
sus (wtf(x) === "number") {
  spam("it's a number")
}

sus (dog ispartof Animal) {
  spam("it's an animal")
}
```

```js
if (typeof x === "number") {
  console.log("it's a number");
}

if (dog instanceof Animal) {
  console.log("it's an animal");
}
```

---

## Standard Library

The BroLang runtime is injected into every `.bro` file automatically. No imports required.

---

### Console

| Function              | Description                        |
| --------------------- | ---------------------------------- |
| `spam(...args)`       | Log to stdout                      |
| `omfg(...args)`       | Log to stderr                      |
| `omg(...args)`        | Log a warning                      |
| `spreadshit(data)`    | Print tabular data                 |
| `debugshit(...args)`  | Debug output                       |
| `clearshit()`         | Clear the console                  |
| `timeshit(label)`     | Start a named timer                |
| `timeshitdone(label)` | End a timer and print elapsed time |

```js
spam("hello world");
omfg("critical failure");
omg("this seems sketchy");
spreadshit(users);
timeshit("load");
loadData();
timeshitdone("load");
```

```js
console.log("hello world");
console.error("critical failure");
console.warn("this seems sketchy");
console.table(users);
console.time("load");
loadData();
console.timeEnd("load");
```

---

### Timers

| Function               | Description                          |
| ---------------------- | ------------------------------------ |
| `laterbruh(fn, ms)`    | Execute `fn` after `ms` milliseconds |
| `keepspamming(fn, ms)` | Execute `fn` every `ms` milliseconds |
| `nevermind(id)`        | Cancel a `laterbruh` timer           |
| `shutup(id)`           | Cancel a `keepspamming` interval     |

```js
lilbro id = laterbruh(bro() {
  spam("finally")
}, 3000)

lilbro ticker = keepspamming(bro() {
  spam("tick")
}, 1000)

nevermind(id)
shutup(ticker)
```

```js
let id = setTimeout(function () {
  console.log("finally");
}, 3000);

let ticker = setInterval(function () {
  console.log("tick");
}, 1000);

clearTimeout(id);
clearInterval(ticker);
```

---

### Math

| Function                | Description            |
| ----------------------- | ---------------------- |
| `dice()`                | Random float in [0, 1) |
| `lowball(n)`            | Floor                  |
| `highball(n)`           | Ceiling                |
| `ballpark(n)`           | Round                  |
| `bigbro(...n)`          | Maximum value          |
| `smolbro(...n)`         | Minimum value          |
| `nominus(n)`            | Absolute value         |
| `whatroot(n)`           | Square root            |
| `tothepower(base, exp)` | Exponentiation         |
| `PI`                    | 3.14159...             |

```js
lilbro rand = lowball(dice() * 100)
lilbro hyp = whatroot(tothepower(a, 2) + tothepower(b, 2))
lilbro capped = smolbro(bigbro(val, 0), 100)
```

```js
let rand = Math.floor(Math.random() * 100);
let hyp = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
let capped = Math.min(Math.max(val, 0), 100);
```

---

### Array Methods

Available on all arrays via prototype extension.

| Method                     | Description                            |
| -------------------------- | -------------------------------------- |
| `.cook(fn)`                | Transform each element                 |
| `.keeponly(fn)`            | Filter elements                        |
| `.smashdown(fn, init)`     | Reduce to a single value               |
| `.vibecheck(fn)`           | Iterate without collecting results     |
| `.findone(fn)`             | First element matching predicate       |
| `.findindex(fn)`           | Index of first match                   |
| `.gotthis(val)`            | Test element inclusion                 |
| `.allfine(fn)`             | Test if all elements satisfy predicate |
| `.anyonegood(fn)`          | Test if any element satisfies          |
| `.stuffin(val)`            | Append element                         |
| `.yeetlast()`              | Remove and return last element         |
| `.stufffirst(val)`         | Prepend element                        |
| `.yeetfirst()`             | Remove and return first element        |
| `.glue(sep)`               | Join elements into a string            |
| `.cutout(s, e)`            | Extract subarray                       |
| `.surgery(s, d, ...items)` | In-place insertion/removal             |
| `.sortitout(fn)`           | Sort in place                          |
| `.flipit()`                | Reverse in place                       |
| `.flatten()`               | Flatten one level of nesting           |
| `.flatmash(fn)`            | Map then flatten                       |
| `.howmany`                 | Element count (property, not method)   |

```js
lilbro nums = [1, 2, 3, 4, 5]

lilbro result = nums
  .keeponly(bro(n) { fuckoff n % 2 === 0 })
  .cook(bro(n) { fuckoff n * 10 })
  .smashdown(bro(acc, n) { fuckoff acc + n }, 0)

spam(result)         // 60
spam(nums.howmany)   // 5
```

```js
let nums = [1, 2, 3, 4, 5];

let result = nums
  .filter((n) => n % 2 === 0)
  .map((n) => n * 10)
  .reduce((acc, n) => acc + n, 0);

console.log(result); // 60
console.log(nums.length); // 5
```

---

### String Methods

Available on all strings via prototype extension.

| Method                  | Description                            |
| ----------------------- | -------------------------------------- |
| `.chop(sep)`            | Split into array                       |
| `.cleanitup()`          | Trim leading and trailing whitespace   |
| `.cleanfront()`         | Trim leading whitespace only           |
| `.cleanback()`          | Trim trailing whitespace only          |
| `.gotthis(sub)`         | Test substring inclusion               |
| `.swapout(old, new)`    | Replace first occurrence               |
| `.swapallout(old, new)` | Replace all occurrences                |
| `.smallify()`           | Lowercase                              |
| `.bigify()`             | Uppercase                              |
| `.startswith(s)`        | Test prefix                            |
| `.endswith(s)`          | Test suffix                            |
| `.pad(n, char)`         | Left-pad to target length              |
| `.padback(n, char)`     | Right-pad to target length             |
| `.cutout(s, e)`         | Substring extraction                   |
| `.atpos(i)`             | Character at index                     |
| `.numcode(i)`           | Character code at index                |
| `.howlong`              | Character count (property, not method) |

```js
lilbro str = "  Hello World  "
spam(str.cleanitup().smallify())    // "hello world"
spam(str.cleanitup().chop(" "))     // ["Hello", "World"]
spam(str.howlong)                   // 15
```

```js
let str = "  Hello World  ";
console.log(str.trim().toLowerCase()); // "hello world"
console.log(str.trim().split(" ")); // ["Hello", "World"]
console.log(str.length); // 15
```

---

### Object Utilities

| Function                   | Description                            |
| -------------------------- | -------------------------------------- |
| `listkeys(obj)`            | Array of own enumerable keys           |
| `listvals(obj)`            | Array of own enumerable values         |
| `listpairs(obj)`           | Array of `[key, value]` pairs          |
| `mash(target, ...sources)` | Merge sources into target (mutates)    |
| `frozensolid(obj)`         | Prevent any modification to object     |
| `sealitup(obj)`            | Prevent adding or deleting properties  |
| `freshobj(proto)`          | Create new object with given prototype |

```js
lilbro person = { name: "Chad", age: 42 }
lilbro extended = mash({}, person, { role: "admin" })

vibing (lilbro [key, val] of listpairs(person)) {
  spam(`${key}: ${val}`)
}
```

```js
let person = { name: "Chad", age: 42 };
let extended = Object.assign({}, person, { role: "admin" });

for (let [key, val] of Object.entries(person)) {
  console.log(`${key}: ${val}`);
}
```

---

### JSON

| Function                | Description                          |
| ----------------------- | ------------------------------------ |
| `textify(val)`          | Serialize value to JSON string       |
| `textifypretty(val, n)` | Serialize with `n`-space indentation |
| `untext(str)`           | Parse JSON string to value           |

```js
lilbro payload = { name: "BroLang", version: 1 }
lilbro json = textifypretty(payload, 2)
spam(json)

lilbro parsed = untext(json)
spam(parsed.name)
```

```js
let payload = { name: "BroLang", version: 1 };
let json = JSON.stringify(payload, null, 2);
console.log(json);

let parsed = JSON.parse(json);
console.log(parsed.name);
```

---

### Promises

`pinkyswear` is the Promise interface. Use `fresh pinkyswear(fn)` to construct a new promise.

| Expression                    | Description                           |
| ----------------------------- | ------------------------------------- |
| `fresh pinkyswear(fn)`        | Create a new promise                  |
| `pinkyswear.sorted(val)`      | Resolved promise wrapping `val`       |
| `pinkyswear.noped(err)`       | Rejected promise with `err`           |
| `pinkyswear.waitforall(arr)`  | Resolve when all promises resolve     |
| `pinkyswear.firstfinish(arr)` | Settle when first promise settles     |
| `pinkyswear.nodrama(arr)`     | Wait for all, regardless of rejection |

Promise chain methods:

| Method              | Description                |
| ------------------- | -------------------------- |
| `.thendo(fn)`       | Run `fn` on fulfillment    |
| `.otherwise(fn)`    | Run `fn` on rejection      |
| `.nomatterwhat(fn)` | Run `fn` on either outcome |

```js
lilbro p = fresh pinkyswear(bro(win, fail) {
  sus (condition) {
    win("sorted!")
  } nah {
    fail("noped")
  }
})

p
  .thendo(bro(val) { spam(val) })
  .otherwise(bro(err) { omfg(err) })
  .nomatterwhat(bro() { spam("done") })
```

```js
let p = new Promise(function (resolve, reject) {
  if (condition) {
    resolve("sorted!");
  } else {
    reject("noped");
  }
});

p.then((val) => console.log(val))
  .catch((err) => console.error(err))
  .finally(() => console.log("done"));
```

---

### DOM (Browser)

DOM helpers are available in browser environments. In Node.js, query functions return `null` or `[]` stubs.

| Function / Property        | Description                         |
| -------------------------- | ----------------------------------- |
| `findthisshit(id)`         | Element by ID                       |
| `findme(sel)`              | First element matching CSS selector |
| `findallofthem(sel)`       | All elements matching CSS selector  |
| `makething(tag)`           | Create a new element                |
| `.whenthishappens(ev, fn)` | Attach event listener               |
| `.stoplistening(ev, fn)`   | Remove event listener               |
| `.addtodoc(child)`         | Append child node                   |
| `.kickout(child)`          | Remove child node                   |
| `.text`                    | Get/set text content (property)     |
| `.html`                    | Get/set inner HTML (property)       |
| `.classes`                 | ClassList reference                 |
| `.attr(name, val)`         | Set attribute                       |
| `.getattr(name)`           | Get attribute                       |

```js
lilbro btn = findme("#submit")

btn.whenthishappens("click", bro(e) {
  lilbro div = makething("div")
  div.text = "Submitted!"
  div.classes.add("success")
  findme("#output").addtodoc(div)
})
```

```js
let btn = document.querySelector("#submit");

btn.addEventListener("click", function (e) {
  let div = document.createElement("div");
  div.textContent = "Submitted!";
  div.classList.add("success");
  document.querySelector("#output").appendChild(div);
});
```

---

### Type Checking

| Function       | Description                                             |
| -------------- | ------------------------------------------------------- |
| `wtf(x)`       | Type of `x` as a string                                 |
| `x ispartof Y` | `true` if `x` is an instance of `Y`                     |
| `isalist(x)`   | `true` if `x` is an array                               |
| `isnothing(x)` | `true` if `x` is `shit` (`null`) or `idk` (`undefined`) |
| `exists(x)`    | `true` if `x` is neither `shit` nor `idk`               |

```js
sus (isnothing(user)) {
  fuckoff
}

sus (isalist(data)) {
  data.vibecheck(bro(item) {
    sus (wtf(item.id) === "number") {
      spam(item.id)
    }
  })
}
```

```js
if (user === null || user === undefined) {
  return;
}

if (Array.isArray(data)) {
  data.forEach(function (item) {
    if (typeof item.id === "number") {
      console.log(item.id);
    }
  });
}
```

---

## Quick Reference

```
lilbro x = 5              Variable declaration
bro name(args) {}         Function declaration
fuckoff value             Return value
sus(cond) {} nah {}       If / else
nah sus(cond) {}          Else if
pickone(val) {}           Switch
when x:                   Case
whatever:                 Default
grind(i=0; i<n; i++) {}   For loop
vibing(x of list) {}      For...of
nosyping(k in obj) {}     For...in
keepgoing(cond) {}        While
doitonce {} keepgoing(c)  Do...while
gtfo / peace              Break
skip                      Continue
yolo {} lol(e) {}         Try / catch
anyway {}                 Finally
yeet value                Throw
yeet obj.prop             Delete property
crew Name {}              Class declaration
setup() {}                Constructor
me                        Instance reference (this)
fresh ClassName()         Instantiation (new)
yoink { x } from 'y'      Named import
yoink x from 'y'          Default import
share lilbro x = 5        Named export
shareall                  Default export
nocap bro name() {}       Async function
holdmybeer expr           Await expression
cool / notcool            true / false
shit / idk                null / undefined
wtf(x)                    typeof x
x ispartof Y              x instanceof Y
```

---

_BroLang — because someone had to do it._
