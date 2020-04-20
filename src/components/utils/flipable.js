import flipRotation from "src/lib/flipRotation";

const Component = "Flipable";

const mirrorParticles = entity => {
  if (!entity.emitter) return;
  const angle = entity.angle || 0;
  entity.emitter.xFlipped = !entity.emitter.xFlipped;
  entity.angle = flipRotation(angle);
  entity.trigger("Change", { angle: entity.angle });
};

Crafty.c(Component, {
  flipX() {
    if (this.xFlipped) {
      return;
    }
    this.xFlipped = true;
    const rot = this._rotation;
    this.rotation = 0;
    try {
      if (typeof this.flip === "function") {
        if (this._flipX) {
          this.unflip("X");
        } else {
          this.flip("X");
        }
      }
      const flipChildren = entity => {
        Array.from(entity._children).forEach(child => {
          const relX = child.x - entity.x;
          if (typeof child.attr === "function") {
            child.attr({
              x: entity.x + entity.w - child.w - relX
            });
            if (child._dx !== undefined) {
              child._dx = -child._dx;
            }
          }
          if (typeof child.flip === "function") {
            if (child._flipX) {
              child.unflip("X");
            } else {
              child.flip("X");
            }
          }
          mirrorParticles(child);
          if (child._children) flipChildren(child);
        });
      };
      flipChildren(this);
    } catch (e) {
      console.log(e);
    }

    this._mirrorCollision();
    this._mirrorRotationPoints();

    this.rotation = -rot;
    return this;
  },

  unflipX() {
    if (!this.xFlipped) {
      return;
    }
    this.xFlipped = false;
    const rot = this._rotation;
    this.rotation = 0;
    try {
      if (typeof this.unflip === "function") {
        if (this._flipX) {
          this.unflip("X");
        } else {
          this.flip("X");
        }
      }
      const unflipChildren = entity => {
        Array.from(entity._children).forEach(child => {
          const relX = entity.x + entity.w - (child.x + child.w);
          if (typeof child.attr === "function") {
            child.attr({
              x: entity.x + relX
            });
          }
          if (child._dx !== undefined) {
            child._dx = -child._dx;
          }
          if (typeof child.unflip === "function") {
            if (child._flipX) {
              child.unflip("X");
            } else {
              child.flip("X");
            }
          }
          mirrorParticles(child);
          if (child._children) unflipChildren(child);
        });
      };
      unflipChildren(this);
    } catch (e) {
      console.log(e);
    }
    this._mirrorCollision();
    this._mirrorRotationPoints();
    this.rotation = -rot;
    return this;
  },

  _mirrorCollision() {
    if (!this.map || !this.map.points) {
      return;
    }

    for (let i = 0; i < this.map.points.length; i++) {
      const p = this.map.points[i];
      if (i % 2 === 0) {
        const dx = p - this.x;
        this.map.points[i] = this.x + (this.w - dx);
      }
    }
  },

  _mirrorRotationPoints() {
    const updateChildren = entity => {
      Array.from(entity._children).forEach(child => {
        if (typeof child.attr === "function") {
          if (child.origin !== null) {
            child._origin.x = child.w - child._origin.x;
          }
          if (child._children) updateChildren(child);
        }
      });
    };
    this._origin.x = this.w - this._origin.x;
    updateChildren(this);
  }
});

export default Component;
