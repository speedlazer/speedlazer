import { isPaused } from "src/lib/core/pauseToggle";

const applyHitFlash = (entity, onOff) =>
  entity.forEachPart(part =>
    part.attr({
      hitFlash: onOff ? { _red: 1, _green: 1, _blue: 1 } : false
    })
  );

const DEFAULT_HIT_LIST = ["Bullet", "Explosion"];

Crafty.c("DamageSupport", {
  init() {
    this.attr({
      health: 0,
      vulnerable: false
    });
    this.allowDamage = this.allowDamage.bind(this);
    this.hasHealth = this.hasHealth.bind(this);
    this._onCollisonHit = this._onCollisonHit.bind(this);
    this._onCollisonHitOff = this._onCollisonHitOff.bind(this);
  },

  allowDamage({ health }) {
    this.attr({
      vulnerable: true,
      health
    });

    if (this.has("Composable")) {
      if (this.has("Collision")) {
        this.bind("HitOn", this._onCollisonHit);
        this.bind("HitOff", this._onCollisonHitOff);
        this.checkHits(...DEFAULT_HIT_LIST);
      }
      this.forEachPart(entity => {
        if (entity.has("Collision")) {
          entity.bind("HitOn", this._onCollisonHit);
          entity.bind("HitOff", this._onCollisonHitOff);
          entity.checkHits(...DEFAULT_HIT_LIST);
        }
      });
    } else {
      this.addComponent("Collision");
      this.bind("HitOn", this._onCollisonHit);
      this.bind("HitOff", this._onCollisonHitOff);
      this.checkHits(...DEFAULT_HIT_LIST);
    }
  },

  stopDamage() {
    this.attr({
      vulnerable: false
    });

    applyHitFlash(this, false);

    if (this.has("Composable")) {
      if (this.has("Collision")) {
        this.unbind("HitOn", this._onCollisonHit);
        this.unbind("HitOff", this._onCollisonHitOff);
        this.ignoreHits(...DEFAULT_HIT_LIST);
      }
      this.forEachPart(entity => {
        if (entity.has("Collision")) {
          entity.unbind("HitOn", this._onCollisonHit);
          entity.unbind("HitOff", this._onCollisonHitOff);
          entity.ignoreHits(...DEFAULT_HIT_LIST);
        }
      });
    } else {
      this.ignoreHits(...DEFAULT_HIT_LIST);
    }
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
      this.stopDamage();
    }
  }
});
