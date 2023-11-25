import Crafty from "../crafty";

const ViewportLocked = "ViewportLocked";

Crafty.c(ViewportLocked, {
  events: {
    Move: "checkMotion"
  },

  checkMotion() {
    if (this._x < 0) {
      this.x = 0;
      if (this.vx < 0) this.vx = 0;
    }
    if (this._y < 0) {
      this.y = 0;
      if (this.vy < 0) this.vy = 0;
    }
    const maxX = Crafty.viewport.width - this.w;

    if (this._x > maxX) {
      this.x = maxX;
      if (this.vx > 0) this.vx = 0;
    }
    const maxY = Crafty.viewport.height - this.h;
    if (this._y > maxY) {
      this.y = maxY;
      if (this.vy > 0) this.vy = 0;
    }
  }
});

export default ViewportLocked;
