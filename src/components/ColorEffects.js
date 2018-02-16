import isObject from "lodash/isObject";

Crafty.c("ColorEffects", {
  colorDesaturation(color) {
    if (color == null) {
      return this;
    }
    const c = {};
    Crafty.assignColor(color, c);
    this.attr({ desaturationColor: c });

    this.trigger("Invalidate");
    return this;
  },

  // mode: 'all', 'partial'
  colorOverride(color, mode) {
    if (mode == null) {
      mode = "all";
    }
    if (color == null) {
      return this;
    }
    let c = {};
    if (isObject(color)) {
      c = color;
    } else {
      Crafty.assignColor(color, c);
    }
    this.attr({ overrideColor: c, overrideColorMode: mode });

    this.trigger("Invalidate");
    return this;
  },

  clearColorOverride() {
    this.attr({ overrideColor: null, overrideColorMode: "all" });
    this.trigger("Invalidate");
    return this;
  },

  saturationGradient(start, end) {
    this.attr({ topDesaturation: start, bottomDesaturation: end });
    return this;
  }
});
