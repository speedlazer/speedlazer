import defaults from "lodash/defaults";
import { lookup } from "src/lib/random";

Crafty.c("BurstShot", {
  remove() {
    this.unbind("GameLoop", this._checkForShot);
  },

  burstShot(options) {
    this.shootConfig = defaults(options, {
      targetType: "PlayerControlledShip",
      burstCooldown: 800,
      cooldown: 200,
      burstAmount: 10,
      aim: 0,
      angle: 0,
      angleDeviation: 0
    });
    this.currentBurst = 0;
    this.bind("GameLoop", this._checkForShot);
  },

  _checkForShot(fd) {
    if (this.lastShotAt != null) {
      this.lastShotAt += fd.dt;
      if (this.shootConfig.burstAmount <= this.currentBurst) {
        if (this.lastShotAt < this.shootConfig.burstCooldown) {
          return;
        }
        this.currentBurst = 0;
      } else {
        if (this.lastShotAt < this.shootConfig.cooldown) {
          return;
        }
      }
    }

    const self = this;
    let aimAngle = 0;
    Crafty(this.shootConfig.targetType).each(function() {
      aimAngle = Math.atan2(self.y - this.y, self.x - this.x);
      aimAngle *= 180 / Math.PI;
    });

    const maxRange =
      this.shootConfig.angle + this.shootConfig.aim + this.rotation;
    const minRange =
      this.shootConfig.angle - this.shootConfig.aim + this.rotation;

    let angle = aimAngle;
    if (angle > maxRange) {
      angle = maxRange;
    } else if (angle < minRange) {
      angle = minRange;
    }

    // Add random deviation
    angle =
      angle -
      Math.floor(this.shootConfig.angleDeviation / 2) +
      lookup() * this.shootConfig.angleDeviation;

    angle = (angle + 360) % 360;
    if (this.currentBurst < this.shootConfig.burstAmount) {
      return this._shoot(angle);
    }
  },

  _shoot(angle) {
    if (this.hidden && !this.shootConfig.shootWhenHidden) {
      return;
    }
    this.lastShotAt = 0;
    this.currentBurst += 1;
    const wo = this.weaponOrigin != null ? this.weaponOrigin : [0, 0];
    wo[0] *= this.scale != null ? this.scale : 1;
    wo[1] *= this.scale != null ? this.scale : 1;

    this.shootConfig.projectile(wo[0] + this.x, wo[1] + this.y, angle);
  }
});
