const PausableMotion = "PausableMotion";

Crafty.c(PausableMotion, {
  required: "Motion",

  init() {
    this.unbind("UpdateFrame", this._linearMotionTick);
    this.bind("GameLoop", this._linearMotionTick);
  }
});

export default PausableMotion;
