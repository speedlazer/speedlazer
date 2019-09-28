Crafty.c("Flipable", {
  flipX() {
    if (this.xFlipped) {
      return;
    }
    this.xFlipped = true;
    try {
      if (typeof this.flip === "function") {
        this.flip("X");
      }

      Array.from(this._children).forEach(child => {
        const relX = child.x - this.x;
        if (typeof child.attr === "function") {
          child.attr({
            x: this.x + this.w - child.w - relX
          });
        }
        if (typeof child.flip === "function") {
          child.flip("X");
        }
      });
    } catch (e) {
      console.log(e);
    }

    this._mirrorCollision();
    this._mirrorRotationPoints();
    this._mirrorWeaponOrigin();
    return this;
  },

  unflipX() {
    if (!this.xFlipped) {
      return;
    }
    this.xFlipped = false;
    try {
      if (typeof this.unflip === "function") {
        this.unflip("X");
      }
      Array.from(this._children).forEach(child => {
        const relX = this.x + this.w - (child.x + child.w);
        if (typeof child.attr === "function") {
          child.attr({
            x: this.x + relX
          });
        }
        if (typeof child.unflip === "function") {
          child.unflip("X");
        }
      });
    } catch (e) {
      console.log(e);
    }
    this._mirrorCollision();
    this._mirrorRotationPoints();
    this._mirrorWeaponOrigin();
    return this;
  },

  _mirrorCollision() {
    if (!this.map.points) {
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
    this._origin.x = this.w - this._origin.x;
    Array.from(this._children).forEach(child => {
      if (child.origin != null) {
        child._origin.x = child.w - child._origin.x;
      }
      child.rotation = (360 + (360 - child.rotation)) % 360;
    });
  },

  _mirrorWeaponOrigin() {
    if (this.weaponOrigin == null) {
      return;
    }
    return (this.weaponOrigin = [
      this.w - this.weaponOrigin[0],
      this.weaponOrigin[1]
    ]);
  }
});
