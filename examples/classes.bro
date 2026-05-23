// classes.bro — OOP but make it bro

crew Animal {
  setup(name, sound) {
    me.name = name
    me.sound = sound
  }

  speak() {
    fuckoff me.name + " says " + me.sound
  }

  static describe() {
    fuckoff "Animals are cool bro"
  }
}

crew Dog extends Animal {
  setup(name) {
    super(name, "woof")
    me.tricks = []
  }

  learn(trick) {
    me.tricks.stuffin(trick)
  }

  showoff() {
    sus (me.tricks.howmany === 0) {
      spam(me.name + " doesn't know any tricks yet, sad")
      fuckoff
    }
    spam(me.name + " knows: " + me.tricks.glue(", "))
  }
}

lilbro dog = fresh Dog("Rex")
spam(dog.speak())
dog.learn("sit")
dog.learn("roll over")
dog.learn("vibe")
dog.showoff()
spam(Animal.describe())
