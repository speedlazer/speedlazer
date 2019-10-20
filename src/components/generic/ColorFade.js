import Animator from "./Animator";
import Gradient from "../Gradient";

export const mix = (v, from, to) => ({
  _red: Math.round(from._red * (1 - v) + to._red * v),
  _green: Math.round(from._green * (1 - v) + to._green * v),
  _blue: Math.round(from._blue * (1 - v) + to._blue * v),
  _strength: from._strength * (1 - v) + to._strength * v
});

export const strToColor = ([string, alpha]) => ({
  _red: parseInt(string.slice(1, 3), 16),
  _green: parseInt(string.slice(3, 5), 16),
  _blue: parseInt(string.slice(5, 7), 16),
  _strength: alpha
});

const toColor = a =>
  a && a.length === 2 && typeof a[0] === "string" ? strToColor(a) : a;

const ColorFade = "ColorFade";

Crafty.c(ColorFade, {
  required: [Animator, Gradient].join(","),

  colorFadeFn(
    nextTopColor,
    nextBottomColor,
    currentTopColor = undefined,
    currentBottomColor = undefined
  ) {
    const colorFade = {
      nextTopColor: toColor(nextTopColor),
      nextBottomColor: toColor(nextBottomColor),
      startTopColor: currentTopColor
        ? toColor(currentTopColor)
        : this.topColor(),
      startBottomColor: currentBottomColor
        ? toColor(currentBottomColor)
        : this.bottomColor()
    };
    return t => {
      this._topColor = mix(t, colorFade.startTopColor, colorFade.nextTopColor);
      this._bottomColor = mix(
        t,
        colorFade.startBottomColor,
        colorFade.nextBottomColor
      );
      this.trigger("Invalidate");
    };
  },

  colorFade(topColor, bottomColor, duration, easing) {
    const fadeFunc = this.colorFadeFn(topColor, bottomColor);
    return this.animate(fadeFunc, duration, easing);
  }
});

export default ColorFade;
