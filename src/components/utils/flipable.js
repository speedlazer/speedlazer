const Component = "Flipable";

Crafty.c(Component, {
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
    this._mirrorAttachPoints();
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
    this._mirrorAttachPoints();
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

  _mirrorAttachPoints() {
    Object.entries(this.currentAttachHooks || {}).forEach(([name, hook]) => {
      const relX = this.x + this.w - (hook.x + hook.w);
      if (typeof hook.attr === "function") {
        hook.attr({
          x: this.x + relX
        });
      }
      if (typeof hook.unflip === "function") {
        hook.unflip("X");
      }
      if (hook.currentAttachment) {
        const settings = this.attachHookSettings(name);
        const xAlign = settings.attachAlign[1];
        const aspect = { left: 0, right: 1, center: 0.5 }[xAlign] || 0;
        hook.currentAttachment.x = hook.x - hook.currentAttachment.w * aspect;
      }
    });
  },

  _mirrorRotationPoints() {
    this._origin.x = this.w - this._origin.x;
    Array.from(this._children).forEach(child => {
      if (child.origin != null) {
        child._origin.x = child.w - child._origin.x;
      }
      child.rotation = (360 + (360 - child.rotation)) % 360;
    });
  }
});

export default Component;
