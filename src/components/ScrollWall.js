import { Noise } from "noisejs";
import { lookup } from "src/lib/random";
import Acceleration from "src/components/generic/Acceleration";

const noise = new Noise(lookup());

Crafty.c("ScrollWall", {
  init() {
    this.requires("2D, ShipSolid, Collision", Acceleration);
    this.trauma = 0;
    this.time = 0;
    this.attr({
      x: 0,
      y: 0,
      w: 2,
      h: Crafty.viewport.height,
      speed: {
        x: 0,
        y: 0
      },
      viewHeight: 0
    });

    this.wallEnd = Crafty.e("2D, ScrollFront, ShipSolid").attr({
      x: -(Crafty.viewport.x - Crafty.viewport.width) - 3,
      y: 0,
      h: Crafty.viewport.height,
      w: 12
    });
    this.attach(this.wallEnd);

    this.wallTop = Crafty.e("2D, ShipSolid, Collision").attr({
      x: 0,
      y: 40,
      h: 2,
      w: Crafty.viewport.width
    });
    this.attach(this.wallTop);

    this.wallBottom = Crafty.e("2D, ShipSolid, Collision").attr({
      x: 0,
      y: Crafty.viewport.height - 2,
      h: 2,
      w: Crafty.viewport.width
    });
    this.attach(this.wallBottom);

    return this.bind("GameLoop", function(fd) {
      const speedX = this._currentSpeed.x;
      const speedY = this._currentSpeed.y;
      this.updateAcceleration();

      // TODO: While this is currently not in use,
      // It would be awesome if the player could move the camera vertically. (If allowed)
      // Or horizontally (when allowed)
      // This could allow gameplay through mazes where the player has to find the way on their own
      //
      //if @allowPushing
      //# When the ships are in the first 30% of the screen,
      //# speed up the camera.
      //Crafty('PlayerControlledShip').each ->
      //threshold = Crafty.viewport.width * (2.0 / 3.0)
      //relOffset = @x + Crafty.viewport.x
      //if relOffset > threshold
      //percentageOutOfBounds = (relOffset - threshold) / (Crafty.viewport.width - threshold)
      //increase = (5 + @_forcedSpeed.x) * percentageOutOfBounds

      //if speedX > 0 # Prevend division by zero
      //percentage = (speedX + increase) / speedX
      //speedY *= percentage

      //speedX += increase

      // the speed is px / sec
      // the time passed is fd.dt in milliseconds

      const screenshake = Math.pow(this.trauma, 2);
      this.trauma = Math.max(0, this.trauma - 0.001 * fd.dt);
      let x = 0;
      let y = 0;
      if (screenshake > 0) {
        const MAX_X_OFFSET = 50;
        const MAX_Y_OFFSET = 40;

        this.time += fd.dt;

        const xn = noise.perlin2(0.1, this.time / ((3 - this.trauma) * 360));
        const yn = noise.perlin2(this.time / ((3 - this.trauma) * 360), 0.3);
        x = 0 + Math.round(MAX_X_OFFSET * screenshake * xn);
        y = 0 + Math.round(MAX_Y_OFFSET * screenshake * yn);
      }

      Crafty.viewport.x = x;
      Crafty.viewport.y = y;

      const dx = (speedX / 1000.0) * fd.dt;
      const dy = (speedY / 1000.0) * fd.dt;
      this.viewHeight += dy;

      Crafty.trigger("CameraMove", {
        dx,
        dy
      });
    });
  },

  addTrauma(amount) {
    this.trauma = Math.min(1, this.trauma + amount);
  },

  scrollWall(speed, options = {}) {
    this.targetSpeed(speed, options);
  },

  setAllowPushing(allowPushing) {
    this.allowPushing = allowPushing;
  },

  off() {
    this.wallEnd.removeComponent("ShipSolid");
    this.unbind("GameLoop");
  },

  remove() {
    this.unbind("GameLoop");
  }
});
