import ColorEffects from "./ColorEffects";
import isObject from "lodash/isObject";

let currentBackground = {
  _red: 0,
  _green: 0,
  _blue: 0,
  _strength: 1
};

export const getBackgroundColor = () => currentBackground;

export const setBackgroundColor = color => {
  let c = {};
  if (isObject(color)) {
    c = color;
  } else {
    Crafty.assignColor(color, c);
  }
  currentBackground = c;
  Crafty("Horizon").forEach(entity => entity.colorDesaturation(c));
};

Crafty.c("Horizon", {
  required: [ColorEffects].join(","),

  init() {
    this.colorDesaturation(currentBackground);
  }
});
