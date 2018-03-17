Crafty.c("Dinosaur", {
  required: "2D, WebGL", //, Color",

  init() {
    //this.color("#FFFFFF");
    this.attr({
      w: 200,
      h: 200
    });
  },

  dinosaur(props) {
    this.attr(props);

    this.body = Crafty.e("2D, WebGL, dinoBody, TweenPromise").attr({
      x: this.x,
      y: this.y,
      z: this.z + 2
    }).origin(132, 64)
    this.attach(this.body);

    this.arm = Crafty.e("2D, WebGL, dinoArm, TweenPromise").attr({
      x: this.x + 16,
      y: this.y + 82,
      z: this.z + 3
    }).origin(34, 16)
    this.body.attach(this.arm);

    this.neck = Crafty.e("2D, WebGL, dinoNeck, TweenPromise").attr({
      x: this.x - 32,
      y: this.y + 42,
      z: this.z + 1
    }).origin(50, 16)
    this.body.attach(this.neck);

    this.jaw = Crafty.e("2D, WebGL, dinoJaw, TweenPromise").attr({
      x: this.x - 89,
      y: this.y + 52,
      z: this.z + 1
    }).origin(70, 16)
    this.neck.attach(this.jaw);

    this.head = Crafty.e("2D, WebGL, dinoHead, TweenPromise").attr({
      x: this.x - 94,
      y: this.y + 26,
      z: this.z + 2
    }).origin(70, 40)
    this.neck.attach(this.head);

    this.tail = Crafty.e("2D, WebGL, dinoTail, TweenPromise").attr({
      x: this.x + 124,
      y: this.y + 24,
      z: this.z + 1,
    }).origin(10, 22)
    this.body.attach(this.tail);

    this.topLeg = Crafty.e("2D, WebGL, dinoTopLeg, TweenPromise").attr({
      x: this.x + 116,
      y: this.y + 46,
      z: this.z + 2
    }).origin(32, 16)
    this.body.attach(this.topLeg);

    this.bottomLeg = Crafty.e("2D, WebGL, dinoLowerLeg, TweenPromise").attr({
      x: this.topLeg.x + 28,
      y: this.topLeg.y + 40,
      z: this.topLeg.z + 1,
      rotation: -55
    }).origin(16, 16)
    this.topLeg.attach(this.bottomLeg);

    this.feet = Crafty.e("2D, WebGL, dinoFeet, TweenPromise").attr({
      x: this.bottomLeg.x + 28,
      y: this.bottomLeg.y + 30,
      z: this.bottomLeg.z + 1,
      rotation: 0
    }).origin(26, 8)
    this.bottomLeg.attach(this.feet);

    this.toes = Crafty.e("2D, WebGL, dinoToes, TweenPromise").attr({
      x: this.feet.x - 22,
      y: this.feet.y + 2,
      z: this.feet.z + 1,
      rotation: 0
    }).origin(22, 20)
    this.feet.attach(this.toes);

    return this
  },

  execute(pose) {
    switch(pose) {
      case "stand": return this.poseStand()
    }
  },

  async setPose(rotations, duration) {
    const elements = Object.keys(rotations)
    await Promise.all(
      elements.map(element =>
        this[element].tweenPromise({ rotation: rotations[element] }, duration)
      )
    )
  },

  async poseStand() {
    await this.setPose({
      body: 60,
      arm: -25,
      neck: 40,
      jaw: 1,
      head: 1,
      topLeg: 50,
      tail: 20,
      bottomLeg: -60,
      feet: -10,
      toes: 10
    }, 2000)

    await this.setPose({
      jaw: -30,
      head: 20,
    }, 1000)
  }

});
