import Crafty from "../../crafty";

const correction = 0.225;

const calculateY = (delta, speed) =>
  delta * (speed - (correction - correction * speed));

const ViewportRelativeMotion = "ViewportRelativeMotion";

Crafty.c(ViewportRelativeMotion, {
  viewportRelativeMotion({ x, y, offsetY, speed, xspeed, yspeed }) {
    this._speed = {
      x: xspeed || speed,
      y: yspeed || speed
    };
    if (x != null && y != null) {
      this._startLocation = { x, y };
      const vpx = Crafty.viewport.width / 4;

      const sx =
        x + (x - vpx) * (this._speed.x - 1) - vpx * (this._speed.x - 1);
      const newX = sx + (this.dx || 0);

      const sy = y + calculateY(offsetY, this._speed.y);
      const newY = sy - (this.dy || 0);

      this.attr({ x: Math.floor(newX), y: Math.floor(newY) });
    }

    this.motion = this.bind("CameraMove", ({ dx, dy }) => {
      x = -(dx * this._speed.x);
      y = -calculateY(dy, this._speed.y);

      //newX = @_location.sx - shifted + @dx
      //newY = @_location.sy - (-coords.y * (1 - ((@_speed - 0.225) * 1.2))) + @dy
      this.shift(x, y);
    });
    return this;
  },

  remove() {
    this.unbind("CameraMove", this.motion);
  }
});

export default ViewportRelativeMotion;
