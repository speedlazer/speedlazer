import defaults from "lodash/defaults";
import sample from "lodash/sample";

Crafty.c("ShootOnSight", {
  required: "Delay",

  remove() {
    this.unbind("GameLoop", this._checkForShot);
  },

  shootOnSight(options) {
    this.shootConfig = defaults(options, {
      targetType: "PlayerControlledShip",
      sightAngle: 10,
      shootWhenHidden: false,
      cooldown: 800
    });

    const wo = this.weaponOrigin != null ? this.weaponOrigin : [0, 0];
    wo[0] *= this.scale != null ? this.scale : 1;
    wo[1] *= this.scale != null ? this.scale : 1;
    if (this.muzzleFlash == null) {
      this.muzzleFlash = Crafty.e("Sphere")
        .attr({
          x: this.x + wo[0],
          y: this.y + wo[1],
          alpha: 0
        })
        .muzzle();
      this.attach(this.muzzleFlash);
    }
    this.muzzleFlash.attr({ alpha: 0 });

    this.lastShotAt = 0;
    this.bind("GameLoop", this._checkForShot);
    this.bind("Revealing", () => {
      this.muzzleFlash.attr({ alpha: 0 });
    });
    return this;
  },

  _checkForShot(fd) {
    if (this.shooting) {
      return;
    }
    if (this.lastShotAt != null) {
      this.lastShotAt += fd.dt;
      if (this.lastShotAt < this.shootConfig.cooldown) {
        return;
      }
    }

    const self = this;
    const targets = [];
    Crafty(this.shootConfig.targetType).each(function() {
      const angle = self._determineAngle(this);
      if (Math.abs(angle - self.rotation) < self.shootConfig.sightAngle) {
        targets.push(this);
      }
    });
    if (targets.length > 0) {
      const target = sample(targets);
      this._shoot(target);
    }
  },

  _determineAngle(entity) {
    let angle = Math.atan2(this.y - entity.y, this.x - entity.x);
    angle *= 180 / Math.PI;
    if (this.xFlipped) {
      angle += 180;
    }
    return (angle + 360) % 360;
  },

  _shoot(target) {
    if (this.hidden && !this.shootConfig.shootWhenHidden) {
      return;
    }
    this.shooting = true;

    this.muzzleFlash.attr({ alpha: 1 });
    this.delay(() => {
      this.lastShotAt = 0;
      const wo = this.weaponOrigin != null ? this.weaponOrigin : [0, 0];
      wo[0] *= this.scale != null ? this.scale : 1;
      wo[1] *= this.scale != null ? this.scale : 1;

      let angle = this._determineAngle(target);
      if (this.xFlipped) {
        angle += 180;
      }
      angle = (angle + 360) % 360;

      this.shootConfig.projectile(wo[0] + this.x, wo[1] + this.y, angle);
      this.muzzleFlash.attr({ alpha: 0 });
      this.shooting = false;
    }, 300);
  }
});
