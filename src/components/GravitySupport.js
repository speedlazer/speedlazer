import ParticleEmitter from "./ParticleEmitter";
import PausableMotion from "./PausableMotion";
import { particles } from "../data";
import merge from "lodash/merge";
import Crafty from "../crafty";

Crafty.c("GravitySupport", {
  init() {
    this.activateGravity = this.activateGravity.bind(this);
    this._onGravityCollisionHit = this._onGravityCollisionHit.bind(this);
  },

  activateGravity(surfaces = ["GravitySolid", "GravityLiquid"]) {
    this.addComponent("Motion", "Collision", PausableMotion);
    this.ay = 400;

    this.bind("HitOn", this._onGravityCollisionHit);
    this.checkHits(...surfaces);
  },

  _onGravityCollisionHit(collisions) {
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
      if (this.vy > 200) {
        // little bounce
        this.attr({ vy: -this.vy / 4 });
      } else {
        this.attr({ ay: 0, ax: 0, vx: 0, vy: 0 });
        this.showState && this.showState("crashed");
        // TODO: Destroy if surface is destroyed or frozen
        surfaceEntity.attach(this);
      }
    }
    if (groundType === "liquid") {
      this.attr({
        ax: 0,
        ay: 0,
        vx: 0,
        vy: this.vy / surfaceEntity.liquidDensity,
        hideBelow: surfaceEntity.y + 30,
        surfaceLevel: surfaceEntity.y
      });
      if (surfaceEntity.liquidParticles) {
        const settings = [].concat(surfaceEntity.liquidParticles, {
          emitter: {
            w: this.w,
            h: 10,
            amount: this.w * 1.5
          }
        });

        const emitter = merge({}, particles(settings[0]), settings[1]);
        this.liquidEmitter = Crafty.e(ParticleEmitter)
          .attr({ x: this.x, y: surfaceEntity.y + 20 })
          .particles(emitter);
      }

      this.uniqueBind("GameLoop", this._sinkAway);
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
      this.destroy();
      this.unbind("GameLoop", this._sinkAway);
    }
  }
});
