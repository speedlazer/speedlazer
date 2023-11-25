import Crafty from "../crafty";

Crafty.c("Invincible", {
  init() {
    this.requires("Delay");
    this.blinkOn = true;
  },

  _blink() {
    this.blinkOn = !this.blinkOn;
    this.alpha = this.blinkOn ? 0.5 : 1.0;
  },

  remove() {
    this.cancelDelay(this._blink);
    this.alpha = 1.0;
  },

  invincibleDuration(duration) {
    this.delay(this._blink, 250, -1);
    if (duration !== -1) {
      this.delay(() => this.removeComponent("Invincible"), duration, 0);
    }
    return this;
  }
});
