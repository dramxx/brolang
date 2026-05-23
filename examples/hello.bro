// hello.bro — the classic first program, but make it bro

bro greet(name) {
  fuckoff "Yo, " + name + "! Welcome to BroLang."
}

lilbro name = "Chad"
spam(greet(name))

// Arrays
lilbro nums = [1, 2, 3, 4, 5]
lilbro doubled = nums.cook(bro(n) { fuckoff n * 2 })
lilbro evens   = nums.keeponly(bro(n) { fuckoff n % 2 === 0 })
lilbro total   = nums.smashdown(bro(acc, n) { fuckoff acc + n }, 0)

spam("doubled:", doubled)
spam("evens:",   evens)
spam("total:",   total)
spam("count:",   nums.howmany)

// Control flow
sus (total > 10) {
  spam("big number energy")
} nah sus (total > 5) {
  spam("mid number energy")
} nah {
  spam("smol number energy")
}

// Loop
grind(lilbro i = 0; i < 3; i++) {
  spam("lap", i)
}

// Error handling
bro riskyBusiness() {
  yolo {
    yeet fresh Error("something broke lol")
  } lol(err) {
    omfg("caught:", err.message)
  } anyway {
    spam("tried my best")
  }
}

riskyBusiness()
