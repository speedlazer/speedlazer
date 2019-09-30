import ColorEffects from "src/components/ColorEffects";

Crafty.c("Hideable", {
  _hidden: false,

  properties: {
    hidden: {
      set(v) {
        this._updateHidden(v);
      },
      get() {
        return this._hidden;
      },
      configurable: true,
      enumerable: true
    },
    _hidden: { enumerable: false }
  },

  init() {
    this.requires(ColorEffects);
  },

  sendToBackground(scale, z) {
    this._originalZ = this.z;
    this.attr({ scale, z });
    Array.from(this._children)
      .filter(child => child.attr)
      .forEach(child => {
        const zOff = child.z - this._originalZ;
        child.attr({ z: z + zOff });
      });

    this.hidden = true;
    return this;
  },

  _updateHidden(newHidden) {
    if (this._hidden === newHidden) {
      return;
    }
    this._hidden = newHidden;
    if (newHidden) {
      this.trigger("Hiding", this);
    } else {
      this.trigger("Revealing", this);
    }
  },

  hide(hideMarker, options) {
    this.hideMarker = hideMarker;
    if (options.below && this.has("Sprite") && this.rotation === 0) {
      this.hideAt = options.below;
      Array.from(this._children)
        .filter(child => child.attr)
        .forEach(child => child.attr({ hideAt: options.below }));
    } else {
      this.attr({ alpha: 0.0 });
      Array.from(this._children)
        .filter(child => child.attr)
        .forEach(child => child.attr({ alpha: 0.0 }));
    }

    this.hidden = true;
    return this;
  },

  hideBelow(yValue) {
    this.hideAt = yValue;
    Array.from(this._children)
      .filter(child => child.attr)
      .forEach(child => child.attr({ hideAt: yValue }));
  },

  reveal() {
    if (this.hideMarker != null) {
      this.hideMarker.destroy();
    }
    const scale = 1.0;
    Array.from(this._children)
      .filter(child => child.attr)
      .forEach(child => {
        const zOff = child.z - this.z;
        child.attr({ z: this._originalZ + zOff });
      });

    this.attr({
      scale,
      alpha: 1.0,
      z: this._originalZ,
      hideAt: null
    });

    Array.from(this._children)
      .filter(child => child.attr)
      .forEach(child => child.attr({ alpha: 1.0, hideAt: null }));

    this.hidden = false;
    return this;
  },

  remove() {
    if (this.hideMarker) {
      if (this.hideMarker.hasPool) {
        this.hideMarker.recycle();
      } else {
        this.hideMarker.destroy();
      }
    }
  }
});
