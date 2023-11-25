import Crafty from "../crafty";

const Component = "Health";

Crafty.c(Component, {
  required: "Color",
  events: {
    EnterFrame() {}
  },
  properties: {
    health: {
      set: function(value) {
        this._health = value;
        this.w = Math.min(this.maxWidth, this.maxWidth * value);
        this._green = 144 * this._health;
        this._red = 144 * (1 - this._health);
        this.trigger("Invalidate");
      },
      get: function() {
        return this._health;
      },
      configurable: true,
      enumerable: true
    },
    _health: { value: 1.0, writable: true, enumerable: false }
  },
  init() {
    this.color(0, 144, 0);
  }
});

export default Component;
