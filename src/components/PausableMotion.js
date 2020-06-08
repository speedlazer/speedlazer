const PausableMotion = "PausableMotion";

Crafty.c(PausableMotion, {
  required: "Motion",

  init() {
    this._motionPaused = false;
  },

  pauseMotion() {
    if (this._motionPaused) return;
    this._motionPaused = true;
    this._pausedProps = {
      vx: this.vx,
      vy: this.vy,
      ax: this.ax,
      ay: this.ay
    };
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;
  },

  resumeMotion() {
    if (!this._motionPaused) return;
    this._motionPaused = false;
    this.vx = this._pausedProps.vx;
    this.vy = this._pausedProps.vy;
    this.ax = this._pausedProps.ax;
    this.ay = this._pausedProps.ay;
  }
});

export default PausableMotion;
