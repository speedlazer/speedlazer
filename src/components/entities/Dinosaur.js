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

    this.topLeg = Crafty.e("2D, WebGL, dinoTopLeg, TweenPromise").attr({
      x: this.x + 116,
      y: this.y + 46,
      z: this.z + 2
    }).origin(32, 16)
    this.body.attach(this.topLeg);

    this.tail = Crafty.e("2D, WebGL, dinoTail, TweenPromise").attr({
      x: this.x + 124,
      y: this.y + 24,
      z: this.z + 1
    }).origin(10, 22)
    this.body.attach(this.tail);

    return this
  },

  execute(pose) {
    switch(pose) {
      case "stand": return this.poseStand()
    }
  },

  poseStand() {
    return Promise.all([
      this.body.tweenPromise({ rotation: 60 }, 2000),
      this.arm.tweenPromise({ rotation: -25 }, 2000),
      this.neck.tweenPromise({ rotation: 40 }, 2000),
      this.jaw.tweenPromise({ rotation: 1 }, 2000),
      this.head.tweenPromise({ rotation: 1 }, 2000),
      this.topLeg.tweenPromise({ rotation: 50 }, 2000),
      this.tail.tweenPromise({ rotation: 1 }, 2000)
    ]).then(() => {
      console.log('open jaw')
      return this.jaw.tweenPromise({ rotation: -30 }, 1000)
    })
  }

});
