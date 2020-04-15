import ParticleEmitter from "src/components/ParticleEmitter";
import { particles } from "data";
import merge from "lodash/merge";

Crafty.c("GravitySupport", {
  init() {
    this.activateGravity = this.activateGravity.bind(this);
    this._onGravityCollisonHit = this._onGravityCollisonHit.bind(this);
  },

  activateGravity() {
    this.addComponent("Motion", "Collision");
    this.ay = 400;

    this.bind("HitOn", this._onGravityCollisonHit);
    this.checkHits("GravitySolid", "GravityLiquid");
  },

  _onGravityCollisonHit(collisions) {
    let groundType = "none";
    let surfaceEntity = null;
    collisions.forEach(e => {
      const surface = e.obj;
      if (surface.has("GravitySolid")) {
        groundType = "solid";
        surfaceEntity = surface;
      }
      if (surface.has("GravityLiquid")) {
        groundType = "liquid";
        surfaceEntity = surface;
      }
    });

    if (groundType === "solid") {
      if (this.vy > 400) {
        // little bounce
        this.attr({ vy: -this.vy / 4 });
      } else {
        this.attr({ ay: 0, ax: 0, vx: 0, vy: 0 });
      }
    }
    if (groundType === "liquid") {
      this.attr({
        ax: 0,
        ay: 0,
        vx: 0,
        vy: this.vy / 8,
        hideBelow: surfaceEntity.y + 30,
        surfaceLevel: surfaceEntity.y
      });
      if (this.liquidParticles) {
        const settings = [].concat(this.liquidParticles, {});

        const emitter = merge({}, particles(settings[0]), settings[1]);
        this.liquidEmitter = Crafty.e(ParticleEmitter)
          .attr({ x: this.x, y: surfaceEntity.y + 20 })
          .particles(emitter);
      }

      this.uniqueBind("EnterFrame", this._sinkAway);
    }
  },

  _sinkAway() {
    const sunk = this.y > this.hideBelow;
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
    if (sunk) {
      this.liquidEmitter.stopEmission();
      this.liquidEmitter.autoDestruct = true;
      this.unbind("EnterFrame", this._sinkAway);
    }
  }
});
