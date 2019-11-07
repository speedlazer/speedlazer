import isObject from "lodash/isObject";

const component = "ColorEffects";

Crafty.c(component, {
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
    this.attr({
      overrideColor: {
        _red: c._red / 255,
        _green: c._green / 255,
        _blue: c._blue / 255
      },
      overrideColorMode: mode
    });

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

export default component;
