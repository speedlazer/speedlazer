import isObject from "lodash/isObject";
import Crafty from "../crafty";

const Component = "ColorEffects";

Crafty.c(Component, {
  init() {
    this.attr({
      overrideColor: {
        _red: 0,
        _green: 0,
        _blue: 0
      },
      overrideColorMode: "none",
      overrideColorStrength: 0
    });
  },

  colorDesaturation(color) {
    if (color === null) {
      return this;
    }
    this.attr({
      desaturationColor: {
        _red: color._red / 255,
        _green: color._green / 255,
        _blue: color._blue / 255
      }
    });

    this.trigger("Invalidate");
    return this;
  },

  // mode: 'all', 'partial'
  colorOverride(color, mode = "all", strength = 1.0) {
    if (color == null) {
      return this;
    }
    let c = {};
    if (isObject(color)) {
      c = color;
    } else {
      Crafty.assignColor(color, c);
    }
    this.attr({
      overrideColor: {
        _red: c._red / 255,
        _green: c._green / 255,
        _blue: c._blue / 255
      },
      overrideColorMode: mode,
      overrideColorStrength: strength
    });

    this.trigger("Invalidate");
    return this;
  },

  clearColorOverride() {
    this.attr({ overrideColorMode: "none" });
    this.trigger("Invalidate");
    return this;
  },

  saturationGradient(start, end) {
    this.attr({ topDesaturation: start, bottomDesaturation: end });
    return this;
  }
});

export default Component;
