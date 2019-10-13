const Scalable = "Scalable";

Crafty.c(Scalable, {
  properties: {
    scaleX: {
      set(v) {
        this._updateScaleX(v);
      },
      get() {
        return this._scaleX;
      },
      configurable: true,
      enumerable: true
    },
    _scaleX: {
      value: 1.0,
      writable: true,
      enumerable: false,
      configurable: false
    },
    scaleY: {
      set(v) {
        this._updateScaleY(v);
      },
      get() {
        return this._scaleY;
      },
      configurable: true,
      enumerable: true
    },
    _scaleY: {
      value: 1.0,
      writable: true,
      enumerable: false,
      configurable: false
    },
    scale: {
      set(v) {
        this._updateScale(v);
      },
      get() {
        return this._scale;
      },
      configurable: true,
      enumerable: true
    },
    _scale: {
      value: 1.0,
      writable: true,
      enumerable: false,
      configurable: false
    }
  },

  _updateScaleX(newScale) {
    const oldScale = this._scaleX;
    this._scaleX = newScale;

    const oldW = this.w;
    this.w = (this.w / oldScale) * newScale;
    this.x = this.x + (oldW - this.w) / 2;

    this._children
      .filter(child => child.attr)
      .forEach(child => {
        const relX = child.x - this.x;
        child.attr({
          x: this.x + (relX / oldScale) * newScale,
          w: ((child.w + oldW - this.w) / oldScale) * newScale
        });
      });

    // Scale collision shape
    if (this.map && this.map.points) {
      this.map.points = this.map.points.map((point, i) => {
        if (i % 2 === 1) return this.y;
        const origin = i % 2 === 0 ? this.x : this.y;
        return origin + ((point - origin) / oldScale) * newScale;
      });
    }
  },

  _updateScaleY(newScale) {
    const oldScale = this._scaleY;
    this._scaleY = newScale;

    const oldH = this.h;
    this.h = (this.h / oldScale) * newScale;
    this.y = this.y + (oldH - this.h) / 2;

    this._children
      .filter(child => child.attr)
      .forEach(child => {
        const relY = child.y - this.y;
        child.attr({
          y: this.y + (relY / oldScale) * newScale,
          h: ((child.h + oldH - this.h) / oldScale) * newScale
        });
      });

    // Scale collision shape
    if (this.map && this.map.points) {
      this.map.points = this.map.points.map((point, i) => {
        if (i % 2 === 0) return this.y;
        const origin = i % 2 === 0 ? this.x : this.y;
        return origin + ((point - origin) / oldScale) * newScale;
      });
    }
  },

  _updateScale(newScale) {
    const oldScale = this._scale;
    this._scale = newScale;

    const oldW = this.w;
    const oldH = this.h;

    this.w = (this.w / oldScale) * newScale;
    this.x = this.x + (oldW - this.w) / 2;
    this.h = (this.h / oldScale) * newScale;
    this.y = this.y + (oldH - this.h) / 2;

    this._children
      .filter(child => child.attr)
      .forEach(child => {
        const relX = child.x - this.x;
        const relY = child.y - this.y;
        child.attr({
          x: this.x + (relX / oldScale) * newScale,
          y: this.y + (relY / oldScale) * newScale,
          w: ((child.w + oldW - this.w) / oldScale) * newScale,
          h: ((child.h + oldH - this.h) / oldScale) * newScale
        });
      });

    // Scale collision shape
    if (this.map && this.map.points) {
      this.map.points = this.map.points.map((point, i) => {
        const origin = i % 2 === 0 ? this.x : this.y;
        return origin + ((point - origin) / oldScale) * newScale;
      });
    }
  }
});

export default Scalable;
