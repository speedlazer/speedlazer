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
    let surfaceY = null;
    collisions.forEach(e => {
      const surface = e.obj;
      if (surface.has("GravitySolid")) {
        groundType = "solid";
        surfaceY = surface.y;
      }
      if (surface.has("GravityLiquid")) {
        groundType = "liquid";
        surfaceY = surface.y;
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
        hideBelow: surfaceY + 30
      });
    }
  }
});
