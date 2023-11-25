import Crafty from "../crafty";
import ColorEffects from "./ColorEffects";
import isObject from "lodash/isObject";

let currentBackground = {
  _red: 0,
  _green: 0,
  _blue: 0,
  _strength: 1
};

const Component = "Horizon";

export const getBackgroundColor = () => currentBackground;

export const setBackgroundColor = color => {
  let c = {};
  if (isObject(color)) {
    c = color;
  } else {
    Crafty.assignColor(color, c);
  }
  if (
    currentBackground._red === c._red &&
    currentBackground._green === c._green &&
    currentBackground._blue === c._blue
  )
    return;
  currentBackground = c;
  Crafty(Component).forEach(entity => entity.colorDesaturation(c));
};

Crafty.c(Component, {
  required: [ColorEffects].join(","),

  init() {
    this.colorDesaturation(currentBackground);
  }
});

export default Component;
