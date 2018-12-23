import { isPaused } from "src/lib/core/pauseToggle";

Crafty.c("Enemy", {
  required:
    "2D, WebGL, Collision, Tween, Choreography, Hideable, Flipable, Scalable, SunBlock, Hostile",
  events: {
    HitOn: "_onCollisonHit",
    HitOff: "_onCollisonHitOff",
    HitFlash: "applyHitFlash"
  },

  init() {
    this.attr({
      pointsOnHit: 0,
      pointsOnDestroy: 0,
      damage: 2
    });
    return (this.invincible = false);
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
      if (!this.invincible) {
        if (bulletOrExplosion.damage > 0) {
          if (this.juice !== false) {
            this.trigger("HitFlash", true);
          }
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
    this.trigger("HitFlash", false);
  },

  onExplosionHit(e) {
    if (isPaused()) {
      return;
    }
    if (this.hidden) {
      return;
    }
    if (this.invincible) {
      return;
    }
    e.forEach(c => {
      const splosion = c.obj;
      if (splosion.damage > 0) {
        this.trigger("Hit", { entity: this, projectile: splosion });
        if (this.juice !== false) {
          this.trigger("HitFlash", true);
        }
        this.absorbDamage(splosion);
        splosion.damage = 0;
      }
    });
  },

  applyHitFlash(onOff) {
    if (onOff) {
      this.attr({ hitFlash: { _red: 255, _green: 255, _blue: 255 } });
    } else {
      this.attr({ hitFlash: false });
    }
  },

  enemy(options = {}) {
    const enemyOptions = {
      projectile: "Bullet",
      pointsLocation: {
        x: this.w / 2,
        y: this.h / 2
      },
      ...options
    };
    this.reveal();
    this.pointsLocation = enemyOptions.pointsLocation;
    Crafty.trigger("EnemySpawned", this);
    this.checkHits(enemyOptions.projectile, "Explosion");
    if (typeof this.updatedHealth === "function") {
      this.updatedHealth();
    }
    return this;
  },

  absorbDamage(cause) {
    if (cause === null) {
      return;
    }
    const x = this.x + this.pointsLocation.x;
    const y = this.y + this.pointsLocation.y;
    const data = {
      pointsOnHit: this.pointsOnHit,
      pointsOnDestroy: this.pointsOnDestroy,
      location: { x, y }
    };
    this.health -= cause.damage;
    if (typeof this.updatedHealth === "function") {
      this.updatedHealth();
    }

    if (this.health <= 0) {
      Crafty.trigger("EnemyDestroyed", this);
      this.trigger("Destroyed", this);
      this.trigger("Cleanup", this);
      if (!this.__frozen) {
        this.destroy();
      }
      data.chainable = this.chainable;
      if (cause.ship != null) {
        cause.ship.trigger("DestroyTarget", data);
      }
      this.deathCause = cause.ship;
    } else {
      cause.ship && cause.ship.trigger("HitTarget", data);
    }
  }
});
