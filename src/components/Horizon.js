import ColorEffects from "./ColorEffects";
import ColorFade from "./generic/ColorFade";
import Gradient from "./Gradient";

Crafty.c("Backdrop", {
  required: ["2D, WebGL", Gradient, ColorFade].join(","),

  init() {
    this.attr({
      x: 0,
      y: 0,
      w: Crafty.viewport.width / Crafty.viewport._scale,
      h: Crafty.viewport.height / Crafty.viewport._scale,
      z: -10000
    });
    this.bind("ViewportScale", this.updateBackdrop);
  },
  updateBackdrop() {
    this.attr({
      w: Crafty.viewport.width / Crafty.viewport._scale,
      h: Crafty.viewport.height / Crafty.viewport._scale
    });
  }
});

let currentBackground = "#000000";

export const setBackgroundColor = (topColor, bottomColor = topColor) => {
  const backdrop = Crafty("Backdrop").get(0) || Crafty.e("Backdrop");
  backdrop.topColor(topColor);
  backdrop.bottomColor(bottomColor);
  currentBackground = bottomColor;
  Crafty("Horizon").forEach(entity =>
    entity.colorDesaturation(currentBackground)
  );
};

export const fadeBackgroundColor = async ({
  topColors,
  bottomColors,
  duration = 100
  //start = 0
}) =>
  new Promise(resolve => {
    const backdrop = Crafty("Backdrop").get(0) || Crafty.e("Backdrop");
    backdrop.colorFade({ duration, skip: 0 }, bottomColors, topColors);
    const updateHorizons = colors => {
      Crafty("Horizon").forEach(horizon =>
        horizon.colorDesaturation(colors.bottomColor)
      );
    };
    backdrop.bind("ColorFadeUpdate", updateHorizons);
    backdrop.one("ColorFadeFinished", () => {
      backdrop.unbind("ColorFadeUpdate", updateHorizons);
      resolve();
    });
  });

Crafty.c("Horizon", {
  required: [ColorEffects].join(","),

  init() {
    this.colorDesaturation(currentBackground);
  }
});
