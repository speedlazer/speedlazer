Crafty.c("Scalable", {
  properties: {
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

  _updateScale(newScale) {
    const oldScale = this._scale;
    this._scale = newScale;

    const oldW = this.w;
    const oldH = this.h;

    this.w = (this.w / oldScale) * newScale;
    this.h = (this.h / oldScale) * newScale;

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
