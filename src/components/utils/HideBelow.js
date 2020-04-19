Crafty.c("HideBelow", {
  properties: {
    hideBelow: {
      set(v) {
        this._hideBelow = v;
        this.trigger("Invalidate");
      },
      get() {
        return this._hideBelow;
      },
      configurable: true,
      enumerable: true
    },
    _hideBelow: {
      writable: true,
      enumerable: false,
      configurable: false
    },
    hideAbove: {
      set(v) {
        this._hideAbove = v;
        this.trigger("Invalidate");
      },
      get() {
        return this._hideAbove;
      },
      configurable: true,
      enumerable: true
    },
    _hideAbove: {
      writable: true,
      enumerable: false,
      configurable: false
    }
  }
});
