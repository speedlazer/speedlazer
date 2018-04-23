import defaults from "lodash/defaults";
import { lookup } from "src/lib/random";

Crafty.c("BulletCircle", {
  bulletCircle(options) {
    this.shootConfig = defaults(options, {
      burstAmount: 10,
      angle: "random"
    });
    return this;
  },

  shootRing(config = {}) {
    const settings = defaults(config, this.shootConfig);
    if (this.hidden && !settings.shootWhenHidden) {
      return;
    }
    this.lastShotAt = 0;
    this.currentBurst += 1;
    const wo = this.weaponOrigin ||
      settings.weaponOrigin || [this.w / 2, this.h / 2];
    wo[0] *= this.scale != null ? this.scale : 1;
    wo[1] *= this.scale != null ? this.scale : 1;

    const angleRange = 360 / settings.burstAmount;
    const ang = settings.angle === "random" ? lookup() : settings.angle;
    const startAngle = ang * angleRange;

    for (let i = 0; i < settings.burstAmount; i++) {
      settings.projectile(
        wo[0] + this.x,
        wo[1] + this.y,
        startAngle + i * angleRange
      );
    }
  }
});
