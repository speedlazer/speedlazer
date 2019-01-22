import { isPaused } from "src/lib/core/pauseToggle";

const applyHitFlash = (entity, onOff) =>
  entity.forEachPart(part =>
    part.attr({
      hitFlash: onOff ? { _red: 255, _green: 255, _blue: 255 } : false
    })
  );

Crafty.c("DamageSupport", {
  required: "Collision",
  events: {
    HitOn: "_onCollisonHit",
    HitOff: "_onCollisonHitOff"
  },

  init() {
    this.attr({
      health: 0,
      vulnerable: false
    });
    this.allowDamage = this.allowDamage.bind(this);
    this.hasHealth = this.hasHealth.bind(this);
  },

  allowDamage({ health }) {
    this.attr({
      vulnerable: true,
      health
    });
    this.checkHits("Bullet", "Explosion");
  },

  hasHealth() {
    const health = this.attr("health");
    return health > 0;
  },

  _onCollisonHit(collisions) {
    if (isPaused()) {
      return;
    }
    if (this.hidden) {
      return;
    }
    collisions.forEach(e => {
      const bulletOrExplosion = e.obj;
      if (this.vulnerable) {
        if (bulletOrExplosion.damage > 0) {
          applyHitFlash(this, true);
          this.absorbDamage(bulletOrExplosion);
          bulletOrExplosion.damage = 0;

          this.trigger("Hit", { entity: this, projectile: bulletOrExplosion });
        }
      }

      if (bulletOrExplosion.has("Bullet")) {
        bulletOrExplosion.trigger("BulletHit", bulletOrExplosion);
      }
    });
  },

  _onCollisonHitOff() {
    applyHitFlash(this, false);
  },

  absorbDamage(cause) {
    this.health -= cause.damage;

    if (this.health <= 0) {
      this.ignoreHits("Bullet", "Explosion");
      applyHitFlash(this, false);
    }
  }
});
