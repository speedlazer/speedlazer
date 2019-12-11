import createEntityPool from "src/lib/entityPool";
import { lookup } from "src/lib/random";
import ColorEffects from "src/components/ColorEffects";

Crafty.c("GameParticle", {
  events: {
    CameraPan({ dx, dy }) {
      this.shift(-dx, -dy);
    }
  },

  particle(props) {
    this.duration = props.duration != null ? props.duration : 100;
    this.running = 0;

    this.uniqueBind("GameLoop", this._onGameLoop);
    return this;
  },

  _onGameLoop(fd) {
    this.running += fd.dt;
    if (this.running > this.duration) {
      this.unbind("GameLoop", this._onGameLoop);
      this.trigger("ParticleEnded", this);
    }
  }
});

Crafty.c("Explode", {
  required: "explosionStart, SpriteAnimation",
  init() {
    this.reel("explodeReset", 20, [[0, 0]]);
  },

  playExplode(duration) {
    const reel = this.getReel("explode");
    if (reel && reel.duration === duration) {
      this.animate("explode");
      return this;
    }
    this.animate("explodeReset");
    this.reel("explode", duration, [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],

      [0, 1],
      [1, 1],
      [2, 1],
      [3, 1],
      [4, 1],

      [0, 2],
      [1, 2],
      [2, 2],
      [3, 2],
      [4, 2],

      [0, 3],
      [1, 3]
    ]);
    this.animate("explode");
    return this;
  }
});

Crafty.c("PausableMotion", {
  required: "Motion",
  events: {
    GamePause: "_handlePause"
  },

  init() {
    return (this._pausingProps = {});
  },

  _handlePause(pausing) {
    const motionProps = ["_vx", "_vy", "_ax", "_ay"];
    if (pausing) {
      this._pausingProps = {};
      motionProps.forEach(prop => {
        this._pausingProps[prop] = this[prop];
      });
      this.resetMotion();
    } else {
      motionProps.forEach(prop => {
        this[prop] = this._pausingProps[prop] || 0;
      });
    }
  }
});

const splashPool = createEntityPool(
  () =>
    Crafty.e(
      "2D, WebGL, Explode",
      ColorEffects,
      "GameParticle, PausableMotion, Tween"
    ).colorOverride("#FFFFFF"),
  200
);

Crafty.c("WaterSplashes", {
  events: {
    GameLoop: "_waterSplashes"
  },

  init() {
    this.cooldown = 0;
    if (this.defaultWaterCooldown == null) {
      this.defaultWaterCooldown = 70;
    }
    if (this.waterRadius == null) {
      this.waterRadius = 5;
    }
    if (this.minSplashDuration == null) {
      this.minSplashDuration = 210;
    }
    this.detectionOffset = 0;
    this.minOffset = -10;
    if (this.waterAlpha == null) {
      this.waterAlpha = 0.6;
    }
    this.splashUpwards = false;
  },

  setDetectionOffset(detectionOffset, minOffset) {
    this.detectionOffset = detectionOffset;
    if (minOffset == null) {
      minOffset = -10;
    }
    this.minOffset = minOffset;
    return this;
  },

  _waterSplashes(fd) {
    if (Game.explosionMode != null) {
      return;
    }
    this.cooldown -= fd.dt;
    const sealevel = Crafty.s("SeaLevel").getSeaLevel(this.scale);
    const flySpeed = Crafty("ScrollWall")._currentSpeed.x;

    if (
      this.y + this.h + this.detectionOffset > sealevel &&
      this.y < sealevel &&
      this.cooldown <= 0
    ) {
      const speed =
        this.waterSplashSpeed != null
          ? this.waterSplashSpeed
          : this.defaultSpeed;
      this.cooldown = this.defaultWaterCooldown;
      let upwards = 1;
      if (this._lastWaterY !== this.y && this.splashUpwards) {
        upwards = (speed - 20) / 30;
      }

      upwards *= this.scale != null ? this.scale : 1;

      const coverage = 45;
      const parts = this.w / coverage;
      const vy = Math.min(Math.abs((this.vy || 0) / 3), 100);
      for (
        let i = 0, end = parts, asc = 0 <= end;
        asc ? i < end : i > end;
        asc ? i++ : i--
      ) {
        for (
          let d = 0, end1 = Math.min(upwards, 3), asc1 = 0 <= end1;
          asc1 ? d < end1 : d > end1;
          asc1 ? d++ : d--
        ) {
          const pos = lookup();
          const duration = (this.minSplashDuration + vy * 4 + pos * 100) * 3;
          const factor = 210 / this.minSplashDuration;

          const particleX =
            this.x + i * coverage + pos * coverage - this.waterRadius * 2;
          const particleY = sealevel + this.minOffset - this.waterRadius * 2;

          // Prevent particles to spawn to far out of screen.
          const OFFSET = 100;
          if (
            particleX + OFFSET < Crafty.viewport.x ||
            particleX - OFFSET > Crafty.viewport.x + Crafty.viewport.width ||
            particleY + OFFSET < Crafty.viewport.y ||
            particleY - OFFSET > Crafty.viewport.y + Crafty.viewport.height
          ) {
            continue;
          }

          splashPool
            .get()
            .attr({
              x: particleX,
              y: particleY,
              z: 3,
              w: this.waterRadius * 4,
              h: this.waterRadius * 4,
              alpha: this.waterAlpha * (0.5 + pos * 0.5),
              topDesaturation: this.topDesaturation,
              bottomDesaturation: this.bottomDesaturation,
              vy: (-10 - vy - vy) * factor * pos,
              ay: (30 + vy + vy) * (0.5 + factor * 0.5) * pos,
              vx: -flySpeed
            })
            .one("ParticleEnded", e => splashPool.recycle(e))
            .playExplode(duration)
            .tween(
              {
                alpha: 0.2,
                w: this.waterRadius * 4 + this.waterRadius * 2 * pos,
                h: this.waterRadius * 4 + this.waterRadius * 2 * pos
              },
              duration * 5 * pos
            )
            .particle({
              duration
            });
        }
      }
    }

    this._lastWaterY = this.y;
  }
});
