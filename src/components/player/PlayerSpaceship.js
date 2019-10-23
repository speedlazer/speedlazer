import defaults from "lodash/defaults";
import Acceleration from "src/components/generic/Acceleration";
import ColorEffects from "src/components/ColorEffects";
import Listener from "src/components/generic/Listener";

const PlayerSpaceship = "PlayerSpaceship";

Crafty.c(PlayerSpaceship, {
  required: [
    "2D, WebGL, playerShip",
    ColorEffects,
    Listener,
    "Collision, SunBlock, PlayerControlledShip",
    Acceleration
  ].join(","),

  init() {
    this.attr({ w: 71, h: 45 });
    this.collision([21, 13, 56, 13, 66, 32, 35, 32]);

    this.currentRenderedSpeed = 0;
    this.flip("X");
  },

  updateMovementVisuals(rotation, dx, dy, dt) {
    if (rotation == null) {
      rotation = 0;
    }
    const velocity = Math.max(dx * (1000 / dt), 0);

    if (dy > 0) {
      this.healthPerc < 0.3 ? this.sprite(13, 53) : this.sprite(7, 52);
    } else if (dy < 0) {
      this.healthPerc < 0.3 ? this.sprite(13, 51) : this.sprite(10, 52);
    } else {
      this.healthPerc < 0.3 ? this.sprite(0, 50) : this.sprite(0, 48);
    }

    this.rotation = 0;
    this._updateFlyingSpeed(velocity);
    this.rotation = rotation;
  },

  _updateFlyingSpeed(newSpeed) {
    const correction =
      newSpeed < 30 ? newSpeed / 2 : 15 + (newSpeed / 400) * 100;

    if (this.currentRenderedSpeed > correction) {
      this.currentRenderedSpeed -= 12;
    } else if (this.currentRenderedSpeed < correction) {
      this.currentRenderedSpeed += 12;
    }
    if (this.currentRenderedSpeed < 0) {
      this.currentRenderedSpeed = 0;
    }

    const w = 10 + this.currentRenderedSpeed;

    const h = Math.min(w / 3, 15);
    this.backFire.attr({
      x: this.x - w + 9,
      y: this.y + 20 - Math.floor(h / 2),
      w,
      h
    });
  },

  start() {
    this.backFire = Crafty.e(
      ["2D, WebGL, shipEngineFire", ColorEffects, "SpriteAnimation"].join(", ")
    );
    this.backFire.reel("burn", 300, [[4, 53, 3, 1], [3, 48, 3, 1]]);
    this.backFire.timing = 0;
    this.backFire.animate("burn", -1);
    const w = 68;
    const h = 10;

    this.backFire.attr({
      x: this.x - w,
      y: this.y + 20 - Math.floor(h / 2),
      w,
      h,
      alpha: 0.8,
      z: this.z - 1
    });
    this.attach(this.backFire);

    const c = {};
    const basicC = {
      _red: 255,
      _green: 255,
      _blue: 255
    };
    Crafty.assignColor(this.playerColor, c);

    ["_red", "_green", "_blue"].forEach(comp => {
      const newC = (c[comp] + basicC[comp] + basicC[comp]) / 3;
      c[comp] = newC;
    });

    this.trailColor = c;
    this.backFire.colorOverride(c);

    this.addComponent("Invincible").invincibleDuration(1500);

    this.bind("GameLoop", function(fd) {
      const motionX = ((this.vx + this._currentSpeed.x) / 1000.0) * fd.dt;
      const motionY = ((this.vy + this._currentSpeed.y) / 1000.0) * fd.dt;

      this.updateAcceleration();

      const r = this.rotation;
      const newR = motionY;
      let nr = r;
      if (r < newR) {
        nr += 1;
      } else if (r > newR) {
        nr -= 1;
      }

      this.rotation = nr;
      this.updateMovementVisuals(this.rotation, motionX, motionY, fd.dt);
    });

    return this;
  },

  forcedSpeed(speed, options = {}) {
    this.targetSpeed(speed, options);
  },

  controlPrimary(onOff) {},

  controlSwitch(onOff) {},

  controlSecondary(onOff) {},

  controlBlock(onOff) {},

  scoreText(text, settings = {}) {
    settings = defaults(settings, {
      positive: true,
      location: { x: this.x, y: this.y },
      attach: true,
      duration: 1000,
      distance: 70,
      delay: 400
    });

    let location =
      typeof settings.location === "function" ? settings.location() : undefined;
    if (location) {
      location = {
        x: location.x,
        y: location.y
      };
    }

    if (location == null) {
      ({ location } = settings);
    }

    const t = Crafty.e("Text, DOM, 2D, Tween, Delay")
      .textColor(settings.positive ? "#DDD" : "#F00")
      .text(text)
      .attr({
        x: location.x,
        y: location.y - 10,
        z: 990,
        w: 250,
        alpha: 0.75
      })
      .textFont({
        size: "10px",
        weight: "bold",
        family: "Press Start 2P"
      });
    if (settings.attach) {
      this.attach(t);
    }
    t.delay(() => {
      if (settings.attach) {
        this.detach(t);
      }
      t.tween(
        { rotation: 0, y: t.y - settings.distance, alpha: 0.5 },
        settings.duration,
        "easeInQuad"
      );
      t.one("TweenEnd", () => t.destroy());
    }, settings.delay);
  }
});

export default PlayerSpaceship;
