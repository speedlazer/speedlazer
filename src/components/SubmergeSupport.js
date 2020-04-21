import ParticleEmitter from "src/components/ParticleEmitter";
import { particles } from "data";
import merge from "lodash/merge";

Crafty.c("SubmergeSupport", {
  init() {
    this._onGravityCollisonHit = this._onGravityCollisonHit.bind(this);
    this.addComponent("Motion", "Collision");
    this.bind("HitOn", this._onGravityCollisonHit);
    this.checkHits("GravityLiquid");
    this.clearShadow = this.clearShadow.bind(this);
  },

  _onGravityCollisonHit(collisions) {
    if (this.surface) return;
    let surfaceEntity = null;
    collisions.forEach(e => {
      const surface = e.obj;
      if (surface.has("GravityLiquid")) {
        surfaceEntity = surface;
      }
    });

    this.attr({
      hideBelow: surfaceEntity.y + 30,
      surface: surfaceEntity
    });
    if (surfaceEntity.liquidParticles) {
      const settings = [].concat(surfaceEntity.liquidParticles, {
        emitter: {
          w: this.w,
          h: 10,
          amount: Math.min(Math.max(this.w * 1.5, 100), 500)
        }
      });

      const emitter = merge({}, particles(settings[0]), settings[1]);
      this.liquidEmitter = Crafty.e(ParticleEmitter)
        .attr({ x: this.x, y: surfaceEntity.y + 20 })
        .particles(emitter);
    }

    this.uniqueBind("EnterFrame", this._sinkAway);
  },

  clearShadow() {
    if (this.shadow) {
      this.shadow.destroy();
      this.shadow = null;
    }
  },

  _sinkAway() {
    const sunk = this.y > this.hideBelow;
    const risen = this.y + this.h < this.hideBelow - 30;
    Object.values(this.currentAttachHooks).forEach(hook => {
      if (
        hook.currentAttachment &&
        hook.currentAttachment.emitter &&
        hook.currentAttachment.emitter.emissionRate > 0 &&
        hook.y > this.hideBelow
      ) {
        hook.currentAttachment.emitter.stopEmission();
      }
    });
    if (this.shadow) {
      this.shadow.x = this.x;
      this.shadow.alpha = 1 - (this.y - this.hideBelow) / 200;
    }
    if ((sunk || risen) && this.liquidEmitter) {
      this.liquidEmitter.stopEmission();
      this.liquidEmitter.autoDestruct = true;
      this.liquidEmitter = null;
      // Render shadow
      if (sunk) {
        this.shadow = Crafty.e(`2D, WebGL, ${this.submergeSprite}`).attr({
          w: this.w,
          x: this.x,
          y: this.hideBelow - 20
        });
        this.uniqueBind("Remove", this.clearShadow);
      }
    } else if (this.liquidEmitter === null && !sunk && !risen) {
      if (this.shadow) {
        this.shadow.destroy();
        this.shadow = null;
      }
      // Render shadow
      const settings = [].concat(this.surface.liquidParticles, {
        emitter: {
          w: this.w,
          h: 10,
          amount: Math.min(Math.max(this.w * 1.5, 100), 500)
        }
      });

      const emitter = merge({}, particles(settings[0]), settings[1]);
      this.liquidEmitter = Crafty.e(ParticleEmitter)
        .attr({ x: this.x, y: this.surface.y + 20 })
        .particles(emitter);
    }
  }
});
